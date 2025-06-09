import { AutocompleteProps as MuiAutocompleteProps } from '@mui/material/Autocomplete';
import { BaseComponentProps } from '../../base/base-component-props'; // Assuming BaseComponentProps might be useful

// T: The type of the option an array of options will be passed to options property.
// Multiple: If true, an array of T will be the value type.
// DisableClearable: If true, the delete icon will be hidden.
// FreeSolo: If true, the user input is not bound to provided options.
export interface WAutocompleteProps<
  T,
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends BaseComponentProps,
    Omit<MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>, 'renderInput'> {
      // WFace specific props can be added here later
      // For example, to explicitly pass TextField props if not using Autocomplete's own label/variant etc.
      textFieldLabel?: string;
      textFieldVariant?: 'standard' | 'outlined' | 'filled';
      textFieldHelperText?: string;
      textFieldError?: boolean;
      // renderInput can be optionally provided by the user for full customization
      renderInput?: MuiAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>['renderInput'];
    }
