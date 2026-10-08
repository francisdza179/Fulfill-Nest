import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import type { LegalSection } from "@/components/legal/LegalDoc";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The ground rules for using fulfillnest.com and our corporate gifting, recognition and fulfilment services — in plain, readable language.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Fulfill Nest Terms of Service — The fine print, kept human",
    description:
      "Eligibility, orders, delivery, returns, liability and more — written clearly.",
    url: "/terms",
  },
};

const sections: LegalSection[] = [
  {
    heading: "Agreement to these terms",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Welcome to Fulfill Nest. These Terms of Service (“Terms”) govern
            your use of this website and the corporate gifting, employee
            recognition and fulfilment services we provide. By accessing the
            website or using our services, you agree to these Terms.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            If you accept these Terms on behalf of a company, organisation or
            client, you confirm that you are authorised to bind that entity. If
            you do not agree with any part of these Terms, please do not use
            our website or services.
          </>
        ),
      },
    ],
  },
  {
    heading: "Our services",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We offer corporate gifting, employee recognition, channel
            incentives, festive gifting and enterprise fulfilment — curated,
            packed and delivered on your behalf. We may also provide custom
            programmes under a separate written agreement. Where you have a
            separate agreement with us, that agreement governs the services it
            covers, and these Terms apply to everything else.
          </>
        ),
      },
    ],
  },
  {
    heading: "Eligibility and accounts",
    blocks: [
      {
        type: "list",
        items: [
          <>
            You must be at least 18 years old and authorised to act on behalf
            of the company or team you are buying for.
          </>,
          <>
            If we provide you with an account or portal access, you are
            responsible for keeping your login details secure and for activity
            under your account.
          </>,
          <>
            Tell us promptly about any unauthorised use of your account.
          </>,
        ],
      },
    ],
  },
  {
    heading: "Orders, pricing and payment",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Quotes and prices are valid for the period stated on the quote.
            Prices are in Indian Rupees (₹) unless stated otherwise, and GST or
            other applicable taxes are added where required.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Orders are confirmed and scheduled once payment terms are agreed.
            We may pause fulfilment if payment is not received as agreed.
          </>
        ),
      },
    ],
  },
  {
    heading: "Delivery and fulfilment",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We fulfil orders on the timelines agreed at confirmation, with
            options such as proof of delivery. Where available, we ship across
            India and internationally based on your programme.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            You are responsible for providing accurate recipient and address
            details. We are not responsible for delays caused by incorrect
            details, recipient unavailability, or events outside our reasonable
            control (such as weather, transport disruptions or force majeure).
            Where a delay occurs, we will keep you informed.
          </>
        ),
      },
    ],
  },
  {
    heading: "Returns, replacements and refunds",
    blocks: [
      {
        type: "list",
        items: [
          <>
            Damaged or defective items are replaced or refunded at no cost when
            reported within the period stated on your invoice or programme
            agreement.
          </>,
          <>
            Custom, branded or personalised products cannot be returned unless
            they arrive damaged or defective.
          </>,
          <>
            Other returns and refunds are handled case by case in line with
            this policy and consumer protection laws in force in India.
          </>,
        ],
      },
      {
        type: "note",
        text: (
          <>
            To report a damaged item, contact us at hello@fulfillnest.com with
            your order number and, where possible, a photo of the item.
          </>
        ),
      },
    ],
  },
  {
    heading: "Intellectual property",
    blocks: [
      {
        type: "p",
        text: (
          <>
            All content on this website — including designs, catalogue imagery,
            copy, gift concepts and brand marks — belongs to Fulfill Nest or
            its licensors. You may use the website for its intended purpose,
            but you may not copy, reproduce or resell our content without
            written permission.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            When you provide content such as logos, artwork, notes or recipient
            lists, you confirm that you have the right to use and share it, and
            you grant us a limited licence to use it to fulfil your programme.
            Logos and artwork you share remain your property.
          </>
        ),
      },
    ],
  },
  {
    heading: "Acceptable use",
    blocks: [
      {
        type: "p",
        text: (
          <>
            You will not use the website or our services to:
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>act unlawfully or infringe another person’s rights;</>,
          <>provide false, fraudulent or misleading information;</>,
          <>
            misuse, interfere with, or attempt to gain unauthorised access to
            the website or our systems;
          </>,
          <>resell our services without our written consent; or</>,
          <>harvest or scrape recipient or user data.</>,
        ],
      },
    ],
  },
  {
    heading: "Disclaimers and limitation of liability",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We provide our services with reasonable skill and care, as
            described in your quote or agreement. To the maximum extent
            permitted by law: our liability under these Terms is limited to the
            amount you paid for the specific programme giving rise to the
            claim; and we are not liable for indirect, incidental or
            consequential loss (including loss of profits or goodwill).
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Nothing in these Terms limits or excludes liability that cannot be
            limited or excluded under applicable law.
          </>
        ),
      },
    ],
  },
  {
    heading: "Indemnification",
    blocks: [
      {
        type: "p",
        text: (
          <>
            To the extent permitted by law, you agree to indemnify Fulfill
            Nest against claims, losses and reasonable costs (including legal
            fees) arising from your content, your use of the website or
            services, or your breach of these Terms.
          </>
        ),
      },
    ],
  },
  {
    heading: "Termination",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We may suspend or end access to the website or a programme if you
            breach these Terms, or if required by law. You may end a programme
            by contacting us, subject to any commitments already confirmed.
            Sections that by nature should survive termination — including
            payments due, intellectual property, disclaimers, indemnification
            and governing law — continue to apply.
          </>
        ),
      },
    ],
  },
  {
    heading: "Governing law and disputes",
    blocks: [
      {
        type: "p",
        text: (
          <>
            These Terms are governed by the laws of India. Any dispute arising
            out of or in connection with these Terms will be subject to the
            exclusive jurisdiction of the courts at Mumbai, India.
          </>
        ),
      },
    ],
  },
  {
    heading: "Changes to these terms",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We may update these Terms from time to time. The latest version
            will always be published on this page. Continued use of the website
            or services after changes take effect constitutes acceptance of the
            updated Terms.
          </>
        ),
      },
    ],
  },
  {
    heading: "Contact us",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Questions about these Terms? Write to us at{" "}
            <a
              href="mailto:hello@fulfillnest.com"
              className="font-medium text-accent-600 underline decoration-accent-600/40 underline-offset-4 transition-colors hover:decoration-accent-600"
            >
              hello@fulfillnest.com
            </a>
            . We answer within 24 hours, Monday to Saturday, 9am to 7pm IST.
          </>
        ),
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Terms of Service", path: "/terms" }])}
      />
        <LegalDoc
          eyebrow="Legal & Compliance"
          title={
            <>
              Terms of <em className="accent-em">Service</em>
            </>
          }
          description="Please read these terms and conditions carefully before using the Fulfill Nest platform and fulfilment services."
          sections={sections}
      />
    </>
  );
}
