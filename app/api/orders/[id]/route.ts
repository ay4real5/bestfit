import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateFields: Record<string, unknown> = {};
    if (body.status) updateFields.status = body.status;
    if (body.paymentReference) updateFields.payment_reference = body.paymentReference;
    if (body.paidAt) updateFields.paid_at = body.paidAt;

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update(updateFields)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating order:", error);
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("PUT /api/orders/[id] error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
