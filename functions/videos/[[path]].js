const RANGE = /^bytes=(\d*)-(\d*)$/;

function parseRange(header, size) {
  const match = RANGE.exec(header);
  if (!match || (match[1] === '' && match[2] === '')) return null;
  const [, from, to] = match;
  const start = from === '' ? Math.max(0, size - Number(to)) : Number(from);
  const end = from === '' || to === '' ? size - 1 : Math.min(Number(to), size - 1);
  return { start, end };
}

export async function onRequest({ request, env }) {
  const asset = await env.ASSETS.fetch(request);
  const headers = new Headers(asset.headers);
  headers.set('Accept-Ranges', 'bytes');
  const requested = request.headers.get('Range');
  if (request.method !== 'GET' || asset.status !== 200 || !requested) {
    return new Response(asset.body, { status: asset.status, headers });
  }

  const bytes = new Uint8Array(await asset.arrayBuffer());
  const range = parseRange(requested, bytes.byteLength);
  if (!range) return new Response(bytes, { status: 200, headers });

  if (range.start > range.end) {
    headers.set('Content-Range', `bytes */${bytes.byteLength}`);
    return new Response(null, { status: 416, headers });
  }

  headers.set('Content-Range', `bytes ${range.start}-${range.end}/${bytes.byteLength}`);
  return new Response(bytes.subarray(range.start, range.end + 1), { status: 206, headers });
}
