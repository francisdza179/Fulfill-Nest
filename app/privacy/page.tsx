import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import type { LegalSection } from "@/components/legal/LegalDoc";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Fulfill Nest collects, uses and protects your personal information — and the choices you have over it.",
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: "Fulfill Nest Privacy Policy — Your privacy, handled with care",
    description:
      "What we collect, why we collect it, and how we protect the personal information we handle.",
    url: "/privacy",
  },
};

const sections: LegalSection[] = [
  {
    heading: "Who we are",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Fulfill Nest (“we”, “us”, “our”) provides premium corporate
            gifting, employee recognition and fulfilment services through this
            website (fulfillnest.com). This Privacy Policy explains what
            personal information we collect, why we collect it, how we use and
            protect it, and the choices you have.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            By using this website or our services, you agree to the practices
            described here. If you do not agree, please do not use the website
            or provide us with your information.
          </>
        ),
      },
    ],
  },
  {
    heading: "Information we collect",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We collect information in three ways: what you give us, what we
            receive as part of fulfilling your programme, and what we gather
            automatically as you use the site.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            <strong>Information you provide.</strong> When you book a
            consultation, place an order or contact us, we collect your name,
            work email, company name, billing and delivery details, and any
            preferences or notes you share.
          </>,
          <>
            <strong>Recipient information.</strong> To deliver your gifts, you
            may provide names, addresses, phone numbers and occasions of the
            people you are gifting. We use this only to plan, pack and deliver
            your programme.
          </>,
          <>
            <strong>Order and communication records.</strong> Quotes, invoices,
            delivery updates, support messages and notes about your programme.
          </>,
          <>
            <strong>Usage information.</strong> Pages visited, referring site,
            browser and device type, approximate location, and how you interact
            with the site — collected through cookies and similar technologies
            (see section 5).
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            Please do not share sensitive personal information (such as health,
            religion or government identifiers) with us. We do not need it for
            our services, and we are not responsible for unsolicited sensitive
            data you send us.
          </>
        ),
      },
    ],
  },
  {
    heading: "How we use your information",
    blocks: [
      {
        type: "list",
        items: [
          <>
            <strong>To provide our services.</strong> Preparing quotes,
            curating gifts, processing orders, personalising notes, packing and
            delivering, and providing proof of delivery.
          </>,
          <>
            <strong>To communicate with you.</strong> Answering questions,
            confirming orders, sharing delivery updates and responding to
            requests.
          </>,
          <>
            <strong>For billing and compliance.</strong> Invoicing, GST and
            billing records, and meeting statutory record-keeping obligations.
          </>,
          <>
            <strong>To improve our services.</strong> Understanding how the
            website and programmes are used, and refining our catalogue and
            experience.
          </>,
          <>
            <strong>Marketing, with your consent.</strong> Occasionally sharing
            gifting ideas and programme inspiration by email. You can opt out
            at any time.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            Where the law requires a legal basis — for example, under India’s
            Digital Personal Data Protection Act, 2023, or the EU GDPR — we rely
            on the performance of a contract, our legitimate interests, your
            consent, or a legal obligation, depending on the activity.
          </>
        ),
      },
    ],
  },
  {
    heading: "How we share information",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We never sell your personal information. We share it only where it
            is needed to run our business or where the law requires it.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            <strong>Fulfilment and logistics partners</strong> who pack, ship
            and deliver gifts, and who receive recipient details only for that
            purpose.
          </>,
          <>
            <strong>Payment providers</strong> who process transactions
            securely on our behalf.
          </>,
          <>
            <strong>Professional advisers</strong> such as accountants,
            auditors and legal counsel, where necessary.
          </>,
          <>
            <strong>Authorities and courts</strong> when we are required to
            disclose information by law or in connection with legal
            proceedings.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            Where we share information with partners, we contractually restrict
            how they may use it and require them to keep it secure.
          </>
        ),
      },
    ],
  },
  {
    heading: "Cookies and similar technologies",
    blocks: [
      {
        type: "list",
        items: [
          <>
            <strong>Essential cookies</strong> keep the website secure,
            functional and accessible.
          </>,
          <>
            <strong>Analytics cookies</strong> help us understand aggregate
            usage so we can improve the experience.
          </>,
          <>
            <strong>Marketing cookies</strong> (where enabled) let us show more
            relevant content.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            You can control or delete cookies through your browser settings.
            Disabling essential cookies may affect how the website works. We do
            not use cookies to identify individual visitors for marketing
            without consent where consent is required.
          </>
        ),
      },
    ],
  },
  {
    heading: "Data retention and security",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We keep personal information only as long as needed for the purpose
            it was collected, plus any period required by law or for legitimate
            business reasons such as resolving disputes and maintaining tax
            records.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            We use reasonable technical and organisational measures — including
            encryption in transit and access controls — to protect your
            information. No method of transmission or storage is completely
            secure, and we cannot guarantee absolute security.
          </>
        ),
      },
    ],
  },
  {
    heading: "Your rights and choices",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Depending on where you are, you may have rights to access, correct,
            delete, restrict or object to the processing of your personal
            information, and to data portability. You may also withdraw consent
            where processing relies on it.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>Access a copy of the personal information we hold about you.</>,
          <>Correct or update inaccurate details.</>,
          <>
            Ask us to delete your information, subject to legal or contractual
            limits.
          </>,
          <>Object to or restrict certain processing.</>,
          <>Withdraw marketing consent at any time.</>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            If you received a gift from a programme and wish to exercise any of
            these rights, we will honour them as they apply to your data. To
            make a request, contact us using the details in section 11. We
            respond within 30 days — usually much sooner.
          </>
        ),
      },
    ],
  },
  {
    heading: "Children’s privacy",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Our services are intended for businesses and adults aged 18 and
            over. We do not knowingly collect personal information from
            children. If a gifting occasion involves a child, please share only
            the minimum detail needed for delivery, and contact us if you
            believe we hold a child’s information so we can remove it.
          </>
        ),
      },
    ],
  },
  {
    heading: "External links",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Our website may link to third-party sites, tools or content with
            their own privacy practices. We are not responsible for how those
            third parties handle your information, and we encourage you to read
            their policies.
          </>
        ),
      },
    ],
  },
  {
    heading: "Changes to this policy",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We may update this policy from time to time. When we do, we will
            publish the revised policy on this page. For significant changes, we
            will take reasonable steps to let you know, such as a notice on this
            website.
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
            Questions, concerns or privacy requests? Write to us at{" "}
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

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([{ name: "Privacy Policy", path: "/privacy" }])}
      />
        <LegalDoc
          eyebrow="Data & Privacy"
          title={
            <>
              Privacy <em className="accent-em">Policy</em>
            </>
          }
          description="How we collect, protect, and handle your data across our platform, operations, and global shipping network."
          sections={sections}
      />
    </>
  );
}
