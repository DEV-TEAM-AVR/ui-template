import React from "react";
import { Autocomplete, TextField, MenuItem, InputAdornment } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import SearchIcon from "@mui/icons-material/Search";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  label?: string;
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  freeSolo?: boolean;
}

export const Combobox = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Buscar...",
  error,
  required,
  className = "",
  disabled = false,
  freeSolo = false,
}: ComboboxProps) => {
  // En freeSolo, value puede ser cualquier string, no necesariamente de options
  const selected = options.find((o) => o.value === value) || (freeSolo && value ? { value, label: value } : null);

  return (
    <Autocomplete
      freeSolo={freeSolo}
      options={options}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
      value={selected}
      onChange={(_, newValue) => {
        if (typeof newValue === 'string') {
          onChange(newValue);
        } else {
          onChange(newValue?.value ?? "");
        }
      }}
      onInputChange={(_, newInputValue) => {
        if (freeSolo) {
          onChange(newInputValue);
        }
      }}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      className={className}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          error={!!error}
          required={required}
          helperText={error ? (
            <span className="flex items-center gap-1">
              <ErrorOutlineIcon sx={{ fontSize: 14 }} className="shrink-0" />
              {error}
            </span>
          ) : null}
          size="small"
          InputLabelProps={{
            shrink: true,
            sx: {
              textTransform: 'uppercase',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: 'zinc.500',
            },
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} className="text-zinc-400 dark:text-zinc-400" />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3, // rounded-xl (~12px)
              backgroundColor: 'var(--mui-input-bg)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'zinc.200',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'zinc.300',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'emerald.500',
                borderWidth: '2px',
              },
            },
          }}
        />
      )}
      renderOption={(props, option) => (
        <MenuItem {...props} key={option.value} sx={{ fontSize: '14px' }}>
          {option.label}
        </MenuItem>
      )}
    />
  );
};
