import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, amount, orderId, callbackUrl } = body;

    if (!email || !amount || !orderId) {
      return NextResponse.json(
        { error: "Email, amount, and orderId are required" },
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

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo
        reference: orderId,
        callback_url: callbackUrl || `${request.nextUrl.origin}/checkout/verify`,
        metadata: {
          orderId,
          custom_fields: [
            {
              display_name: "Order ID",
              variable_name: "order_id",
              value: orderId,
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack initialization error:", data);
      return NextResponse.json(
        { error: data.message || "Failed to initialize payment" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
      accessCode: data.data.access_code,
    });
  } catch (error) {
    console.error("Payment initialize error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
