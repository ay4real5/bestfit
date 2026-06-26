import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    let query = supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (email) {
      query = query.eq("customer_email", email);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      id,
      items,
      subtotal,
      deliveryCost,
      discount,
      promoCode,
      total,
      status,
      customerEmail,
      customerName,
      address,
      city,
      phone,
      deliveryMethod,
      paymentMethod,
      proofOfPayment,
      createdAt,
    } = body;

    if (!id || !customerEmail || !total) {
      return NextResponse.json(
        { error: "Order ID, customer email, and total are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        id,
        items: JSON.stringify(items),
        subtotal,
        delivery_cost: deliveryCost,
        discount: discount || 0,
        promo_code: promoCode,
        total,
        status: status || "pending",
        customer_email: customerEmail,
        customer_name: customerName,
        address,
        city,
        phone,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        proof_of_payment: proofOfPayment,
        created_at: createdAt || new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating order:", error);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
