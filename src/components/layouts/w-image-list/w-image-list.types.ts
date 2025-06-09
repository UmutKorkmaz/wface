import {
  ImageListProps as MuiImageListProps,
  ImageListItemProps as MuiImageListItemProps,
  ImageListItemBarProps as MuiImageListItemBarProps
} from '@mui/material';
import { BaseComponentProps } from '../../base/base-component-props';

export interface WImageListProps extends BaseComponentProps, MuiImageListProps {}
export interface WImageListItemProps extends BaseComponentProps, MuiImageListItemProps {}
export interface WImageListItemBarProps extends BaseComponentProps, MuiImageListItemBarProps {}
