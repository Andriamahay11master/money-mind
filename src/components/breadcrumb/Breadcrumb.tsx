import { ReactNode, useId } from 'react';
import Link from 'next/link';
import './breadcrumb.scss';

export type CrumbItem = {
  label: ReactNode;
  path: string;
};
export type BreadcrumbProps = {
  items: CrumbItem[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const id = useId();

  return (
    <div className='breadcrumb-container'>
      {items.map((crumb, i) => {
        const isLastItem = i === items.length - 1;
        if (!isLastItem) {
          return (
            <span key={`${id}+${i}`} >
              <Link href={crumb.path} key={`${id}+${i}`} className='breadcrumb-link'>
                {crumb.label}
              </Link>
              {/* separator */}
              <span className='breadcrumb-separator' key={`${id}-${i}`}> / </span>
            </span>
          );
        } else {
          return (<span  key={`${id}+${i}`} className='breadcrumb-label' >{crumb.label}</span> )
        }
      })}
    </div>
  );
}
