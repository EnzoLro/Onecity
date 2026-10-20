import Image from "next/image";

export type TestimonialCardProps = {
  quote: string;
  author: string;
  location: string;
  image: { src: string; alt: string };
};

/** Testimonial presentation matching Figma 4035:780; content is supplied by the caller. */
export function TestimonialCard({ quote, author, location, image }: TestimonialCardProps) {
  return (
    <figure className="flex h-full min-w-0 flex-col bg-onecity-surface md:flex-row">
      <div className="relative min-h-56 md:min-h-0 md:w-[229.551px] md:shrink-0">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width: 620px) 230px, 100vw" className="object-cover" />
      </div>
      <div className="min-w-0 flex-1 p-6 md:p-10 lg:p-20">
        <blockquote className="text-base font-light leading-[normal] text-onecity-primary wrap-anywhere"><p>{quote}</p></blockquote>
        <figcaption className="mt-3 text-base leading-[normal] wrap-anywhere">
          <p className="font-semibold text-onecity-primary">{author}</p>
          <p className="mt-1 text-onecity-item-low">{location}</p>
        </figcaption>
      </div>
    </figure>
  );
}
