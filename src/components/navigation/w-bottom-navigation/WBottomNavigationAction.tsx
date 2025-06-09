import React from 'react';
import MuiBottomNavigationAction from '@mui/material/BottomNavigationAction';
import { WBottomNavigationActionProps } from './w-bottom-navigation.types';

export const WBottomNavigationAction: React.FC<WBottomNavigationActionProps> = (props) => {
  return <MuiBottomNavigationAction {...props} />;
};
