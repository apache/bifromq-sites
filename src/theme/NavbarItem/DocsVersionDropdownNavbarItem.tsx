import React, { type ComponentProps, type ReactNode } from 'react';
import { useLocation } from '@docusaurus/router';
import Original from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';

export default function DocsVersionDropdownNavbarItem(props: ComponentProps<typeof Original>): ReactNode {
  const { pathname } = useLocation();
  if (pathname.startsWith('/tenon/docs/')) {
    return <span className={props.mobile ? 'menu__link' : 'navbar__item'}>Tenon · Development</span>;
  }
  if (pathname === '/tenon' || pathname.startsWith('/tenon/')) return null;
  return <Original {...props} />;
}
