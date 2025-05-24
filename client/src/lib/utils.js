import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import animationData from "@/assets/Animation - 1743189979591"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff6d6a2a] text-[#ff6d6a] border-[1px] border-[#ff6d6aab]",
  "bg-[#0066a02a] text-[#0066a0] border-[1px] border-[#0066a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};


export const animationDefaultOption = {
  loop: true,
  autoplay: true,
  animationData,
}