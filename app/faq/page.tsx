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
    question: "How long does shipping take?",
    answer:
      "Orders are processed within 1-2 business days. Standard shipping takes 2-3 business days. Orders over $50 qualify for free shipping.",
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
      "Once your order ships, you will receive an email with a tracking number. You can use this number on our carrier's website to track your delivery.",
  },
  {
    question: "Are your products vegan friendly?",
    answer:
      "Some of our products are vegan. Our BCAA Recovery and some vitamins are plant-based. Check individual product descriptions for vegan status.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight text-center">
          Frequently Asked Questions
        </h1>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
