export function GlassFrame() {
  return (
    <div className="dev-id-card-frame" aria-hidden="true">
      <img
        className="dev-id-card-frame-top"
        src="/images/dev-id-frame.webp"
        alt=""
        width={1024}
        height={1348}
        decoding="async"
      />
      <img
        className="dev-id-card-frame-bottom"
        src="/images/dev-id-lower-rim.webp"
        alt=""
        width={1536}
        height={246}
        decoding="async"
      />
    </div>
  );
}
