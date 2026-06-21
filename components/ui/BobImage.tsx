"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  size?: number;
  rounded?: boolean;
  tilt?: number;
  bob?: boolean;
  priority?: boolean;
  className?: string;
};

/** Image in a sticker frame with a gentle idle bob + tilt. */
export function BobImage({
  src,
  alt,
  size = 220,
  rounded = true,
  tilt = -2,
  bob = true,
  priority = false,
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const doBob = bob && !reduce;

  return (
    <motion.div
      className={`relative overflow-hidden bg-white sticker sticker-outline ${
        rounded ? "rounded-[2rem]" : "rounded-3xl"
      } ${className}`}
      style={{ width: size, height: size, rotate: `${tilt}deg` }}
      initial={{ scale: 0.85, opacity: 0 }}
      animate={
        doBob
          ? { scale: 1, opacity: 1, y: [0, -8, 0], rotate: [tilt, tilt + 1.5, tilt] }
          : { scale: 1, opacity: 1 }
      }
      transition={
        doBob
          ? {
              opacity: { duration: 0.4 },
              scale: { type: "spring", stiffness: 300, damping: 20 },
              y: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
            }
          : { type: "spring", stiffness: 300, damping: 20 }
      }
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized
        sizes={`${size}px`}
        className="object-cover"
      />
    </motion.div>
  );
}
