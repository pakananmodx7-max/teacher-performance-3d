export interface Waypoint {
  t: number;
  position: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

// The camera holds still (human eye height, ~1.7m) while the temple constructs
// itself in front of it, then dollies forward through the stairs and entrance
// once the architecture and PA typography have fully formed.
export const cameraPath: Waypoint[] = [
  { t: 0.0, position: [0, 1.7, 18], lookAt: [0, 2.5, -15], fov: 45 },
  { t: 0.65, position: [0, 1.7, 18], lookAt: [0, 2.5, -15], fov: 45 },
  { t: 0.75, position: [0, 1.85, 10], lookAt: [0, 2.35, -9], fov: 45 },
  { t: 0.85, position: [0, 2.0, 4], lookAt: [0, 3.4, -1], fov: 44 },
  // Looks up at the pediment while passing beneath the entrance gateway, keeping
  // real architecture in frame instead of a narrow-FOV void between column rows.
  { t: 0.9, position: [0.2, 2.1, 1], lookAt: [0.2, 6.5, -3], fov: 44 },
  { t: 0.95, position: [0.1, 2.2, -4], lookAt: [0.1, 2.6, -14], fov: 43 },
  { t: 1.0, position: [0, 2.1, -10], lookAt: [0, 2.3, -26], fov: 42 },
];

// Architectural levels (see Floor.tsx / Entablature.tsx):
export const LOWER_FLOOR_Z: [number, number] = [7.8, 46];
export const STAIR_TOP_Z = 5.3;
export const STAIR_BOTTOM_Z = 7.8;
export const PLATFORM_Y = 1.2;
export const PLATFORM_Z: [number, number] = [-24, STAIR_TOP_Z];
export const ENTRY_Z = 2.7; // where the entablature/pediment gateway stands

export const COLUMN_X = 4.8;
export const COLUMN_Z_POSITIONS = [16, 12.6, 9.2, 2.7, -0.9, -4.5];

// Scroll-progress breakpoints, matching the requested opening sequence map.
export const MEANDER_RANGE: [number, number] = [0.03, 0.17];
export const COLUMN_CONSTRUCTION_BASE: [number, number] = [0.17, 0.42];
export const COLUMN_STAGGER = 0.015;
export const LIGHTING_RISE_RANGE: [number, number] = [0.42, 0.52];
export const PA_CONSTRUCTION_RANGE: [number, number] = [0.46, 0.6];
// All opening typography fades out before the camera dolly begins at 0.65,
// so nothing looms/clips as the camera flies past its world position.
export const PA_VISIBLE_RANGE: [number, number] = [0.42, 0.63];
export const EYEBROW_RANGE: [number, number] = [0.5, 0.63];
export const THAI_SUBTITLE_RANGE: [number, number] = [0.58, 0.63];
export const PART1_RANGE: [number, number] = [0.95, 1.0];

export const TOTAL_SCROLL_VH = 420;
