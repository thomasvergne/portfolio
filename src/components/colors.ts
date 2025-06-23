export const firstColor = {
  green: "bg-green-300",
  white: "bg-white",
  black: "bg-neutral-800 text-white border-neutral-950",

  sundown: "bg-sundown-300",
  "peach-orange": "bg-peach-orange-300",
} as const;

export const secondColor: Record<keyof typeof firstColor, string> = {
  green: "bg-green-400",
  white: "bg-neutral-100",
  sundown: "bg-sundown-400",
  "peach-orange": "bg-peach-orange-400",
  black: "bg-neutral-900",
};

export const thirdColor: Record<keyof typeof firstColor, string> = {
  green: "bg-green-500",
  white: "bg-neutral-200",
  sundown: "bg-sundown-500",
  "peach-orange": "bg-peach-orange-500",
  black: "bg-neutral-950",
};