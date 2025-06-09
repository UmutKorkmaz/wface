import { BackdropProps as MuiBackdropProps } from '@mui/material/Backdrop';
import { BaseComponentProps } from '../../base/base-component-props'; // Assuming BaseComponentProps might be useful

export interface WBackdropProps extends BaseComponentProps, MuiBackdropProps {
  // WFace specific props can be added here later
  // e.g., showSpinner?: boolean;
  // e.g., spinnerColor?: import('@mui/material/CircularProgress').CircularProgressProps['color'];
}
