import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BaseComponentProps } from '../../base/base-component-props';
import { DistributiveOmit } from '@mui/types';

// WTextField is no longer used directly for renderInput

export type WDateTimePickerProps<TDate = Date> = BaseComponentProps &
  DistributiveOmit<DateTimePickerProps<TDate>, 'renderInput' | 'inputFormat'> & {
  fullWidth?: boolean;
  format?: string; // MUI X uses 'format', @mui/lab used 'inputFormat'
  helperText?: string;
  error?: boolean; // For TextField error state
  variant?: 'standard' | 'filled' | 'outlined'; // TextField variant
  margin?: 'none' | 'dense' | 'normal'; // TextField margin
};

export const WDateTimePicker: React.FC<WDateTimePickerProps> = ((props: WDateTimePickerProps) => {
  const {
    id,
    label,
    value,
    onChange,
    error,
    helperText,
    fullWidth = true,
    format = "dd.MM.yyyy HH:mm", // Default format for date-time
    disabled,
    readOnly,
    minDateTime,
    maxDateTime,
    variant = 'standard',
    margin = 'normal',
    sx,
    ampm, // DateTimePicker also has ampm prop
    ...rest
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value === undefined ? null : value}
        onChange={onChange}
        format={format}
        disabled={disabled}
        readOnly={readOnly}
        minDateTime={minDateTime}
        maxDateTime={maxDateTime}
        ampm={ampm}
        slotProps={{
          textField: {
            id: id,
            variant: variant,
            fullWidth: fullWidth,
            error: error,
            helperText: helperText,
            margin: margin,
            sx: sx,
          },
        }}
        {...rest}
      />
    </LocalizationProvider>
  );
});

