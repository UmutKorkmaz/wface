import React from 'react';
import MuiAlert from '@mui/material/Alert';
import { WAlertProps } from './w-alert.types';

export const WAlert: React.FC<WAlertProps> = (props) => {
  return <MuiAlert {...props} />;
};

// For convenience if users want to use AlertTitle with WAlert
export { AlertTitle } from '@mui/material/Alert';
