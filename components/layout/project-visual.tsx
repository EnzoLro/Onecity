import Image from "next/image";
import type { ProjectDetail } from "@/data/programs";
import "./project-visual.css";

/** Layered Figma panorama, preserving the model's overlap at every viewport. */
export function ProjectVisual({ background, cutout }: ProjectDetail["hero"]) {
  return (
    <div className="project-visual" role="img" aria-label={background.alt}>
      <div className="project-visual__panorama">
        <Image {...background} alt="" sizes="(max-width: 1023px) 1100px, 100vw" preload className="project-visual__background" />
      </div>
      <Image {...cutout} alt="" sizes="(max-width: 1023px) 362px, 33vw" preload className="project-visual__cutout" />
    </div>
  );
}
