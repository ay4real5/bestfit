"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No transaction reference found");
      return;
    }

    fetch(`/api/payment/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus("success");
          setOrderId(data.orderId || reference);
          setMessage(data.gatewayResponse || "Payment successful");
        } else {
          setStatus("failed");
          setMessage(data.gatewayResponse || data.error || "Payment verification failed");
        }
      })
      .catch((err) => {
        setStatus("failed");
        setMessage("Failed to verify payment");
        console.error(err);
      });
  }, [reference]);

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center md:px-6">
      {status === "loading" && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-6" />
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">Verifying Payment...</h1>
          <p className="mt-3 text-stone-500">Please wait while we confirm your payment</p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mb-8">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Payment Confirmed</span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Payment Successful!</h1>
          <p className="mt-2 text-lg font-mono text-stone-500">{orderId}</p>
          <p className="mt-4 max-w-md text-stone-500">{message}</p>
          <p className="mt-2 text-sm text-stone-400">Your order has been confirmed and is being processed.</p>
          <Link
            href="/products"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 mb-8">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Payment Failed</h1>
          <p className="mt-4 max-w-md text-stone-500">{message}</p>
          <Link
            href="/checkout"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          >
            Try Again <ArrowRight className="h-4 w-4" />
          </Link>
        </>
      )}
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-32 text-center text-stone-400">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
