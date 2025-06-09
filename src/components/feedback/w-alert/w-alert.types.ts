import { AlertProps as MuiAlertProps, AlertColor } from '@mui/material/Alert';

export interface WAlertProps extends MuiAlertProps {
  // No custom props for now, acting as a direct wrapper.
  // titleText?: string; // Example for future extension
}

// Re-export AlertColor for convenience if consumers need it with WAlertProps
export type { AlertColor };
