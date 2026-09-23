import React from 'react';
import type {Props} from '@theme/DocRoot/Layout/Sidebar/ExpandButton';
import DocSidebarToggle from '@site/src/components/DocSidebarToggle';

export default function ExpandButton({toggleSidebar}: Props) {
  return <DocSidebarToggle collapsed onClick={toggleSidebar} />;
}
