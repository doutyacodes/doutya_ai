import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import crypto from "crypto";
import { db } from "@/utils";
import { PAYMENT_TRANSACTIONS, SUBSCRIPTIONS, USER_DETAILS } from "@/utils/schema";
import { eq, and } from "drizzle-orm";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    plan,
    billingCycle 
  } = await request.json();

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json(
      { error: "Missing payment verification data" },
      { status: 400 }
    );
  }

  try {
    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Update payment transaction
    await db
      .update(PAYMENT_TRANSACTIONS)
      .set({
        razorpay_payment_id: razorpay_payment_id,
        razorpay_signature: razorpay_signature,
        status: 'paid',
        transaction_date: new Date(),
        payment_method: 'razorpay',
      })
      .where(
        and(
          eq(PAYMENT_TRANSACTIONS.razorpay_order_id, razorpay_order_id),
          eq(PAYMENT_TRANSACTIONS.user_id, userId)
        )
      )
      .execute();

    // Get the payment transaction details
    const transaction = await db
      .select()
      .from(PAYMENT_TRANSACTIONS)
      .where(eq(PAYMENT_TRANSACTIONS.razorpay_order_id, razorpay_order_id))
      .limit(1)
      .execute();

    if (transaction.length === 0) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date();
    
    if (billingCycle === 'yearly') {
      endDate.setFullYear(startDate.getFullYear() + 1);
    } else {
      endDate.setMonth(startDate.getMonth() + 1);
    }

    // Create or update subscription
    const subscriptionData = {
      user_id: userId,
      plan_type: plan,
      status: 'active',
      start_date: startDate,
      end_date: endDate,
      amount: transaction[0].amount,
      currency: transaction[0].currency,
      billing_cycle: billingCycle,
      auto_renew: true,
    };

    // Check if user has existing active subscription
    const existingSubscription = await db
      .select()
      .from(SUBSCRIPTIONS)
      .where(
        and(
          eq(SUBSCRIPTIONS.user_id, userId),
          eq(SUBSCRIPTIONS.status, 'active')
        )
      )
      .limit(1)
      .execute();

    let subscriptionId;
    
    if (existingSubscription.length > 0) {
      // Update existing subscription
      await db
        .update(SUBSCRIPTIONS)
        .set({
          ...subscriptionData,
          updated_at: new Date(),
        })
        .where(eq(SUBSCRIPTIONS.id, existingSubscription[0].id))
        .execute();
      
      subscriptionId = existingSubscription[0].id;
    } else {
      // Create new subscription
      const newSubscription = await db
        .insert(SUBSCRIPTIONS)
        .values(subscriptionData)
        .execute();
      
      subscriptionId = newSubscription[0].insertId;
    }

    // Update payment transaction with subscription ID
    await db
      .update(PAYMENT_TRANSACTIONS)
      .set({ subscription_id: subscriptionId })
      .where(eq(PAYMENT_TRANSACTIONS.razorpay_order_id, razorpay_order_id))
      .execute();

    // Update user's plan in USER_DETAILS
    await db
      .update(USER_DETAILS)
      .set({
        plan: plan,
        current_subscription_id: subscriptionId,
        subscription_end_date: endDate,
        subscription_status: 'active',
      })
      .where(eq(USER_DETAILS.id, userId))
      .execute();

    // Generate new JWT token with updated plan
    const newUserData = {
      ...userData,
      plan: plan,
      subscription_status: 'active',
      subscription_end_date: endDate,
    };

    const token = jwt.sign(newUserData, process.env.JWT_SECRET_KEY, {
      expiresIn: "30d",
    });

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${plan} plan!`,
      token: token,
      subscription: {
        id: subscriptionId,
        plan: plan,
        status: 'active',
        startDate: startDate,
        endDate: endDate,
        billingCycle: billingCycle,
      },
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    
    // Update transaction as failed
    try {
      await db
        .update(PAYMENT_TRANSACTIONS)
        .set({
          status: 'failed',
          failure_reason: error.message,
        })
        .where(eq(PAYMENT_TRANSACTIONS.razorpay_order_id, razorpay_order_id))
        .execute();
    } catch (updateError) {
      console.error("Error updating failed transaction:", updateError);
    }

    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}