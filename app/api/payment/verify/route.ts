import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");
    const trxref = searchParams.get("trxref");

    const ref = reference || trxref;
    if (!ref) {
      return NextResponse.json(
        { error: "No transaction reference provided" },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: "Paystack secret key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(ref)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack verification error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to verify payment" },
        { status: 400 }
      );
    }

    const paymentData = data.data;
    const orderId = paymentData.metadata?.order_id || paymentData.reference;
    const isSuccessful = paymentData.status === "success";

    // Update order status in Supabase if payment is successful
    if (isSuccessful) {
      const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          payment_reference: ref,
          paid_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      if (updateError) {
        console.error("Error updating order status after payment:", updateError);
      }
    }

    return NextResponse.json({
      success: isSuccessful,
      status: paymentData.status,
      orderId,
      reference: ref,
      amount: paymentData.amount / 100, // Convert kobo back to naira
      gatewayResponse: paymentData.gateway_response,
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
