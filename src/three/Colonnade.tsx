import { GreekColumn } from "./GreekColumn";
import { COLUMN_X, COLUMN_Z_POSITIONS, COLUMN_CONSTRUCTION_BASE, COLUMN_STAGGER, PLATFORM_Y, STAIR_TOP_Z } from "./journey";

export function Colonnade() {
  return (
    <>
      {COLUMN_Z_POSITIONS.map((z, i) => {
        const baseY = z < STAIR_TOP_Z ? PLATFORM_Y : 0;
        const range: [number, number] = [
          COLUMN_CONSTRUCTION_BASE[0] + i * COLUMN_STAGGER,
          COLUMN_CONSTRUCTION_BASE[1] + i * COLUMN_STAGGER,
        ];
        return (
          <group key={z}>
            <GreekColumn position={[-COLUMN_X, baseY, z]} constructionRange={range} />
            <GreekColumn position={[COLUMN_X, baseY, z]} constructionRange={range} />
          </group>
        );
      })}
    </>
  );
}
