import React from 'react';
import MuiStack from '@mui/material/Stack';
import { WStackProps } from './w-stack.types';

export const WStack: React.FC<WStackProps> = (props) => {
  return <MuiStack {...props} />;
};
