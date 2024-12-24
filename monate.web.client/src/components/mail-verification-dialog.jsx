import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MyTextField } from './my-controls';
import { useAlert } from './alerts';
import {
    useEmail, useSaveEmail,
    useLightMode,
    usePassword,
    useSaveToken,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';

const MailVerificationDialog = (props) => {
    const { onClose, onVerifySuccess, open } = props;

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const emailAddr = useEmail();
    const saveEmailAddr = useSaveEmail();
    const lightMode = useLightMode();
    const password = usePassword();
    const saveToken = useSaveToken();

    const [verifyCode, setVerifyCode] = useState('');
    const [error, setError] = useState('');

    const handleChange = (event) => {
        const value = event.target.value;
        setVerifyCode(value);
        if (value.length !== 6) {
            setError('Input must be 6 characters long.');
        } else {
            setError('');
        }
    };

    const handleSubmit = async() => {
        if (verifyCode.length !== 6)
            return;

        const verifyData = {
            email: await encrypt(emailAddr.toLowerCase()),
            password: await encrypt(password),
            code: await encrypt(verifyCode),
        };

        try {
            const response = await fetch(`user/verifycode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verifyData),
            });
            const data = await response.json();

            if (!response.ok) {
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                const token = await decrypt(data.token);
                saveToken(token);
                saveEmailAddr(emailAddr);

                showAlert({ severity: 'success', message: 'Verified successfully.' });

                onVerifySuccess();
            }
        } catch (error) {
            showAlert({ severity: 'error', message: 'Could not found server.' });
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    backgroundColor: lightMode ? '#efffff' : '#0f1f1f',
                    padding: '25px',
                    borderRadius: '25px'
                }
            }}
        >
            <DialogTitle
                style={{
                    marginTop: '20px',
                    fontSize: '40px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    color: lightMode ? '#0f1f1f' : '#efffff'
                }}>Verify Code</DialogTitle>
            <DialogContent>
                <DialogContentText style={{ color: lightMode ? '#0f1f1f' : '#efffff' }}>
                    Please enter your 6 numbers of verification code.
                </DialogContentText>
                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    textAlign: 'center',
                    height: '60px',
                }} >
                    <MyTextField
                        autoFocus
                        required
                        margin='dense'
                        id='verifyCode'
                        variant='standard'
                        textAlign='center'
                        error={error}
                        onChange={handleChange} />
                </div>
            </DialogContent>
            <DialogActions style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center'
            }} >
                <Button onClick={onClose} style={{ color: lightMode ? '#0f1f1f' : '#efffff', fontSize: '17px' }}>Cancel</Button>
                <Button onClick={handleSubmit} style={{ color: lightMode ? '#0f1f1f' : '#efffff', marginLeft: '20px', fontSize: '17px' }}>Submit</Button>
            </DialogActions>
            <br/>
        </Dialog>
    )
};

export default MailVerificationDialog;