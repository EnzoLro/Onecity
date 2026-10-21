import Image from "next/image";
import { Container, Text } from "@/components/ui";
import { designApproach } from "@/data/design-approach";
import "./design-approach.css";

type ApproachCard = (typeof designApproach.cards)[number];

function ApproachCard({ card }: { card: ApproachCard }) {
  return (
    <article className={`design-approach__card design-approach__card--${card.id}`} aria-labelledby={`approach-${card.id}`}>
      <div className="design-approach__image">
        <Image {...card.image} sizes="(max-width: 619px) calc(100vw - 64px), (max-width: 1023px) 40vw, (max-width: 1399px) 30vw, 416px" />
      </div>
      <div className="design-approach__copy">
        <Text as="h3" id={`approach-${card.id}`} className="design-approach__card-title">{card.title}</Text>
        <Text className="design-approach__description">{card.description}</Text>
      </div>
    </article>
  );
}

/** Editorial mosaic from Figma 4035:609, with local assets and editable content. */
export function DesignApproach() {
  return (
    <section className="design-approach" aria-labelledby="design-approach-title">
      <Container className="design-approach__container">
        <div className="design-approach__heading">
          <Text variant="subtitle" className="design-approach__label">{designApproach.label}</Text>
          <Text as="h2" variant="heading" id="design-approach-title">{designApproach.title}</Text>
          <Text variant="body-lg" className="design-approach__introduction">{designApproach.introduction}</Text>
        </div>
        <div className="design-approach__mosaic">
          {designApproach.cards.slice(0, 3).map((card) => <ApproachCard key={card.id} card={card} />)}
          <div className="design-approach__statement">
            <Text variant="body-lg">{designApproach.statement.introduction}</Text>
            <Text className="design-approach__statement-title">{designApproach.statement.title}</Text>
          </div>
          {designApproach.cards.slice(3).map((card) => <ApproachCard key={card.id} card={card} />)}
        </div>
      </Container>
    </section>
  );
}
