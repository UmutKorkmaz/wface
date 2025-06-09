import React from 'react';
import MuiStepLabel from '@mui/material/StepLabel';
import { WStepLabelProps } from './w-stepper.types';

export const WStepLabel: React.FC<WStepLabelProps> = (props) => {
  return <MuiStepLabel {...props} />;
};
