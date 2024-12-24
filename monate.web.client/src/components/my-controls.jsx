import * as React from 'react';
import TextField from '@mui/material/TextField';
import { IMaskInput } from 'react-imask';
import { useLightMode } from '../globals/interface';

export const MyTextField = ({ required, name, value, id, style, onChange, error, inputComponent, type, autoComplete, disabled, placeholder }) => {
    const lightMode = useLightMode();

    return (
        <TextField
            required={required}
            disabled={disabled}
            id={id}
            label={name}
            defaultValue={value}
            type={type}
            style={style}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error}
            autoComplete={autoComplete}
            placeholder={placeholder}
            InputProps={{
                inputComponent: inputComponent,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#7f8f8f',
                    },
                    '&:hover fieldset': {
                        borderColor: lightMode ? '#1f1fcf' : '#1fcfcf',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: lightMode ? '#1f2f2f' : '#cfdfdf',
                    },
                    '&.Mui-disabled fieldset': {
                        borderColor: '#7f8f8f',
                    }
                },
                input: {
                    color: lightMode ? '#1f2f2f' : '#cfdfdf',
                },
                '& .MuiOutlinedInput-input.Mui-disabled': {
                    WebkitTextFillColor: '#7f8f8f',
                },
                '& .MuiInputLabel-root': {
                    color: '#7f8f8f',
                    fontWeight: 'bold',
                },
            }}
        />
    );
};

export const MyMultilineTextField = ({ required, name, value, id, style, onChange, error, inputComponent, type, autoComplete, disabled, fontSize, rows, maxRows }) => {
    const lightMode = useLightMode();

    return (
        <TextField
            multiline
            required={required}
            disabled={disabled}
            id={id}
            label={name}
            defaultValue={value}
            type={type}
            style={style}
            onChange={onChange}
            error={Boolean(error)}
            helperText={error}
            autoComplete={autoComplete}
            rows={rows}
            maxRows={maxRows}
            InputProps={{
                inputComponent: inputComponent,
            }}
            sx={{
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#7f8f8f',
                    },
                    '&:hover fieldset': {
                        borderColor: lightMode ? '#1f1fcf' : '#1fcfcf',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: lightMode ? '#1f2f2f' : '#cfdfdf',
                    },
                    '&.Mui-disabled fieldset': {
                        borderColor: '#7f8f8f',
                    }
                },
                textarea: {
                    color: lightMode ? '#1f2f2f' : '#cfdfdf',
                    fontSize: fontSize,
                },
                '& .MuiOutlinedInput-textarea.Mui-disabled': {
                    WebkitTextFillColor: '#7f8f8f',
                },
                '& .MuiInputLabel-root': {
                    color: '#7f8f8f',
                    fontSize: fontSize,
                    fontWeight: 'bold',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                    color: lightMode ? '#1f2f2f' : '#cfdfdf',
                    fontSize: '16px',
                },
                '& .MuiInputLabel-root.Mui-disabled': {
                    color: '#7f8f8f',
                },
            }}
        />
    );
};

export const ZipCodeMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardNumberMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#000 0000 0000 0000"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardCVVMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export const CreditCardDateMask = React.forwardRef(function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="#0/00"
            definitions={{
                '#': /[1-9]/,
            }}
            inputRef={ref}
            onAccept={(value) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});