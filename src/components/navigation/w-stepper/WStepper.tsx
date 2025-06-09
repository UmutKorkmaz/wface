import React from 'react';
import MuiStepper from '@mui/material/Stepper';
import { WStepperProps } from './w-stepper.types';

export const WStepper: React.FC<WStepperProps> = (props) => {
  return <MuiStepper {...props} />;
};
