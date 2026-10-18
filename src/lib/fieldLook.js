// The look every HeroField shares. Each field reads this every frame, so the
// dev tweak panel (src/dev/Tweaks.js) can change it live; in production
// nothing writes to it and these are the values. Colors are 0–1 RGB.
export const fieldLook = {
  speed: 0.16,
  intensity: 1,
  push: 0.14,
  pointerGlow: 0.32,
  bloom: 0.5,
  deep: [0.027, 0.031, 0.055],
  ink: [0.094, 0.102, 0.243],
  inkDeep: [0.055, 0.062, 0.175],
  glint: [0.769, 0.804, 1.0],
};
