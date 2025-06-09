import React from 'react';
import MuiPagination from '@mui/material/Pagination';
import { WPaginationProps } from './w-pagination.types';

export const WPagination: React.FC<WPaginationProps> = (props) => {
  return <MuiPagination {...props} />;
};
