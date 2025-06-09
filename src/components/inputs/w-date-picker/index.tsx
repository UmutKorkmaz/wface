import * as React from 'react';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BaseComponentProps } from '../../base/base-component-props';
import { DistributiveOmit } from '@mui/types'; // Assuming this is still relevant or replaced by MUI X types if needed
// WTextField might not be directly used in renderInput anymore, but kept if other props rely on it.
// However, the new DatePicker handles the TextField internally via slotProps.

// Define WDatePickerProps based on @mui/x-date-pickers/DatePickerProps
// We need to omit props that are handled internally by WDatePicker or via slotProps if we customize TextField.
// For simplicity, let's assume most DatePickerProps are valid, and we add our custom ones.
export type WDatePickerProps<TDate = Date> = BaseComponentProps &
  DistributiveOmit<DatePickerProps<TDate>, 'renderInput' | 'inputFormat'> & { // inputFormat is now format
  fullWidth?: boolean;
  format?: string; // This is now 'format' in v6/v7, was 'inputFormat'
  helperText?: string;
  error?: boolean; // DatePicker's error is boolean
  variant?: 'standard' | 'filled' | 'outlined'; // TextField variant
  margin?: 'none' | 'dense' | 'normal'; // TextField margin
  // renderInput is no longer the primary way; use slotProps.textField for TextField customization
}

export const WDatePicker: React.FC<WDatePickerProps> = ((props: WDatePickerProps) => {
  const {
    id,
    label,
    value,
    onChange,
    error,
    helperText,
    fullWidth = true,
    format = "dd.MM.yyyy", // MUI X uses 'format' prop directly
    disabled,
    readOnly,
    minDate,
    maxDate,
    variant = 'standard', // Default TextField variant
    margin = 'normal',  // Default TextField margin
    sx, // Pass sx to the DatePicker directly
    ...rest // other DatePicker props
  } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value === undefined ? null : value} // Handle undefined value for controlled component
        onChange={onChange}
        format={format}
        disabled={disabled}
        readOnly={readOnly}
        minDate={minDate}
        maxDate={maxDate}
        slotProps={{
          textField: {
            id: id,
            variant: variant,
            fullWidth: fullWidth,
            error: error,
            helperText: helperText,
            margin: margin,
            sx: sx, // Apply sx to the TextField via slotProps
          },
        }}
        {...rest} // Pass remaining props to DatePicker
      />
    </LocalizationProvider>
  );
});
