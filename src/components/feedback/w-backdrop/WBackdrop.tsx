import React from 'react';
import MuiBackdrop from '@mui/material/Backdrop';
import { WBackdropProps } from './w-backdrop.types';

export const WBackdrop: React.FC<WBackdropProps> = (props) => {
  // Example for future extension with showSpinner:
  // const { showSpinner, spinnerColor, children, ...rest } = props;
  // if (showSpinner) {
  //   return (
  //     <MuiBackdrop {...rest}>
  //       <CircularProgress color={spinnerColor || 'inherit'} />
  //       {/* Decide if children are rendered alongside spinner, or if spinner replaces them */}
  //       {children}
  //     </MuiBackdrop>
  //   );
  // }
  return <MuiBackdrop {...props} />;
};
