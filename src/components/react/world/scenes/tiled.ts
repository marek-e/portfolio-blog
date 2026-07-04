// Helpers over Phaser's Tiled object model. All gameplay data lives in the .tmj files
// (PRD §9.3) — the painting is dumb pixels; these readers are the only bridge.

import type Phaser from 'phaser';

type TiledObject = Phaser.Types.Tilemaps.TiledObject;

export interface Point {
  x: number;
  y: number;
}

export interface DoorObject {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Scene key to start. */
  target: string;
  /** Named spawn point in the target scene. */
  spawn: string;
}

export interface ProjectZone {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Canonical project slug — the Tiled zone is the single source of this mapping (PRD §9.3). */
  slug: string;
  /** Where the interaction prompt anchors, relative to the zone center. */
  promptOffset: Point;
}

export function getStringProperty(obj: TiledObject, name: string): string | undefined {
  const properties = obj.properties as { name: string; value: unknown }[] | undefined;
  const property = properties?.find((p) => p.name === name);
  return typeof property?.value === 'string' ? property.value : undefined;
}

export function getNumberProperty(obj: TiledObject, name: string): number | undefined {
  const properties = obj.properties as { name: string; value: unknown }[] | undefined;
  const property = properties?.find((p) => p.name === name);
  return typeof property?.value === 'number' ? property.value : undefined;
}

export function readSpawns(map: Phaser.Tilemaps.Tilemap, layer: string): Map<string, Point> {
  const spawns = new Map<string, Point>();
  for (const obj of map.getObjectLayer(layer)?.objects ?? []) {
    if (obj.type === 'spawn' && obj.name) {
      spawns.set(obj.name, { x: obj.x!, y: obj.y! });
    }
  }
  return spawns;
}

export function readProjectZones(map: Phaser.Tilemaps.Tilemap, layer: string): ProjectZone[] {
  const zones: ProjectZone[] = [];
  for (const obj of map.getObjectLayer(layer)?.objects ?? []) {
    if (obj.type !== 'project') continue;
    const slug = getStringProperty(obj, 'slug');
    if (!slug) continue;
    zones.push({
      x: obj.x!,
      y: obj.y!,
      width: obj.width!,
      height: obj.height!,
      slug,
      promptOffset: {
        x: getNumberProperty(obj, 'promptOffsetX') ?? 0,
        y: getNumberProperty(obj, 'promptOffsetY') ?? 0,
      },
    });
  }
  return zones;
}

export function readDoors(map: Phaser.Tilemaps.Tilemap, layer: string): DoorObject[] {
  const doors: DoorObject[] = [];
  for (const obj of map.getObjectLayer(layer)?.objects ?? []) {
    if (obj.type !== 'door') continue;
    const target = getStringProperty(obj, 'target');
    const spawn = getStringProperty(obj, 'spawn');
    if (!target || !spawn) continue;
    doors.push({ x: obj.x!, y: obj.y!, width: obj.width!, height: obj.height!, target, spawn });
  }
  return doors;
}
