import React from 'react';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { WBreadcrumbsProps } from './w-breadcrumbs.types';

export const WBreadcrumbs: React.FC<WBreadcrumbsProps> = (props) => {
  return <MuiBreadcrumbs {...props} />;
};
