import React from 'react';
import MuiAutocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { WAutocompleteProps } from './w-autocomplete.types';

export function WAutocomplete<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(props: WAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    // WFace specific props for TextField customization
    textFieldLabel,
    textFieldVariant = 'outlined', // Default variant
    textFieldHelperText,
    textFieldError,
    // Standard Autocomplete props
    renderInput, // User can override default renderInput
    label, // MUI Autocomplete's own label prop
    ...rest
  } = props;

  // Use the label from Autocomplete props if textFieldLabel is not provided
  const actualLabel = textFieldLabel || label;

  const defaultRenderInput = (params: AutocompleteRenderInputParams) => (
    <TextField
      {...params}
      label={actualLabel}
      variant={textFieldVariant}
      helperText={textFieldHelperText}
      error={textFieldError}
      // InputLabelProps and InputProps are spread from params by default
    />
  );

  return (
    <MuiAutocomplete<T, Multiple, DisableClearable, FreeSolo>
      renderInput={renderInput || defaultRenderInput}
      label={label} // Pass label to MuiAutocomplete so it can provide it to renderInput params if needed
      {...rest} // Spread the rest of the MuiAutocomplete props
    />
  );
}
