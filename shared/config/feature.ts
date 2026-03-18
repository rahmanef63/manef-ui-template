import type { FeatureManifest } from "./types";

export function defineFeature<T extends FeatureManifest>(manifest: T) {
  return manifest;
}
