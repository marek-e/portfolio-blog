import type { ReactNode } from 'react';

interface TechItem {
  name: string;
  icon: ReactNode;
}

export const TECH_STACK: TechItem[] = [
  {
    name: 'React',
    icon: (
      <img
        src="/icons/react-logo.svg"
        alt="React"
        width={32}
        height={32}
        className="size-8 object-contain"
      />
    ),
  },
  {
    name: 'TypeScript',
    icon: (
      <img
        src="/icons/typescript-logo.svg"
        alt="TypeScript"
        width={32}
        height={32}
        className="size-8 object-contain"
      />
    ),
  },
  {
    name: 'Python',
    icon: (
      <img
        src="/icons/python-logo.svg"
        alt="Python"
        width={32}
        height={32}
        className="size-8 object-contain"
      />
    ),
  },
  {
    name: 'AWS Serverless',
    icon: (
      <img
        src="/icons/aws-lambda-logo.svg"
        alt="AWS Lambda"
        width={32}
        height={32}
        className="size-8 object-contain"
      />
    ),
  },
  {
    name: 'Next.js',
    icon: (
      <img
        src="/icons/next-js-logo.svg"
        alt="Next.js"
        width={32}
        height={32}
        className="size-8 object-contain dark:invert"
      />
    ),
  },
  // {
  //   name: 'More to come',
  //   icon: <img src="/icons/empty_badge.svg" alt="More to come" />,
  // },
];
