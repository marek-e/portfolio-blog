import { Pre } from './Pre';
import { H1, H2, H3, H4 } from './Heading';
import { Highlight } from './Highlight';
import { Callout } from './Callout';
import { Citation } from './Citation';
import { Mermaid } from './Mermaid';
import { Toggle } from './Toggle';
import { PastelCard, PastelCards } from './PastelCard';

export const mdxComponents = {
  pre: Pre,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  Highlight,
  Callout,
  Citation,
  Mermaid,
  PastelCard,
  PastelCards,
  // Toggle is added in the page files with client:load
};

export { Pre, H1, H2, H3, H4, Highlight, Callout, Citation, Mermaid, Toggle, PastelCard, PastelCards };
