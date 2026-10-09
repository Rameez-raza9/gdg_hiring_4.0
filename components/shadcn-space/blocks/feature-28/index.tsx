"use client";

import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import {
  Headphones,
  Paperclip,
  Palette,
  ShieldCheck,
  Trophy,
  Wand2,
  Zap,
  Flower,
  type LucideIcon,
} from "lucide-react";
import GradientWaves from "@/components/shadcn-space/animations/GradientWaves";

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

const STAGGER_ANIMATION_VARIANTS = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const CARD_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const } },
};

type FeatureCard = {
  icon: LucideIcon;
  title: string;
  description: string;
  span: string;
};

const topRow: FeatureCard[] = [
  {
    icon: Zap,
    title: "Affordability",
    description: "Access high-quality design services at a fraction of traditional costs.",
    span: "lg:col-span-1",
  },
  {
    icon: Wand2,
    title: "Consistency",
    description: "Ensure a consistent brand identity with regular design output.",
    span: "lg:col-span-1",
  },
  {
    icon: Paperclip,
    title: "Scalability",
    description: "Scalable systems built to support growing products and businesses.",
    span: "lg:col-span-1",
  },
];

const bottomRow: FeatureCard[] = [
  {
    icon: Trophy,
    title: "Flexibility",
    description: "Adapt the service to cover a wide range of design tasks as needed.",
    span: "lg:col-span-1",
  },
  {
    icon: Flower,
    title: "Diversity",
    description: "Access to a variety of styles and expertise from a pool of creative professionals and people.",
    span: "lg:col-span-2",
  },
  {
    icon: Headphones,
    title: "Support",
    description: "Enjoy dedicated customer service and revisions to perfect your designs.",
    span: "lg:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Convenience",
    description: "Streamline the design process with a simple workflow and process.",
    span: "lg:col-span-1",
  },
];

const Feature28 = () => {
  return (
    <section className="w-full scroll-mt-20 bg-muted py-12 md:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={STAGGER_ANIMATION_VARIANTS}
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
            <Badge className="h-auto rounded-lg border-border bg-background px-3 py-1 text-sm font-normal text-foreground">
              Why Choose Us
            </Badge>
          </motion.div>
          <motion.h2
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-3xl leading-tight font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            Features to Boost Productivity
          </motion.h2>
          <motion.p
            variants={FADE_UP_ANIMATION_VARIANTS}
            className="text-base text-muted-foreground md:text-lg"
          >
            Explore powerful tools built to simplify your workflow and help you get more done, faster and smarter.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_ANIMATION_VARIANTS}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {topRow.map((card) => (
            <motion.div
              key={card.title}
              variants={CARD_ANIMATION_VARIANTS}
              className={`flex min-h-56 sm:min-h-64 flex-col justify-between gap-8 rounded-2xl bg-card p-6 transition-colors ${card.span}`}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
                <card.icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-medium tracking-tight text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            variants={CARD_ANIMATION_VARIANTS}
            className="relative flex min-h-56 sm:min-h-64 flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-neutral-950 p-6 lg:col-span-2"
          >
            <div className="absolute inset-0">
              <GradientWaves
                horizonColor="#ffffff"
                waveColor="#3a3a3a"
                crestColor="#FFFFFF"
                speed={0.4}
                amplitude={2.5}
                waveScale={0.6}
                waveRatio={0.9}
                swell={35}
                turbulence={20}
                tilt={1.11}
                zoom={1.0}
                height={5.5}
                fogDepth={15}
                detail="medium"
                brightness={1.0}
                opacity={1.0}
                mouseInteraction={true}
                parallaxStrength={0.5}
                grain={true}
                grainIntensity={0.05}
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="relative z-10 flex size-11 items-center justify-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
              <Palette className="size-5" />
            </div>
            <div className="relative z-10 flex flex-col gap-1.5">
              <h3 className="text-lg font-medium tracking-tight text-white">Speed</h3>
              <p className="text-sm text-white/70">
                Get quicker turnarounds on design projects without sacrificing quality at a way better price on your wallet.
              </p>
            </div>
          </motion.div>

          {bottomRow.map((card) => (
            <motion.div
              key={card.title}
              variants={CARD_ANIMATION_VARIANTS}
              className={`flex min-h-56 sm:min-h-64 flex-col justify-between gap-8 rounded-2xl bg-card p-6 transition-colors ${card.span}`}
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-foreground">
                <card.icon className="size-5" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-medium tracking-tight text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Feature28;
