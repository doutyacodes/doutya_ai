import { NextResponse } from "next/server";
import { authenticate } from "@/lib/jwtMiddleware";
import Razorpay from "razorpay";
import { db } from "@/utils";
import { PAYMENT_TRANSACTIONS, SUBSCRIPTIONS, SUBSCRIPTION_PLANS } from "@/utils/schema";
import { eq } from "drizzle-orm";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  const authResult = await authenticate(request);
  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userData = authResult.decoded_Data;
  const userId = userData.id;
  const { plan, billingCycle = 'monthly' } = await request.json();

  if (!plan) {
    return NextResponse.json(
      { error: "Plan is required" },
      { status: 400 }
    );
  }

  try {
    // Get plan details from database
    const planDetails = await db
      .select()
      .from(SUBSCRIPTION_PLANS)
      .where(eq(SUBSCRIPTION_PLANS.plan_id, plan))
      .limit(1)
      .execute();

    if (planDetails.length === 0) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const selectedPlan = planDetails[0];
    const amount = billingCycle === 'yearly' 
      ? selectedPlan.yearly_price 
      : selectedPlan.monthly_price;

    // Create Razorpay order
    const orderOptions = {
      amount: Math.round(amount * 100), // Convert to paisa
      currency: selectedPlan.currency || 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        user_id: userId.toString(),
        plan: plan,
        billing_cycle: billingCycle,
      },
    };

    const order = await razorpay.orders.create(orderOptions);

    // Save transaction record
    const transactionData = {
      user_id: userId,
      razorpay_order_id: order.id,
      amount: amount,
      currency: selectedPlan.currency || 'INR',
      status: 'created',
      payment_gateway: 'razorpay',
      metadata: JSON.stringify({
        plan: plan,
        billing_cycle: billingCycle,
        razorpay_order: order
      }),
    };

    await db
      .insert(PAYMENT_TRANSACTIONS)
      .values(transactionData)
      .execute();

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      planDetails: {
        name: selectedPlan.name,
        price: amount,
        billingCycle: billingCycle,
      },
    });

  } catch (error) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}