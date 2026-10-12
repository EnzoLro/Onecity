import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-onecity-background text-onecity-item-high">
      <section className="onecity-container flex min-h-screen items-center py-16 lg:py-30">
        <div className="max-w-3xl">
          <Image
            src="/brand/logos/onecity-logo.svg"
            alt="OneCity"
            width={177}
            height={40}
            priority
            className="mb-10 h-10 w-auto"
          />
          <p className="onecity-text-subtitle mb-4 text-onecity-item-mid">Fondations</p>
          <h1 className="onecity-text-display">OneCity</h1>
          <p className="onecity-text-body-lg mt-6 max-w-2xl text-onecity-item-low">
            Système global de couleurs, typographies, espacements et conteneurs.
          </p>
        </div>
      </section>
    </main>
  );
}
