import type { ComponentType } from "react";
import { NorwichStory, type SceneProps } from "./norwich/NorwichStory";

/** The drawing of each dossier's story; its words and timing live in the dossier's story.json. */
export const storyScenes: Record<string, ComponentType<SceneProps>> = {
  "norwich-1144": NorwichStory,
};
