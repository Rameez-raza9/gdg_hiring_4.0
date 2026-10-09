import Link from "next/link";
import DotsHero from "@/components/dots-hero";
import TeamSection from "@/components/team-section";

export default function Home() {
  return (
    <>
      <DotsHero />
      <TeamSection />

      <section className="dot-grid">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-balance text-4xl font-medium tracking-[-0.035em] sm:text-5xl">
            Your dot is missing from the crowd.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Applications take about three minutes. Pick a track, tell us why,
            and we'll see you at the next session.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/apply"
              className="rounded-xl border border-green-300/60 bg-[#74E38A] px-6 py-3 text-sm font-medium text-neutral-950 transition hover:brightness-95"
            >
              Apply now
            </Link>
            <Link
              href="/faq"
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium transition hover:border-foreground/30"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
