import React from 'react';
import MuiImageList from '@mui/material/ImageList';
import { WImageListProps } from './w-image-list.types';

export const WImageList: React.FC<WImageListProps> = (props) => {
  return <MuiImageList {...props} />;
};
