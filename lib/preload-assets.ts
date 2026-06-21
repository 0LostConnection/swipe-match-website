import { preload } from "react-dom";

const loaded = new Set<string>();

/** Hint the browser to fetch images early; duplicate calls are ignored. */
export function preloadImages(sources: readonly string[]) {
  for (const href of sources) {
    if (loaded.has(href)) continue;
    loaded.add(href);
    preload(href, { as: "image" });
  }
}
