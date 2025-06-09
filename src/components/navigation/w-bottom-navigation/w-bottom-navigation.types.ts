import {
  BottomNavigationProps as MuiBottomNavigationProps,
  BottomNavigationActionProps as MuiBottomNavigationActionProps
} from '@mui/material';
import { BaseComponentProps } from '../../base/base-component-props'; // Assuming BaseComponentProps might be useful

export interface WBottomNavigationProps extends BaseComponentProps, MuiBottomNavigationProps {
  // WFace specific props can be added here later
}

export interface WBottomNavigationActionProps extends BaseComponentProps, MuiBottomNavigationActionProps {
  // WFace specific props can be added here later
}
