"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Button } from "@/components/ui";

type GalleryImage = { src: string; alt: string; width: number; height: number };

/** Accessible native dialog: Escape, focus trapping and focus return are browser-managed. */
export function ProjectGalleryImage({ images, index, className, sizes }: { images: readonly GalleryImage[]; index: number; className: string; sizes: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState(index);
  const [opened, setOpened] = useState(false);
  const current = images[active];
  return (
    <>
      <button type="button" className="project-gallery__open" aria-label={`Agrandir : ${images[index].alt}`} onClick={() => { setActive(index); setOpened(true); dialog.current?.showModal(); }}><Image {...images[index]} sizes={sizes} className={className} /></button>
      <dialog ref={dialog} className="project-gallery" aria-label="Galerie du projet" onClose={() => setOpened(false)} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
        if (event.key === "ArrowLeft") { event.preventDefault(); setActive((value) => Math.max(0, value - 1)); }
        if (event.key === "ArrowRight") { event.preventDefault(); setActive((value) => Math.min(images.length - 1, value + 1)); }
      }}>
        <div className="project-gallery__controls"><p className="onecity-text-small" aria-live="polite">{active + 1} / {images.length}</p><Button onClick={() => dialog.current?.close()} autoFocus>Fermer</Button></div>
        {opened && <Image {...current} sizes="90vw" className="project-gallery__image" />}
        <p className="onecity-text-small">{current.alt}</p>
        <div className="project-gallery__controls"><Button disabled={active === 0} onClick={() => setActive((value) => value - 1)}>Précédent</Button><Button disabled={active === images.length - 1} onClick={() => setActive((value) => value + 1)}>Suivant</Button></div>
      </dialog>
    </>
  );
}
