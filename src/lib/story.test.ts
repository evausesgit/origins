import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDossier } from "@/data";
import { stories } from "@/data/stories";
import { LOCALES } from "@/data/types";
import { cueAt, sceneAt, wrap } from "./story";

describe("animated stories", () => {
  for (const story of Object.values(stories)) {
    const { script, timing } = story;
    describe(story.slug, () => {
      it("belongs to an existing dossier", () => {
        expect(getDossier(story.slug)).toBeDefined();
      });

      it("has its timing generated from the current script", () => {
        // A cue added or renamed without re-running `npm run story:audio` shows up here.
        expect(Object.keys(timing.cues)).toEqual(script.cues.map((c) => c.id));
        expect(Object.keys(timing.scenes)).toEqual(script.scenes.map((s) => s.id));
      });

      it("plays its cues in order, scene by scene, within the duration", () => {
        const sceneIds = script.scenes.map((s) => s.id);
        let last = -1;
        let lastScene = 0;
        for (const cue of script.cues) {
          const ct = timing.cues[cue.id];
          expect(ct.at).toBeGreaterThan(last);
          expect(ct.end).toBeGreaterThan(ct.at);
          expect(ct.end).toBeLessThanOrEqual(timing.duration);
          const si = sceneIds.indexOf(cue.scene);
          expect(si).toBeGreaterThanOrEqual(lastScene);
          const slot = timing.scenes[cue.scene];
          expect(ct.at).toBeGreaterThanOrEqual(slot.start);
          expect(ct.end).toBeLessThanOrEqual(slot.end);
          last = ct.end;
          lastScene = si;
        }
      });

      it("has every caption in every language, and a voice-over track per language", () => {
        for (const cue of script.cues) for (const l of LOCALES) expect(cue[l].trim()).not.toBe("");
        for (const s of script.scenes) for (const l of LOCALES) expect(s.label[l].trim()).not.toBe("");
        for (const l of LOCALES) expect(existsSync(`public/stories/${story.slug}/narration-${l}.mp3`)).toBe(true);
      });

      it("finds the scene and the caption being read at a given time", () => {
        const first = script.cues[0];
        expect(cueAt(script, timing, timing.cues[first.id].at + 0.1)?.id).toBe(first.id);
        expect(sceneAt(script, timing, timing.duration).id).toBe(script.scenes[script.scenes.length - 1].id);
      });
    });
  }
});

describe("wrap", () => {
  it("keeps lines within the limit", () => {
    for (const line of wrap("one two three four five six seven eight nine ten", 12)) expect(line.length).toBeLessThanOrEqual(12);
  });
  it("never starts a line with French closing punctuation", () => {
    const lines = wrap("« Les Juifs pratiquaient des rites sataniques impliquant le meurtre d'enfants. » Qui l'a dit en premier, et quand ?", 20);
    for (const line of lines) expect(line).not.toMatch(/^[»?!:;]/);
    for (const line of lines) expect(line).not.toMatch(/«$/);
  });
});
