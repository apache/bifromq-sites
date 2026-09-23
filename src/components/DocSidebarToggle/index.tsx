import React, {type MouseEventHandler} from 'react';
import {translate} from '@docusaurus/Translate';

type Props = {
  collapsed: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function DocSidebarToggle({collapsed, onClick}: Props) {
  const label = collapsed
    ? translate({id: 'theme.docs.sidebar.expandButtonAriaLabel', message: 'Expand sidebar'})
    : translate({id: 'theme.docs.sidebar.collapseButtonAriaLabel', message: 'Collapse sidebar'});

  return (
    <button
      type="button"
      className={`docs-sidebar-toggle${collapsed ? ' docs-sidebar-toggle--expand' : ''}`}
      title={label}
      aria-label={label}
      aria-expanded={!collapsed}
      onClick={onClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M9 4v16" />
        <path d={collapsed ? 'm13 9 3 3-3 3' : 'm16 9-3 3 3 3'} />
      </svg>
    </button>
  );
}
