import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MonateIcon } from '../components/svg-icons';
import ModeSwitch from '../components/mode-switch';
import MailVerificationDialog from '../components/mail-verification-dialog';
import MailInfoControl from '../components/mail-info-control';
import LocationInfoControl from '../components/location-info-control';
import ProfileControl from '../components/profile-control';
import { useAlert } from '../components/alerts';
import {
    useLightMode,
    useEmail,
    useToken, useSaveToken,
    useSaveFirstName,
    useSaveLastName,
    useSaveAvatar,
    useSaveTitle,
    useSaveRegion,
    useSaveStateAddr,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './sign.css';

const Sign = (props) => {
    const { signUp } = props;

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();
    const saveToken = useSaveToken();
    const saveFirstName = useSaveFirstName();
    const saveLastName = useSaveLastName();
    const saveAvatar = useSaveAvatar();
    const saveTitle = useSaveTitle();
    const saveRegion = useSaveRegion();
    const saveStateAddr = useSaveStateAddr();

    const [openMailVerifyDialog, setOpenMailVerifyDialog] = useState(false);
    const [signMode, setSignMode] = useState('mail');

    const navigate = useNavigate();

    useEffect(() => {
        const validateToken = async () => {
            if (email && token) {
                const tokenData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                };
                try {
                    const response = await fetch(`user/validatetoken`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tokenData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                    }
                    else {
                        const newToken = await decrypt(data.token);
                        saveToken(newToken);

                        showAlert({ severity: 'success', message: 'Logged in successfully.' });

                        if (data.state === 'profile' || data.state === 'success' || data.state === 'pending' || data.state === 'suspended') {
                            saveFirstName(await decrypt(data.firstName));
                            saveLastName(await decrypt(data.lastName));
                            saveStateAddr(await decrypt(data.stateAddr));
                            saveRegion(await decrypt(data.region));
                        }
                        if (data.state === 'success' || data.state === 'pending' || data.state === 'suspended') {
                            saveTitle(await decrypt(data.title));
                            saveAvatar(await decrypt(data.avatar));
                        }

                        handleSuccess(data.state);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        if (!signUp)
            validateToken();
    }, []);

    const handleMailVerifyDialogClose = () => {
        setOpenMailVerifyDialog(false);
    };

    const handleMailVerifySuccess = () => {
        setOpenMailVerifyDialog(false);
        setSignMode('location');
    };

    const handleSuccess = (state) => {
        setSignMode(state);
        if (state === 'success')
            navigate('/');
    };

    return (
        <div>
            <div className={lightMode ? 'signup-light-header' : 'signup-dark-header'}>
                <Link
                    to='/'
                    className={(lightMode ? 'signup-light-link-title' : 'signup-dark-link-title') + ' Large signup-title-link'}
                >
                    <div className='signup-title'>
                        <MonateIcon width='45px' height='45px' />ONATE
                    </div>
                </Link>
                <ModeSwitch />
            </div>
            <span className='signup-body'>
                <div className={lightMode ? 'signup-main-light' : 'signup-main-dark'}>
                    <div className={(lightMode ? 'signup-main-light-title' : 'signup-main-dark-title') + ' Large'}>
                        {signUp ? 'Sign Up' : 'Log In'}
                    </div>
                    <div className={lightMode ? 'signup-main-light-inputs' : 'signup-main-dark-inputs'}>
                        {signMode === 'mail' &&
                            <MailInfoControl setOpenMailVerifyDialog={setOpenMailVerifyDialog} signUp={signUp} onSuccess={handleSuccess} />}
                        {signMode === 'location' &&
                            <LocationInfoControl onSuccess={handleSuccess} />}
                        {signMode === 'profile' &&
                            <ProfileControl onSuccess={handleSuccess} />}
                        {signMode === 'pending' &&
                            <div style={{ marginTop: '20vh', fontSize: '20px', color: 'red', display: 'flex', justifyContent: 'center' }}>
                                Your account is pending now. Please contact with support team.
                            </div>}
                        {signMode === 'suspended' &&
                            <div style={{ marginTop: '20vh', fontSize: '20px', color: 'red', display: 'flex', justifyContent: 'center' }}>
                                Your account is suspended now. Please contact with support team.
                            </div>}
                    </div>
                </div>
            </span>
            <MailVerificationDialog
                onClose={handleMailVerifyDialogClose}
                onVerifySuccess={handleMailVerifySuccess}
                open={openMailVerifyDialog}
            />
        </div>
    );
};

export default Sign;
