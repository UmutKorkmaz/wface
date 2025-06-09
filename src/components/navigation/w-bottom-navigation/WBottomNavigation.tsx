import React from 'react';
import MuiBottomNavigation from '@mui/material/BottomNavigation';
import { WBottomNavigationProps } from './w-bottom-navigation.types';

export const WBottomNavigation: React.FC<WBottomNavigationProps> = (props) => {
  return <MuiBottomNavigation {...props} />;
};
