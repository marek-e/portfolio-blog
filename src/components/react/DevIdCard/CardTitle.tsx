interface CardTitleProps {
  title: string;
}

const LogoHalf = ({ flip }: { flip?: boolean }) => (
  <svg
    className={`fill-primary size-6 ${flip ? 'rotate-180' : ''}`}
    viewBox="0 0 500 500"
    aria-hidden="true"
  >
    <path d="M 230.5,49.5 C 236.833,49.5 243.167,49.5 249.5,49.5C 249.667,66.17 249.5,82.8367 249,99.5C 183.964,103.248 137.964,134.581 111,193.5C 89.3116,254.436 100.478,308.603 144.5,356C 173.77,383.957 208.77,398.124 249.5,398.5C 249.5,415.5 249.5,432.5 249.5,449.5C 173.569,447.633 115.736,414.633 76,350.5C 47.7324,299.356 41.7324,245.69 58,189.5C 80.9942,123.172 125.828,79.0058 192.5,57C 205.158,53.7279 217.825,51.2279 230.5,49.5 Z" />
    <path d="M 236.5,149.5 C 240.833,149.5 245.167,149.5 249.5,149.5C 249.5,216.167 249.5,282.833 249.5,349.5C 210.273,348.478 180.773,331.145 161,297.5C 140.025,251.298 147.192,210.132 182.5,174C 198.223,160.708 216.223,152.541 236.5,149.5 Z" />
  </svg>
);

export function CardTitle({ title }: CardTitleProps) {
  return (
    <h3 className="text-primary relative z-10 mb-3 flex items-center justify-center gap-2 text-center text-xl font-bold md:text-2xl">
      <LogoHalf />
      {title}
      <LogoHalf flip />
    </h3>
  );
}

