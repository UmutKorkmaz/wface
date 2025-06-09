import React from 'react';
import MuiFab from '@mui/material/Fab';
import { WFloatingActionButtonProps } from './w-floating-action-button.types';

export const WFloatingActionButton: React.FC<WFloatingActionButtonProps> = (props) => {
  return <MuiFab {...props} />;
};
