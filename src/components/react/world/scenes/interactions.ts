import Phaser from 'phaser';

/** How far beyond the zone's own bounds the player can stand and still interact. */
const INTERACTION_RADIUS = 64;
const PROMPT_DEPTH = 10_000;

export interface InteractionZoneSpec {
  /** Zone center in world coordinates. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Prompt / marker anchor, relative to the zone center. */
  promptOffset: { x: number; y: number };
  onInteract(): void;
  /** Proximity affordances (e.g. landmark glow). */
  onEnter?(): void;
  onExit?(): void;
}

interface TrackedZone {
  spec: InteractionZoneSpec;
  radius: number;
  prompt: Phaser.GameObjects.Container;
  promptTween: Phaser.Tweens.Tween;
  inRange: boolean;
}

/**
 * Proximity-driven interaction zones with a floating keycap prompt (PRD §6.6). One instance
 * per scene, updated each frame from the base scene; the closest in-range zone receives the
 * interact intent.
 */
export class InteractionZones {
  private zones: TrackedZone[] = [];
  private active: TrackedZone | null = null;

  constructor(private readonly scene: Phaser.Scene) {}

  add(spec: InteractionZoneSpec): void {
    const prompt = buildPrompt(
      this.scene,
      spec.x + spec.promptOffset.x,
      spec.y + spec.promptOffset.y
    );
    const promptTween = this.scene.tweens.add({
      targets: prompt,
      y: prompt.y - 7,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    });

    this.zones.push({
      spec,
      radius: Math.max(spec.width, spec.height) / 2 + INTERACTION_RADIUS,
      prompt,
      promptTween,
      inRange: false,
    });
  }

  /** Call each frame with the player position. */
  update(playerX: number, playerY: number): void {
    let closest: TrackedZone | null = null;
    let closestDistance = Infinity;

    for (const zone of this.zones) {
      const distance = Phaser.Math.Distance.Between(playerX, playerY, zone.spec.x, zone.spec.y);
      if (distance <= zone.radius && distance < closestDistance) {
        closest = zone;
        closestDistance = distance;
      }
    }

    for (const zone of this.zones) {
      const inRange = zone === closest;
      if (inRange === zone.inRange) continue;
      zone.inRange = inRange;
      zone.prompt.setVisible(inRange);
      if (inRange) {
        zone.promptTween.resume();
        zone.spec.onEnter?.();
      } else {
        zone.promptTween.pause();
        zone.spec.onExit?.();
      }
    }

    this.active = closest;
  }

  /** Fire the interact intent on the zone the player is standing in, if any. */
  triggerActive(): boolean {
    if (!this.active) return false;
    this.active.spec.onInteract();
    return true;
  }
}

/** Small keycap "E" that bobs above interactables. */
function buildPrompt(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
  const keycap = scene.add.graphics();
  keycap.fillStyle(0xfffdf5, 1);
  keycap.fillRoundedRect(-19, -19, 38, 38, 10);
  keycap.lineStyle(3, 0x3c2d19, 0.85);
  keycap.strokeRoundedRect(-19, -19, 38, 38, 10);
  // keycap "3D" base edge
  keycap.fillStyle(0xd8cdb4, 1);
  keycap.fillRoundedRect(-19, 12, 38, 7, { tl: 0, tr: 0, bl: 10, br: 10 });

  const letter = scene.add
    .text(0, -2, 'E', {
      fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      fontSize: '22px',
      fontStyle: 'bold',
      color: '#3c2d19',
    })
    .setOrigin(0.5);

  return scene.add.container(x, y, [keycap, letter]).setDepth(PROMPT_DEPTH).setVisible(false);
}
