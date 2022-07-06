import * as React from 'react';
import DialogTitle, { DialogTitleProps } from '@mui/material/DialogTitle'


export interface WDialogTitleProps extends DialogTitleProps {}


export const WDialogTitle: React.FC<DialogTitleProps> = React.forwardRef((props) => {
  return (
    <DialogTitle  {...props} />
  );
});
