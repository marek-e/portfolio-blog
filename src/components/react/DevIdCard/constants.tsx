import type { ReactNode } from 'react';

interface TechItem {
  name: string;
  icon: ReactNode;
}

export const TECH_STACK: TechItem[] = [
  {
    name: 'React',
    icon: <img src="/src/assets/react-logo.svg" alt="React" />,
  },
  {
    name: 'TypeScript',
    icon: <img src="/src/assets/typescript-logo.svg" alt="TypeScript" />,
  },
  {
    name: 'Python',
    icon: <img src="/src/assets/python-logo.svg" alt="Python" />,
  },
  {
    name: 'AWS Serverless',
    icon: <img src="/src/assets/aws-lambda-logo.svg" alt="AWS Lambda" />,
  },
  {
    name: 'Next.js',
    icon: <img src="/src/assets/next-js-logo.svg" alt="Next.js" className="dark:invert" />,
  },
  {
    name: 'More to come',
    icon: <img src="/src/assets/empty_badge.svg" alt="More to come" />,
  },
];

