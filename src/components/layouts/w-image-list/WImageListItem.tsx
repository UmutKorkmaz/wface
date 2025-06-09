import React from 'react';
import MuiImageListItem from '@mui/material/ImageListItem';
import { WImageListItemProps } from './w-image-list.types';

export const WImageListItem: React.FC<WImageListItemProps> = (props) => {
  return <MuiImageListItem {...props} />;
};
