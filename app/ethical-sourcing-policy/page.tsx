import type { Metadata } from "next";
import { LegalDoc } from "@/components/legal/LegalDoc";
import type { LegalSection } from "@/components/legal/LegalDoc";
import { breadcrumbSchema, JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Ethical & Quality Sourcing Standards",
  description:
    "The standards every Fulfill Nest supplier must meet — premium quality and craftsmanship, safe and eco-conscious materials, fair wages, no child or forced labour, safe workplaces, and no bribery anywhere in the chain.",
  alternates: {
    canonical: "/ethical-sourcing-policy",
  },
  openGraph: {
    title: "Fulfill Nest Ethical & Quality Sourcing Standards",
    description:
      "How we select, vet and hold suppliers to quality, material safety and fair labour standards across our network.",
    url: "/ethical-sourcing-policy",
  },
};

/* SEVEN SECTIONS, AND THE ORDER IS THE ARGUMENT.

   The document is no longer labour-only. It runs:

       01  Our commitment
       02  Premium quality & craftsmanship standards
       03  Material safety & eco-consciousness
       04  Labor & human rights
       05  How we check, and what happens when it fails
       06  Reporting a concern
       07  Changes to this policy

   QUALITY BEFORE LABOUR, deliberately. A reader arriving from a gift catalogue
   cares first whether the mug will survive a year, and labour ethics are the
   thing that makes the answer mean something. Leading with ethics reads as
   defensive; leading with quality reads as a supplier that has decided both
   matter. The labour section then sits at 04 where it is unmissable rather than
   buried behind six pages of product specification.

   THE FOUR LABOUR TOPICS ARE NOW ONE SECTION, sub-divided by bold lead-in
   paragraphs rather than by their own numbered headings. That is a real cost
   and it is worth stating plainly: the scrollspy index used to list "Fair
   labour standards" and "Zero tolerance for child and forced labour" as
   separately clickable destinations, and it now lists only "Labor & human
   rights". Four topics in one index entry is worse navigation than four
   entries.

   The alternative was a sub-heading block type in the shared LegalDoc shell,
   which is a component change to two other pages for the benefit of one. The
   lead-in paragraphs were the cheaper trade. If the sub-sections should be
   addressable, the honest fix is a heading level in the shell, not another
   bespoke page.

   NO CLAIMS THAT CANNOT BE CHECKED. Nothing here names a certification, an
   audit body, a membership or a number of audited facilities, because none of
   those exist yet to be named. Every statement is a commitment rather than a
   boast, which is the only honest register for a document whose entire purpose
   is to be believed. The quality sections carry the same discipline: we say what
   we require of a supplier, never that a supplier has already met it. */
const sections: LegalSection[] = [
  {
    heading: "Our commitment",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Fulfill Nest sources products from a network of suppliers across
            India, China, Vietnam and Turkey. This document sets the standards
            that network is held to — in two halves, because they fail in
            different ways.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            The first half is quality and materials: whether what arrives is
            what we specified, whether it is safe to hand to someone, and whether
            it was made by a supplier we would still choose knowing what we know
            now. The second half is labour and integrity: how people are paid,
            how work is organised, how safe workplaces are, and how decisions are
            made when money and influence are involved.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Both apply to every supplier, factory and subcontractor involved in
            producing the goods we fulfil, and to the people who work for them.
            Both apply to us as well. Where a supplier cannot meet a standard,
            our obligation is to help them meet it or to stop buying — not to
            quietly accept the shortfall.
          </>
        ),
      },
      {
        type: "note",
        text:
          "This is a statement of intent and of the minimum we require. It is not a certification, and we do not represent it as one. We would rather publish the standard we are working towards than claim a badge we have not earned.",
      },
    ],
  },
  {
    heading: "Premium quality & craftsmanship standards",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Most corporate gifting fails quietly. The pen arrives fine, the mug
            chips in three months, the notebook has a binding that gives out
            before anyone has written in it. Nobody complains, because the
            invoice was paid and the budget closed. It is still a failure, and it
            is the one a supplier exists to prevent.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            So quality is a specification, agreed in writing before production
            rather than inspected afterwards. Every product we buy has a written
            spec covering materials, construction, dimensions, finish and
            packaging. A supplier is measured against that document, not against
            a sample that happened to look right on the day.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            <strong>Hand-selected ranges, not catalogues.</strong> We carry a
            deliberately small number of products per category. We would rather
            offer forty things we would keep ourselves than four hundred we have
            never unboxed.
          </>,
          <>
            <strong>Durability is specified, not hoped for.</strong> Where a
            product is meant to be used daily, the spec states what it has to
            survive — cycle testing for a insulated vessel, load and fatigue
            testing for a bag, page-turn and binding testing for paper goods.
            Untested goods are not "probably fine". They are untested.
          </>,
          <>
            <strong>Consistency across batches.</strong> A colour, weight or
            thread count that drifts between production runs is a defect even
            when each run passes on its own. A repeat order should be
            indistinguishable from the first.
          </>,
          <>
            <strong>Finishing is part of the product.</strong> Seams, closures,
            print registration, coating evenness, the inside of a lid, the
            underside of a base. These are the parts a buyer touches and never
            photographs, and they are where cheap goods are cheap.
          </>,
          <>
            <strong>Packaging is specified too.</strong> Arriving intact is the
            minimum. Packaging is opened by a person on their own birthday, and
            it is the first physical thing about us that person encounters.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            <strong>Premium vendor vetting.</strong> We do not select on price.
            A supplier has to show us the capability — the equipment, the
            process, the people who will run our line — and the track record of
            holding a specification for someone else who cared. We visit before
            we commit, and we tell a supplier plainly when we think we are not
            the right customer for them.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Every shipment is inspected before it leaves the supplier, against
            the agreed spec rather than against a checklist of its own. Goods
            that fail are not shipped and are not billed. That is the whole
            mechanism: it costs more to hold a shipment than to send it, which
            is the only way the cost of quality lands somewhere it can change a
            decision.
          </>
        ),
      },
      {
        type: "note",
        text:
          "We do not claim a defect rate, and we will not quote you one, because quoting a figure we cannot substantiate is the same failure this section is about. What we will say is that a supplier who repeatedly fails a spec does not get a second shipment, and a supplier who fails a core safety or labour standard does not get a remediation plan.",
      },
    ],
  },
  {
    heading: "Material safety & eco-consciousness",
    blocks: [
      {
        type: "p",
        text: (
          <>
            A corporate gift is handled constantly and often ends up somewhere it
            was never designed to go — a child’s hand, a desk with tea on it, a
            bag that gets wet. Material safety is not a certification exercise.
            It is a question about what the product is made of and what happens
            to it afterwards.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            <strong>Non-toxic as the default, not the upgrade.</strong> No
            lead, cadmium, phthalates or regulated heavy metals in any component
            a hand can reach — inks, coatings, plating, adhesives, printed
            surfaces, soft components. This is required of every product, not
            only of the ones that will be handled by children.
          </>,
          <>
            <strong>Food-contact items comply with the destination market.</strong>
            A mug, bottle or lunch item sold into a market follows that market’s
            rules on lead and phthalate limits in decoration and glaze, not the
            easiest standard available to us.
          </>,
          <>
            <strong>Eco-certification only where it is verifiable.</strong> If a
            product is described as certified, we hold the certificate and it
            names a standard we can check. We do not accept "eco-friendly",
            "green" or "sustainable" as supplier descriptions of anything, because
            those words carry no specification at all.
          </>,
          <>
            <strong>Sustainable materials where they genuinely suit the product.</strong>{" "}
            Recycled, reclaimed or responsibly sourced material is preferred —
            certified fibre, recycled metals and plastics, water-based finishes —
            but only where it holds up to the durability spec above. A product
            that lasts five years in a sturdy material beats one that lasts one
            year because the sustainable option was softer.
          </>,
          <>
            <strong>Traceability where the claim depends on it.</strong> A claim
            about the origin of a material has to be documented to the mill or
            the processor, not inferred from the supplier’s letterhead. Where we
            cannot trace it, we do not print it.
          </>,
          <>
            <strong>Packaging is a waste problem we own.</strong> Minimal,
            recyclable, plastic-free where the product survives it. No expanded
            foam, no plastic windows, no oversized boxes around small items,
            and no second box because the first one was the wrong size in
            production.
          </>,
        ],
      },
      {
        type: "note",
        text:
          "We have not made every product in our range compliant with every standard, and we will not claim to have. What we commit to is that we know which ones have and which have not, and that the gap is a plan rather than an ignorance. Where a product falls short on materials, that is a reason to change the product, not to stop printing the claim on it.",
      },
      {
        type: "p",
        text: (
          <>
            Sustainability claims that cannot be evidenced are not a shortcut
            anyone should be taking, but they are especially not one for a
            gifting business, where the buyer is often choosing between two
            options and has no way to tell which claim is checked. We would
            rather print fewer claims than more.
          </>
        ),
      },
    ],
  },
  {
    heading: "Labor & human rights",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Quality standards describe what a product is. These describe the
            people who made it, and they are not negotiable in the way a
            specification is. The four topics below are the floor.
          </>
        ),
      },

      {
        type: "p",
        text: (
          <>
            <strong>Fair wages and working time.</strong> Every worker is
            entitled to a living wage. Not a minimum wage that exists on paper,
            and not a wage that meets the legal floor while failing to cover
            rent, food and transport — but a wage that lets a worker and their
            family live without second income.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            Wages are paid in full, and on time, at least once a month. Pay is
            never delayed for reasons within the supplier’s control, including
            production problems or customer payment delays on our side.
          </>,
          <>
            Pay slips are provided in a language the worker understands, and
            deductions are itemised and explained. No fee may be charged to a
            worker that a worker did not agree to in advance and in writing.
          </>,
          <>
            Overtime is voluntary and paid at the rate the law requires. The
            regular and overtime rate is never used to hide a base wage that is
            below the standard set above.
          </>,
          <>
            Employment is direct wherever the law permits it. Employment
            agencies charging workers fees are not used, and a recruiter fee is
            never passed on in a way that reduces the agreed wage.
          </>,
          <>
            Workers hold their own identity documents. The original stays with
            the worker; a copy is what the employer holds.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            We ask suppliers to move beyond the legal floor voluntarily where
            the law allows it, because the legal floor in most of our sourcing
            countries is set below a living wage. Where it does, we would rather
            see a supplier earning more than required than a policy that is
            technically satisfied and practically empty.
          </>
        ),
      },

      {
        type: "p",
        text: (
          <>
            <strong>Zero tolerance for child and forced labor.</strong> There is
            no version of our supply chain in which child labour or forced
            labour is acceptable. This is not a risk we manage. It is a
            condition of supply, and any supplier found to breach it is ended.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            No worker under 18 is employed in production, packing or shipment.
            Where the legal minimum age is below 18, the stricter standard
            applies, because our products are bought for adults.
          </>,
          <>
            No recruitment fee of any kind is charged to a worker, and no
            deposit is taken that ties a worker to an employer. A worker who has
            paid to obtain work has been exploited from the first day.
          </>,
          <>
            Workers are free to leave employment at any time without withholding
            of documents, wages, or any penalty. Notice periods do not require
            anyone to work a notice they did not agree to.
          </>,
          <>
            No worker is held against their will through debt bondage,
            retention of identity documents, restricted movement, or threats
            involving family or immigration status.
          </>,
          <>
            No forced overtime, including overtime that exceeds legal limits.
            Production pressure from us or our customers is never a reason for a
            worker to lose rest.
          </>,
        ],
      },
      {
        type: "note",
        text:
          "Where we find child or forced labour in a supplier, we stop buying immediately rather than negotiate an improvement plan. The reason for that rule is that an improvement plan becomes a reason to continue, and the workers inside it are the ones who wait.",
      },

      {
        type: "p",
        text: (
          <>
            <strong>Safe and healthy working conditions.</strong> A workplace
            where someone is injured is a workplace that failed someone. Safety
            is a condition of supply, not an upgrade a supplier can schedule for
            a later quarter.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            Buildings are structurally sound, with fire exits that are unlocked,
            marked and reachable. Exit routes are never used for storage.
          </>,
          <>
            Fire drills are held on a documented schedule, and fire extinguishers
            are inspected rather than assumed. We ask to see the record.
          </>,
          <>
            Electrical installations are certified, machinery has working
            guards, and lockout procedures exist for maintenance.
          </>,
          <>
            Work that is genuinely hazardous — handling certain chemicals,
            operating specific industrial equipment — is restricted to workers
            who are trained for it.
          </>,
          <>
            Workers have access to clean drinking water, adequate toilet
            facilities, and somewhere to eat that is separate from production.
          </>,
          <>
            Protective equipment is supplied free of charge, and is actually
            used. A site where the equipment sits unused because it is
            uncomfortable is not a safe site.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            We also require suppliers to report injuries and near misses to us,
            not only to the local authority. A supplier that reports nothing is
            either unusually safe or unusually unaware, and we would rather ask
            which than assume the first.
          </>
        ),
      },

      {
        type: "p",
        text: (
          <>
            <strong>Anti-bribery and anti-corruption.</strong> Bribery corrupts
            everything it touches: the worker whose wage is skimmed, the
            regulator who is ignored, the inspection that does not happen. Our
            standard applies to every payment made by or on behalf of Fulfill
            Nest anywhere in the supplier network — and to the quality standards
            above, because a bribe is also how substandard goods get signed off
            as compliant.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            No bribe, kickback, facilitation payment or “speed money” is
            offered, requested, accepted or authorised — by us, by our employees,
            or by anyone acting for us.
          </>,
          <>
            Small payments to officials are not treated differently from large
            ones. A payment small enough to feel harmless is still a bribe.
          </>,
          <>
            We do not give gifts, hospitality, travel or entertainment to
            government officials, or to anyone who decides something on our
            behalf. Nominal business courtesies to officials are prohibited, not
            merely capped.
          </>,
          <>
            Suppliers must have their own anti-bribery policy covering their own
            staff, agents and subcontractors, and must pass our requirements
            down through the tiers below them.
          </>,
          <>
            Agents and intermediaries are selected for capability and integrity,
            and paid on a rate that does not require them to seek money elsewhere
            to make the arrangement work. A commission that only makes sense once
            it has been skimped is a commission that will be skimped.
          </>,
          <>
            Books and records are kept accurately. No payment is recorded under
            an incorrect description, and no transaction is split to keep it
            below a reporting threshold.
          </>,
        ],
      },
      {
        type: "note",
        text:
          "A breach of these standards by a supplier is grounds for termination of the relationship, not for a warning first. We accept that this makes us a harder customer to work with, which is a fair trade for being a customer who can be trusted.",
      },
      {
        type: "p",
        text: (
          <>
            We review the first tier of our supply chain — the factories that
            make the goods we order — directly. Deeper tiers, where raw materials
            are processed, are assessed through the suppliers who appoint them.
            We are clear that our visibility is not complete, and that saying so
            is more useful than implying otherwise.
          </>
        ),
      },
    ],
  },
  {
    heading: "How we check, and what happens when it fails",
    blocks: [
      {
        type: "p",
        text: (
          <>
            We assess suppliers before we place an order, and revisit them on a
            schedule that depends on risk rather than on convenience — a supplier
            in a higher-risk category or with a previous concern is seen more
            often, not less. Assessment is through independent third-party
            auditors. Our own staff visit as well, because an audit tells you
            about a site on the day and a visit tells you about it in between.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            The same assessments cover both halves of this document. A quality
            audit and a labour audit are not competing exercises, and a supplier
            that is openly unsafe for its workers is rarely careful about its
            production line either — the habits are the same habits.
          </>
        ),
      },
      {
        type: "list",
        items: [
          <>
            A finding that breaches a core standard — the wage, child labour,
            forced labour, bribery, safety and material-safety provisions above
            — results in supply stopping. We do not wait for a remediation plan
            to complete.
          </>,
          <>
            A repeated quality failure is treated the same way, whatever the
            cause. A supplier that misses the same spec twice is not having a bad
            quarter; it is not able to make the product we asked for.
          </>,
          <>
            A finding that does not breach a core standard results in a
            time-bound corrective action plan, with the supplier accountable for
            the timeline and for the cost of fixing it.
          </>,
          <>
            Where we believe workers’ rights are at risk and a supplier will not
            or cannot act, we raise the matter with the relevant authority in
            the country concerned.
          </>,
          <>
            We do not terminate a supplier in a way that costs the workers their
            income overnight. Where we can, we work to move production so the
            people keep their jobs.
          </>,
        ],
      },
      {
        type: "p",
        text: (
          <>
            We publish this document because suppliers should know what we require
            before they bid for our work, and because a standard nobody outside
            the company knows about cannot be enforced on anyone.
          </>
        ),
      },
    ],
  },
  {
    heading: "Reporting a concern",
    blocks: [
      {
        type: "p",
        text: (
          <>
            If you work for one of our suppliers, or you work with us, and you
            believe a standard in this document is being breached, we want to know
            — including if the breach is not one of the standards above. Reports
            can be made anonymously.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            Write to us at{" "}
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
      {
        type: "p",
        text: (
          <>
            We will not name the person who reported a concern to the supplier,
            and we will tell the reporter what we did. A reporting route that
            exposes the reporter or returns silence is not a reporting route; it
            is a way of discouraging exactly the reports we are asking for.
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
            We may update this document as our sourcing network changes and as
            practice improves. When we do, we will publish the revised version
            on this page. Where a change makes a requirement stricter, we will
            give suppliers notice before it takes effect rather than applying it
            to work already in progress.
          </>
        ),
      },
    ],
  },
];

export default function EthicalSourcingPolicyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Ethical & Quality Sourcing Standards", path: "/ethical-sourcing-policy" },
        ])}
      />
      <LegalDoc
        eyebrow="Responsible Sourcing"
        title={
          <>
            Ethical &amp; Quality{" "}
            <em className="accent-em">Sourcing Standards</em>
          </>
        }
        description="The standards every supplier in our network is held to — premium quality and craftsmanship, safe and eco-conscious materials, and the labour and integrity conditions every product we sell is made under."
        sections={sections}
      />
    </>
  );
}
