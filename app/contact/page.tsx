"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, ArrowLeft } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">Get in Touch</span>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Contact Us</h1>
        <p className="mt-3 text-stone-500">Have questions? We are here to help.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <h3 className="text-lg font-semibold text-stone-900">Send a Message</h3>
            <form className="mt-5 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-stone-700">Name</Label>
                  <Input id="name" placeholder="Your name" className="rounded-xl border-stone-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-stone-700">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="rounded-xl border-stone-200" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-medium text-stone-700">Subject</Label>
                <Input id="subject" placeholder="How can we help?" className="rounded-xl border-stone-200" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium text-stone-700">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="rounded-xl border-stone-200"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40"
              >
                <Send className="h-4 w-4" /> Send Message
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Email</p>
                  <p className="mt-0.5 text-sm text-stone-500">support@festfit.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Phone</p>
                  <p className="mt-0.5 text-sm text-stone-500">+234 812 345 6789</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-stone-900">Address</p>
                  <p className="mt-0.5 text-sm text-stone-500">Fest Fit Supplements<br />Lagos, Nigeria</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-stone-100 bg-white p-6">
            <h3 className="font-semibold text-stone-900 mb-3">Business Hours</h3>
            <div className="space-y-2 text-sm text-stone-500">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 4:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
