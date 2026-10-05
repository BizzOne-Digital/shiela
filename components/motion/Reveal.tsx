"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.22, 1, 0.36, 1];

export type RevealDirection = "up" | "down" | "left" | "right";

type Offset = { x?: number; y?: number };

function hiddenOffset(direction: RevealDirection, distance: number): Offset {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: -distance };
    case "right":
      return { x: distance };
    default:
      return { y: distance };
  }
}

const defaultViewport = { once: true, margin: "-12% 0px -8% 0px" as const };

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: RevealDirection;
  distance?: number;
  /** Hero / above-the-fold: animate on mount instead of scroll */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
  direction = "up",
  distance = 56,
  immediate = false,
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const hidden = { opacity: 0, ...hiddenOffset(direction, distance) };
  const visible = { opacity: 1, x: 0, y: 0 };

  return (
    <motion.div
      className={className}
      initial={hidden}
      {...(immediate
        ? { animate: visible }
        : { whileInView: visible, viewport: defaultViewport })}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Headings & labels — drop in from above */
export function RevealText({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <Reveal direction="down" distance={40} delay={delay} duration={0.85} className={className}>
      {children}
    </Reveal>
  );
}

/** Full section block rises on scroll */
export function RevealSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 72 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6% 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  immediate = false,
}: {
  children: React.ReactNode;
  className?: string;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: defaultViewport })}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.14, delayChildren: 0.06 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  fromTop = true,
}: {
  children: React.ReactNode;
  className?: string;
  fromTop?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={{
        hidden: {
          opacity: 0,
          y: fromTop ? -32 : 48,
        },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.85, ease: EASE },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Alternate left / right for grid cards */
export function RevealAlternate({
  index,
  children,
  className,
}: {
  index: number;
  children: React.ReactNode;
  className?: string;
}) {
  const direction = index % 2 === 0 ? "left" : "right";
  return (
    <Reveal
      direction={direction}
      distance={64}
      delay={index * 0.1}
      duration={0.85}
      className={className}
    >
      {children}
    </Reveal>
  );
}
