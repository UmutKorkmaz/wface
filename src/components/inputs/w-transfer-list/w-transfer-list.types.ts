import { SxProps, Theme } from '@mui/material/styles';
import { BaseComponentProps } from '../../base/base-component-props';

export interface WTransferListItem {
  id: string | number;
  label: string;
  disabled?: boolean;
}

export interface WTransferListProps extends BaseComponentProps {
  id?: string;
  leftListTitle?: string;
  rightListTitle?: string;
  initialLeftItems?: WTransferListItem[];
  initialRightItems?: WTransferListItem[];
  onListChange?: (leftItems: WTransferListItem[], rightItems: WTransferListItem[]) => void;
  sx?: SxProps<Theme>;
  cardSx?: SxProps<Theme>;
  listSx?: SxProps<Theme>; // For styling the List component itself (height, overflow)
}
