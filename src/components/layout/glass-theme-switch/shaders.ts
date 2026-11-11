export const vertexSource = `#version 300 es
in vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const fragmentSource = `#version 300 es
precision highp float;
uniform vec2 resolution;
uniform vec2 knobSize;
uniform float knobX;
uniform float knobRadius;
uniform float progress;
uniform float angle;
uniform float energy;
uniform float lift;
uniform float time;
uniform sampler2D pixels;
uniform sampler2D bloom;
out vec4 color;
float pixelAlpha;

float roundedBox(vec2 p, vec2 size, float radius) {
  vec2 q = abs(p) - size + radius;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
}

vec3 lightColor() { return mix(vec3(0.4353, 0.5255, 1.0), vec3(1.0, 0.6588, 0.1804), progress); }

vec3 illuminate(vec3 surface, float strength) {
  vec3 tint = mix(surface, lightColor() * 1.04 + 0.03, clamp(1.0 - exp(-strength * 1.3), 0.0, 0.88));
  return mix(surface + lightColor() * strength, tint, progress);
}

float lightDistance(vec2 p) {
  vec2 local = p - vec2(knobX, 0.0);
  float edge = roundedBox(local, knobSize, knobRadius) - 6.5;
  float delta = atan(local.y, local.x) - angle;
  float tangent = max(abs(atan(sin(delta), cos(delta))) - 0.92, 0.0) * 104.0;
  return length(vec2(edge, tangent)) - 1.5;
}

float sampleIcon(sampler2D source, vec2 p) {
  vec2 uv = (p - vec2(knobX, 0.0)) / 192.0 + 0.5;
  if (any(lessThan(uv, vec2(0.0))) || any(greaterThan(uv, vec2(1.0)))) return 0.0;
  return texture(source, uv).a;
}

float frostedIcon(vec2 p, float frost) {
  return mix(sampleIcon(pixels, p), sampleIcon(bloom, p) * 1.35, frost);
}

vec3 floorColor(vec2 p, float frost, vec2 dispersion) {
  vec3 floor = vec3(mix(0.03, 0.9, progress));
  floor *= 1.0 + p.y / 112.0 * mix(0.05, 0.012, progress);
  float cavity = smoothstep(-14.0, 3.0, roundedBox(p - vec2(0.0, 7.0), vec2(216.0, 112.0), 72.0));
  floor = mix(floor * (1.0 - cavity * 0.6), floor - cavity * 0.085, progress);
  float distance = max(lightDistance(p), 0.0);
  float wash = (exp(-distance / 14.0) * 0.85 + exp(-distance / 55.0) * 0.32) * energy;
  floor = illuminate(floor, wash * 0.55);
  vec3 ink = vec3(frostedIcon(p - dispersion, frost), frostedIcon(p, frost), frostedIcon(p + dispersion, frost));
  float luminance = dot(floor, vec3(0.299, 0.587, 0.114));
  vec3 pixelColor = mix(vec3(1.0, 0.965, 0.925), vec3(0.11, 0.105, 0.1), smoothstep(0.4, 0.56, luminance));
  pixelColor += mix(lightColor() * wash * 0.9, vec3(0.25, 0.08, 0.0) * wash, progress);
  pixelAlpha = clamp(ink.g, 0.0, 1.0);
  return mix(floor, pixelColor, clamp(ink, 0.0, 1.0)) + vec3(1.0, 0.78, 0.55) * sampleIcon(bloom, p) * 0.64 * (1.0 - progress);
}

void over(inout vec4 surface, vec3 layer, float alpha) {
  surface = vec4(layer * alpha + surface.rgb * (1.0 - alpha), alpha + surface.a * (1.0 - alpha));
}

void main() {
  vec2 p = (vec2(gl_FragCoord.x, resolution.y - gl_FragCoord.y) / resolution - 0.5) * vec2(1200.0, 992.0);
  float aa = 1200.0 / resolution.x;
  vec2 local = p - vec2(knobX, 0.0);
  float track = roundedBox(p, vec2(216.0, 112.0), 72.0);
  float lens = roundedBox(local, knobSize, knobRadius);
  float lamp = max(lightDistance(p), 0.0);
  float castShadow = 1.0 - smoothstep(-10.0, 34.0, roundedBox(p - vec2(0.0, 14.0), vec2(216.0, 112.0), 72.0));
  float contact = 1.0 - smoothstep(-2.0, 4.0, roundedBox(p - vec2(0.0, 1.5), vec2(216.0, 112.0), 72.0));
  vec4 result = vec4(0.0, 0.0, 0.0, castShadow * mix(0.5, 0.17, progress));
  over(result, vec3(0.0), contact * mix(0.3, 0.08, progress));
  float spill = (exp(-lamp / 18.0) * 0.5 + exp(-lamp / 85.0) * 0.34) * energy * 0.6;
  over(result, lightColor(), clamp(1.0 - exp(-spill * 1.3), 0.0, 0.88));

  float trackMask = 1.0 - smoothstep(-aa * 0.6, aa * 0.6, track);
  if (trackMask > 0.0) {
    vec3 tray = floorColor(p, 0.0, vec2(0.0));
    float shadow = 1.0 - smoothstep(-8.0, 20.0 + lift * 8.0, roundedBox(local - vec2(0.0, 7.0 + lift * 5.0), knobSize, knobRadius));
    tray *= 1.0 - shadow * mix(0.6, 0.2, progress);
    float rim = 1.0 - smoothstep(0.0, max(1.3, aa), abs(track + 0.75));
    float bottom = smoothstep(-67.2, 112.0, p.y);
    tray += rim * mix(mix(0.035, 0.09, bottom), mix(-0.07, 0.07, bottom), progress);
    over(result, tray, trackMask);
  }

  float lensMask = 1.0 - smoothstep(-aa * 0.7, aa * 0.7, lens);
  if (lensMask > 0.0) {
    vec2 e = vec2(0.5, 0.0);
    vec2 gradient = vec2(
      roundedBox(local + e.xy, knobSize, knobRadius) - roundedBox(local - e.xy, knobSize, knobRadius),
      roundedBox(local + e.yx, knobSize, knobRadius) - roundedBox(local - e.yx, knobSize, knobRadius)
    );
    vec2 normal = gradient / max(length(gradient), 0.0001);
    float depth = max(-lens, 0.0);
    float slope = pow(1.0 - clamp(depth / 26.0, 0.0, 1.0), 2.6);
    vec2 bend = -normal * slope * 40.0 - local * 0.055;
    vec3 glass = floorColor(p + bend, 0.06 + 0.76 * slope, normal * slope * 3.2 + local * 0.006);
    float vertical = clamp((local.y + knobSize.y) / (2.0 * knobSize.y), 0.0, 1.0);
    glass = mix(glass * 0.84 + vec3(0.135) * (1.0 - vertical * 0.55), mix(glass, vec3(0.99), 0.5 * (1.0 - pixelAlpha * 0.8)), progress);
    float scatter = (exp(-lamp / 24.0) * 0.8 + exp(-lamp / 64.0) * 0.2) * energy;
    glass = illuminate(glass, scatter * 0.8);
    glass = illuminate(glass, exp(-depth / 2.2) * exp(-lamp / 40.0) * energy * 1.3);
    float highlight = dot(normal, normalize(vec2(-0.35, -1.0)));
    glass += pow(max(highlight, 0.0), 2.0) * exp(-depth / 1.25) * mix(0.42, 0.7, progress);
    glass += max(highlight, 0.0) * slope * mix(0.07, 0.16, progress);
    glass *= 1.0 - max(-highlight, 0.0) * slope * mix(0.28, 0.07, progress);
    glass += exp(-depth / 0.7) * mix(0.07, 0.12, progress);
    over(result, glass, lensMask);
  }

  float stripDistance = lightDistance(p);
  float strip = 1.0 - smoothstep(-aa * 0.6, aa * 0.6, stripDistance);
  vec3 stripColor = mix(lightColor() * 1.05, mix(lightColor(), vec3(1.0), 0.65), 1.0 - smoothstep(-1.4, -0.2, stripDistance));
  over(result, stripColor * (0.8 + 0.35 * energy), strip);
  float halo = exp(-lamp / 4.5) * 0.55 * energy * (1.0 - strip);
  vec3 rgb = result.rgb / max(result.a, 0.0001);
  rgb = illuminate(rgb, halo);
  vec2 grain = fract((gl_FragCoord.xy + fract(time) * 91.7) * vec2(443.897, 441.423));
  grain += dot(grain, grain.yx + 19.19);
  rgb += (fract((grain.x + grain.y) * grain.x) - 0.5) * 0.022;
  color = vec4(clamp(rgb, 0.0, 1.0), result.a);
}
`;
