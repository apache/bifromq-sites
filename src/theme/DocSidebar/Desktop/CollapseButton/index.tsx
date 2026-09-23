import React from 'react';
import type {Props} from '@theme/DocSidebar/Desktop/CollapseButton';
import DocSidebarToggle from '@site/src/components/DocSidebarToggle';

export default function CollapseButton({onClick}: Props) {
  return (
    <div className="docs-sidebar-toolbar">
      <DocSidebarToggle collapsed={false} onClick={onClick} />
    </div>
  );
}
