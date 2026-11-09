import type { Story, StoryScript, StoryTiming } from "@/lib/story";
import norwichScript from "./dossiers/norwich-1144/story.json";
import norwichTiming from "./dossiers/norwich-1144/story-timing.json";

/** Dossiers that have an animated story (src/data/dossiers/<slug>/story.json). */
export const stories: Record<string, Story> = {
  "norwich-1144": { slug: "norwich-1144", script: norwichScript as StoryScript, timing: norwichTiming as StoryTiming },
};

export const getStory = (slug: string): Story | undefined => stories[slug];

export const storyAudio = (slug: string, locale: string) => `/stories/${slug}/narration-${locale}.mp3`;
