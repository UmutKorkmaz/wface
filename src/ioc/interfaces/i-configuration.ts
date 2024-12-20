import IComponents from './i-components';
import { IMenuTreeItem } from './i-auth-service';
import { WTheme } from '../../components';
import { RecursivePartial } from '../..';
import { AppContext } from '../../store';
import React from 'react';

export default interface IConfiguration {
  projectName: string,
  basename?: string,
  components?: IComponents;

  screenList: { [key: string]: any };
  useRightContextItems?: () => { id: string, icon?: string, text: string, onClick?: ((event: any) => void) | string }[];
  customToolbarComponent?: any;
  rightDrawer?: {
    buttonIcon?: string;
    buttonComponent?: any;
    contentComponent?: any;
    contentBoxStyle?: any;
  };

  authRequired?: any;
  useAuthService: () => {
    login(username: string, password: string, values?: any): Promise<{ displayName: string, token?: string, data?: any; }>;
    getMenuTree(): Promise<IMenuTreeItem[]>;
  }
  api?: {
    baseUrl: string;
    useToken: () => string;
  }
  theme?: RecursivePartial<WTheme>;
  useLocalStorage?: boolean;
  hooks?: {
    onAppDidMount?(): void;
    onAppWillUnmount?(): void;
    onLogin?(): void;
    onLogout?(): void;
  };
  search?: boolean;
  searchProvider?: {
    search: (term: string, appContext: AppContext) => Promise<any[]>;
    renderSearchItem: (item: any, appContext: AppContext) => React.ReactNode;
    onItemSelected: (item: any, appContext: AppContext) => void;
  };

  wrapApp?: (children: JSX.Element) => JSX.Element;
  useTranslation?: () => {
    t: (key: string) => string;
  }
}