import { useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { MyTextField } from './my-controls';
import { GoogleIcon, AppleIcon } from './svg-icons';
import { useAlert } from './alerts';
import {
    useLightMode,
    useSaveEmail,
    useSavePassword,
    useSaveToken,
    useSaveFirstName,
    useSaveLastName,
    useSaveRegion,
    useSaveStateAddr,
    useSaveTitle,
    useSaveAvatar,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';

const MailInfoControl = (props) => {
    const { setOpenMailVerifyDialog, signUp, onSuccess } = props;

    const lightMode = useLightMode();
    const saveEmail = useSaveEmail();
    const savePassword = useSavePassword();
    const saveToken = useSaveToken();
    const saveFirstName = useSaveFirstName();
    const saveLastName = useSaveLastName();
    const saveRegion = useSaveRegion();
    const saveStateAddr = useSaveStateAddr();
    const saveTitle = useSaveTitle();
    const saveAvatar = useSaveAvatar();

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [emailAddr, setEmailAddr] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordValid, setPasswordValid] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailChange = (e) => {
        setEmailAddr(e.target.value);
    }

    const handlePasswordInputChange = (e) => {
        setPasswordInput(e.target.value);
    }

    const handlePasswordValidChange = (e) => {
        setPasswordValid(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!emailAddr) {
            setEmailError('Email address must be input.');
            return;
        }
        else if (!emailRegex.test(emailAddr)) {
            setEmailError('Email format is not correct.');
            return;
        }
        else setEmailError('');
        if (!passwordInput) {
            setPasswordError('Password must be input.');
            return;
        }
        else setPasswordError('');

        if (signUp) {
            if (passwordValid != passwordInput) {
                setPasswordError('Input password correctly.');
                return;
            }
            else {
                setPasswordError('');
                savePassword(passwordInput);
            }

            const cryptedEmail = await encrypt(emailAddr.toLowerCase());
            const emailData = { email: cryptedEmail };

            try {
                const response = await fetch(`user`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(emailData),
                });

                if (!response.ok) {
                    const data = await response.json();
                    showAlert({ severity: 'error', message: data.message });
                    return;
                }
                else {
                    saveEmail(emailAddr);
                    setOpenMailVerifyDialog(true);
                    showAlert({ severity: 'success', message: 'Verification code sent.' });
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
        } else {
            const loginData = {
                email: await encrypt(emailAddr),
                password: await encrypt(passwordInput),
            };

            try {
                const response = await fetch(`user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                    return;
                }
                else {
                    const newToken = await decrypt(data.token);
                    saveEmail(emailAddr);
                    saveToken(newToken);
                    showAlert({ severity: 'success', message: 'Logged in successfully.' });

                    if (data.state === 'profile' || data.state === 'success') {
                        saveFirstName(await decrypt(data.firstName));
                        saveLastName(await decrypt(data.lastName));
                        saveStateAddr(await decrypt(data.stateAddr));
                        saveRegion(await decrypt(data.region));
                    }
                    if (data.state === 'success') {
                        saveTitle(await decrypt(data.title));
                        saveAvatar(await decrypt(data.avatar));
                    }

                    onSuccess(data.state);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <MyTextField
                required
                name='Email Address'
                id='email-address'
                type='email'
                style={{ marginTop: signUp ? 'calc(8vh - 12px)' : '10vh', width: '30vw' }}
                error={emailError}
                autoComplete='username'
                onChange={handleEmailChange}
            />
            <MyTextField
                required
                name='Password'
                id='password'
                style={{ marginTop: 'calc(5vh - 12px)', width: '30vw' }}
                error={passwordError}
                type='password'
                autoComplete='new-password'
                onChange={handlePasswordInputChange}
            />
            {signUp ? <MyTextField
                required
                name='Password Validation'
                id='password-validation'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                error={passwordError}
                autoComplete='new-password'
                type='password'
                onChange={handlePasswordValidChange}
            /> : <div />}
            {signUp ? <FormControlLabel control={<Checkbox defaultChecked style={{ color: lightMode ? '#1f2f2f' : '#cfdfdf' }} />}
                style={{ color: lightMode ? '#1f2f2f' : '#cfdfdf', marginTop: 'calc(2.5vh - 12px)' }}
                label="I agree to sign up with this email." /> : <div />}
            <Button
                varient='contained'
                onClick={handleSubmit}
                style={{
                    marginTop: signUp ? 'calc(1vh - 12px)' : 'calc(10vh - 36px)', width: '17vw', height: '5vh', fontSize: '3vh',
                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                }}
            >Submit</Button>
            <Button
                disabled
                varient='contained'
                style={{
                    marginTop: 'calc(7vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.4vh',
                    color: lightMode ? '#3f4f4f' : '#cfdfdf', backgroundColor: lightMode ? '#cfdfdf' : '#1f2f2f'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <GoogleIcon width='2vw' height='2vw' />
                    <span style={{ marginLeft: '1vw', textTransform: 'none', }}>
                        {signUp ? 'Sign up with Google' : 'Log in with Google'}
                    </span>
                </div>
            </Button>
            <Button
                disabled
                varient='contained'
                style={{
                    marginTop: 'calc(3vh - 12px)', width: '30vw', height: '5vh', fontSize: '2.4vh',
                    color: lightMode ? '#3f4f4f' : '#cfdfdf', backgroundColor: lightMode ? '#cfdfdf' : '#1f2f2f'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <AppleIcon width='2vw' height='2vw' />
                    <span style={{ marginLeft: '1vw', textTransform: 'none', }}>
                        {signUp ? 'Sign up with Apple' : 'Log in with Apple'}
                    </span>
                </div>
            </Button>
        </form>
    )
};

export default MailInfoControl;