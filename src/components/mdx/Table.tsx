import type { ComponentProps } from 'react';

export function Table(props: ComponentProps<'table'>) {
  return (
    <div data-table className="prose-table">
      <table {...props} />
    </div>
  );
}
