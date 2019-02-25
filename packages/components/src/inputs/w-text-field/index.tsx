//#region imports

import * as React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { WIconButton } from '../../buttons/w-icon-button';
import { WIcon } from '../../medias/w-icon'
import { TextFieldProps } from '@material-ui/core/TextField';

//#endregion

//#region export subtypes

export interface WTextFieldButton {
  icon: React.ReactNode;
  onClick(event: any, val: String): void;
}

export type WTextFieldProps = TextFieldProps & {
  defaultValue?: string;
  leftButtons?: WTextFieldButton[];
  rightButtons?: WTextFieldButton[];
}

export interface WTextFieldState {
  showPassword: boolean
}

//#endregion

export class WTextField extends React.Component<WTextFieldProps, WTextFieldState> {
  static defaultProps: WTextFieldProps = {
    value: ''
  }

  private textFieldRef: any;

  constructor(props: any) {
    super(props);
    this.textFieldRef = React.createRef();

    this.state = {
      showPassword: false
    }
  }

  public focus() {
    this.textFieldRef.current && this.textFieldRef.current.focus();
  }

  //#region render methods

  private renderButtons(buttons: WTextFieldButton[]): any[] {
    return buttons.map((btn, index) => {
      return (
        <span key={index}>
          <WIconButton
            onClick={() => btn.onClick && btn.onClick.bind(this)(null)}
            onMouseDown={() => event.preventDefault()}>
            {btn.icon}
          </WIconButton>
        </span>
      );
    })
  }

  private renderAdornments() {
    const result = {
      // ref: this.textFieldRef
    } as any;

    let leftButtons = this.props.leftButtons || [];
    let rightButtons = this.props.rightButtons || [];

    if (this.props.type == "password") {
      let action = {
        icon: <WIcon>{this.state.showPassword ? "visibility_off" : "visibility"}</WIcon>,
        onClick: function (e, value: string) {
          this.setState({ showPassword: !this.state.showPassword });
        }
      } as WTextFieldButton;
      rightButtons.push(action);
    }
    
    if (leftButtons.length > 0) {
      result.startAdornment = (
        <InputAdornment position="start">
          {this.renderButtons(leftButtons)}
        </InputAdornment>
      );
    }

    if(rightButtons.length > 0) {
      result.endAdornment = (
        <InputAdornment position="end">
          {this.renderButtons(rightButtons)}
        </InputAdornment>
      );
    }
 
    return result;
  }

  public render() {
    let inputProps = { ...this.props.InputProps, ...this.renderAdornments() };

    return (
      <TextField
        {...this.props}
        type={this.props.type == 'password' && !this.state.showPassword ? 'password' : 'text'}
        InputProps={inputProps}
        inputProps={{
          ref: this.textFieldRef
        }}
      />
    );
  }
  //#endregion    
}