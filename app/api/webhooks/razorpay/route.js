import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/utils";
import { PAYMENT_TRANSACTIONS, SUBSCRIPTIONS, USER_DETAILS } from "@/utils/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);
    console.log("Razorpay webhook event:", event.event, event.payload);

    switch (event.event) {
      case "payment.captured":
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
        
      case "payment.failed":
        await handlePaymentFailed(event.payload.payment.entity);
        break;
        
      case "subscription.activated":
        await handleSubscriptionActivated(event.payload.subscription.entity);
        break;
        
      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.payload.subscription.entity);
        break;
        
      case "subscription.completed":
        await handleSubscriptionCompleted(event.payload.subscription.entity);
        break;
        
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    return NextResponse.json({ status: "ok" });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function handlePaymentCaptured(payment) {
  try {
    // Update payment transaction
    const transaction = await db
      .select()
      .from(PAYMENT_TRANSACTIONS)
      .where(eq(PAYMENT_TRANSACTIONS.razorpay_payment_id, payment.id))
      .limit(1)
      .execute();

    if (transaction.length === 0) {
      console.error("Transaction not found for payment:", payment.id);
      return;
    }

    await db
      .update(PAYMENT_TRANSACTIONS)
      .set({
        status: "paid",
        transaction_date: new Date(payment.created_at * 1000),
        payment_method: payment.method,
        metadata: JSON.stringify(payment),
      })
      .where(eq(PAYMENT_TRANSACTIONS.razorpay_payment_id, payment.id))
      .execute();

    console.log("Payment captured successfully:", payment.id);
    
  } catch (error) {
    console.error("Error handling payment captured:", error);
  }
}

async function handlePaymentFailed(payment) {
  try {
    await db
      .update(PAYMENT_TRANSACTIONS)
      .set({
        status: "failed",
        failure_reason: payment.error_description || "Payment failed",
        metadata: JSON.stringify(payment),
      })
      .where(eq(PAYMENT_TRANSACTIONS.razorpay_payment_id, payment.id))
      .execute();

    console.log("Payment failed updated:", payment.id);
    
  } catch (error) {
    console.error("Error handling payment failed:", error);
  }
}

async function handleSubscriptionActivated(subscription) {
  try {
    await db
      .update(SUBSCRIPTIONS)
      .set({
        status: "active",
        razorpay_subscription_id: subscription.id,
        start_date: new Date(subscription.start_at * 1000),
        end_date: new Date(subscription.end_at * 1000),
      })
      .where(eq(SUBSCRIPTIONS.razorpay_subscription_id, subscription.id))
      .execute();

    console.log("Subscription activated:", subscription.id);
    
  } catch (error) {
    console.error("Error handling subscription activated:", error);
  }
}

async function handleSubscriptionCancelled(subscription) {
  try {
    await db
      .update(SUBSCRIPTIONS)
      .set({
        status: "cancelled",
        auto_renew: false,
      })
      .where(eq(SUBSCRIPTIONS.razorpay_subscription_id, subscription.id))
      .execute();

    // Update user's subscription status
    const sub = await db
      .select({ user_id: SUBSCRIPTIONS.user_id })
      .from(SUBSCRIPTIONS)
      .where(eq(SUBSCRIPTIONS.razorpay_subscription_id, subscription.id))
      .limit(1)
      .execute();

    if (sub.length > 0) {
      await db
        .update(USER_DETAILS)
        .set({
          subscription_status: "cancelled",
        })
        .where(eq(USER_DETAILS.id, sub[0].user_id))
        .execute();
    }

    console.log("Subscription cancelled:", subscription.id);
    
  } catch (error) {
    console.error("Error handling subscription cancelled:", error);
  }
}

async function handleSubscriptionCompleted(subscription) {
  try {
    await db
      .update(SUBSCRIPTIONS)
      .set({
        status: "expired",
      })
      .where(eq(SUBSCRIPTIONS.razorpay_subscription_id, subscription.id))
      .execute();

    // Update user's plan to starter and subscription status to expired
    const sub = await db
      .select({ user_id: SUBSCRIPTIONS.user_id })
      .from(SUBSCRIPTIONS)
      .where(eq(SUBSCRIPTIONS.razorpay_subscription_id, subscription.id))
      .limit(1)
      .execute();

    if (sub.length > 0) {
      await db
        .update(USER_DETAILS)
        .set({
          plan: "starter",
          subscription_status: "expired",
          current_subscription_id: null,
        })
        .where(eq(USER_DETAILS.id, sub[0].user_id))
        .execute();
    }

    console.log("Subscription completed/expired:", subscription.id);
    
  } catch (error) {
    console.error("Error handling subscription completed:", error);
  }
}