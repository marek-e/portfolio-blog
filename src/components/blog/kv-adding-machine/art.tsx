import type { Ref } from 'react';
import type { Item } from './geometry';
import type { SolidPaths } from './iso';

export function Solid({
  paths,
  tone = 'mid',
  crease = 'faint',
  inner,
  lit = false,
  ref,
}: {
  paths: SolidPaths;
  tone?: string;
  crease?: string;
  inner?: string;
  lit?: boolean;
  ref?: Ref<SVGGElement>;
}) {
  return (
    <g ref={ref} className="iso-solid" data-lit={lit ? '' : undefined}>
      <path className="iso-fill" d={paths.fill} />
      {paths.shades.map((d, shade) => (
        <path key={shade} className="iso-shade" data-shade={shade} d={d} />
      ))}
      <path className="iso-top" d={paths.top} />
      <path
        className="iso-line"
        data-tone={crease === 'none' ? 'faint' : crease}
        d={crease === 'none' ? '' : paths.crease}
      />
      {paths.bevel && crease !== 'none' ? (
        <path className="iso-line" data-tone={crease} d={paths.bevel} />
      ) : null}
      {inner ? <path className="iso-line" data-tone="faint" d={inner} /> : null}
      <path className="iso-line iso-edge" data-tone={tone} d={paths.outline} />
    </g>
  );
}

export function writeSolid(group: SVGGElement | null, paths: SolidPaths) {
  if (!group) return;
  const nodes = group.children;
  nodes[0].setAttribute('d', paths.fill);
  paths.shades.forEach((d, shade) => nodes[1 + shade].setAttribute('d', d));
  const top = 1 + paths.shades.length;
  nodes[top].setAttribute('d', paths.top);
  nodes[top + 1].setAttribute('d', paths.crease);
  nodes[nodes.length - 1].setAttribute('d', paths.outline);
}

const tenth = (value: number) => Math.round(value * 10) / 10;

export function ItemView({ item }: { item: Item }) {
  if (item.kind === 'solid')
    return <Solid paths={item.paths} tone={item.tone} crease={item.crease} inner={item.inner} />;
  if (item.kind === 'line')
    return item.d ? <path className="iso-line" data-tone={item.tone} d={item.d} /> : null;
  if (item.kind === 'halo') return <path className="iso-halo" d={item.d} />;
  if (item.kind === 'fill') return <path className={item.className} d={item.d} />;
  return (
    <g className="iso-dots" data-tone={item.tone}>
      {item.points.map(([x, y], index) => (
        <circle key={index} cx={tenth(x)} cy={tenth(y)} r={item.size} />
      ))}
    </g>
  );
}

export function Items({ items, name }: { items: Item[]; name: string }) {
  return (
    <g key={name}>
      {items.map((item, index) => (
        <ItemView key={index} item={item} />
      ))}
    </g>
  );
}
