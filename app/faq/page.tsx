import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is the best supplement for muscle growth?",
    answer:
      "Whey protein isolate and creatine monohydrate are the most researched supplements for muscle growth. Our Whey Protein Isolate provides 25g of protein per serving, while Creatine Monohydrate increases strength and power output during training.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders are processed within 1-2 business days. Standard delivery takes 2-3 business days within Lagos and 3-5 business days to other states. Orders over ₦100,000 qualify for free delivery.",
  },
  {
    question: "Are your supplements lab tested?",
    answer:
      "Yes, all our supplements undergo third-party lab testing for purity, potency, and quality. We only source from certified GMP facilities.",
  },
  {
    question: "Can I return a product if I don't like it?",
    answer:
      "We offer a 30-day return policy on unopened products. If you are not satisfied with your purchase, contact our support team for a refund or exchange.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Currently we ship within Nigeria. We are working on expanding to other African countries soon.",
  },
  {
    question: "Should I take pre-workout on an empty stomach?",
    answer:
      "We recommend taking pre-workout 20-30 minutes before training with a small snack. Taking it on an empty stomach may cause jitters or nausea for some individuals.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Once your order is confirmed and dispatched, our team will contact you via phone or WhatsApp with delivery updates. You can also log in to your account to check your order status at any time.",
  },
  {
    question: "Are your products vegan friendly?",
    answer:
      "Some of our products are vegan-friendly. Our BCAA Recovery and selected vitamins are plant-based. Check individual product pages for full ingredient details and vegan status.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mx-auto max-w-2xl">
        <div className="mb-10 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">Support</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-stone-500">Everything you need to know about our supplements.</p>
        </div>

        <Accordion className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-stone-100">
              <AccordionTrigger className="text-left text-[15px] font-medium text-stone-800 hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-stone-500 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
