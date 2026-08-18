import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { CONTACT_INFO } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us | Nududu by Dzie",
  description:
    "Get in touch with Nududu by Dzie for orders, questions, or catering enquiries.",
};

const DETAILS = [
  { label: "Phone", value: CONTACT_INFO.phone },
  { label: "Email", value: CONTACT_INFO.email },
  { label: "Service area", value: CONTACT_INFO.serviceArea },
  { label: "Hours", value: CONTACT_INFO.hours },
];

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-3xl font-semibold text-espresso sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 max-w-xl text-espresso-muted">
        Questions about a dish, delivery, or a catering order? Reach out and we&apos;ll
        get back to you.
      </p>

      <dl className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-sand bg-surface p-6 sm:grid-cols-2">
        {DETAILS.map((detail) => (
          <div key={detail.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-espresso-muted">
              {detail.label}
            </dt>
            <dd className="mt-1 text-espresso">{detail.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button href="/menu" variant="primary">
          Browse the menu
        </Button>
      </div>
    </section>
  );
}
