import React from 'react';
import MuiImageListItemBar from '@mui/material/ImageListItemBar';
import { WImageListItemBarProps } from './w-image-list.types';

export const WImageListItemBar: React.FC<WImageListItemBarProps> = (props) => {
  return <MuiImageListItemBar {...props} />;
};
