import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker, TimePickerProps } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BaseComponentProps } from '../../base/base-component-props';
import { DistributiveOmit } from '@mui/types'; // Assuming this is still relevant

// WTextField is no longer used directly for renderInput

export type WTimePickerProps<TDate = Date> = BaseComponentProps &
  DistributiveOmit<TimePickerProps<TDate>, 'renderInput' | 'inputFormat'> & {
  fullWidth?: boolean;
  format?: string; // MUI X uses 'format', @mui/lab used 'inputFormat'
  helperText?: string;
  error?: boolean; // For TextField error state
  variant?: 'standard' | 'filled' | 'outlined'; // TextField variant
  margin?: 'none' | 'dense' | 'normal'; // TextField margin
}

export const WTimePicker: React.FC<WTimePickerProps> = ((props: WTimePickerProps) => {
  const {
    id,
    label,
    value,
    onChange,
    error,
    helperText,
    fullWidth = true,
    format, // MUI X TimePicker doesn't use 'format' directly like DatePicker for string display, but for parsing.
             // The displayed format is more influenced by the adapter and locale.
             // If a specific string format is needed for display, it's usually handled by `ampm` and adapter.
    disabled,
    readOnly,
    minTime,
    maxTime,
    variant = 'standard',
    margin = 'normal',
    sx,
    ampm = false, // Default from old component
    ...rest
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={label}
        value={value === undefined ? null : value}
        onChange={onChange}
        disabled={disabled}
        readOnly={readOnly}
        minTime={minTime}
        maxTime={maxTime}
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


