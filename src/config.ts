/**
 * Feature flags. Flip a flag to true to turn the feature back on everywhere.
 * audio: Darija recordings are out of V1 scope; the player code stays dormant.
 */
export const FEATURES = {
  audio: false,
} as const;
