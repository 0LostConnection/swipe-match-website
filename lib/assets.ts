/** Static image paths used across the experience. */
export const ASSETS = {
  cat: "/assets/cat.gif",
  pugHat: "/assets/pug-hat.png",
  pugSad: "/assets/pug-sad.png",
  dogButterfly: "/assets/dog-butterfly.gif",
  emojiGuyInterest: "/assets/emoji-guy-interest-screen.png",
  emojiGuyEnd: "/assets/emoji-guy-tongue-out-end.png",
} as const;

export const ALL_ASSETS = Object.values(ASSETS);
