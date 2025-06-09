import React from 'react';
import MuiStep from '@mui/material/Step';
import { WStepProps } from './w-stepper.types';

export const WStep: React.FC<WStepProps> = (props) => {
  return <MuiStep {...props} />;
};
