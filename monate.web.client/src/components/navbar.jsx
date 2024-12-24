import { createContext, useState, useContext } from 'react';
import Slide from '@mui/material/Slide';
import { useAlert } from './alerts';
import {
    useLightMode,
    useAvatar,
    useFirstName,
    useLastName,
    useEmail,
    useToken,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './navbar.css';

const NavbarContext = createContext();

const NavbarProvider = ({ children }) => {
    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const lightMode = useLightMode();
    const avatar = useAvatar();
    const firstName = useFirstName();
    const lastName = useLastName();
    const email = useEmail();
    const token = useToken();

    const [open, setOpen] = useState(false);
    const [userType, setUserType] = useState('');

    const showNavbar = async() => {
        setOpen(true);

        if (email && token) {
            const tokenData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
            };
            try {
                const response = await fetch(`user/getusertype`, {
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
                    const _userType = await decrypt(data.userType);
                    setUserType(_userType);
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
        }
    };

    const onMouseLeave = () => {
        setOpen(false);
        setUserType('');
    }

    const onLogOut = () => {
        setOpen(false);
        localStorage.clear();
        window.location.href = '/';
    }

    const onAddPortfolio = () => {
        window.location.href = '/upload-portfolio';
    }

    const onManageUsers = () => {
        window.location.href = '/manage-users';
    }

    const onMyEndpoints = () => {
        window.location.href = '/my-endpoints';
    }

    return (
        <NavbarContext.Provider value={{ showNavbar }}>
            {children}
            <div style={{
                position: 'fixed', top: '0', height: '100vh', right: '0', display: 'flex', flexDirection: 'column',
                width: '350px', pointerEvents: open ? '' : 'none',
            }}>
                <Slide direction="left" in={open} timeout={500}>
                    <div style={{
                        width: '100%', display: 'flex', flexDirection: 'column', backgroundColor: lightMode ? '#ffffff44' : '#00000044',
                        borderColor: '#7f8f8f', height: '100vh', backdropFilter: 'blur(5px)'
                    }} onMouseLeave={onMouseLeave}>
                        <div style={{ marginTop: '100px', marginLeft: '40px', display: 'flex', flexDirection: 'row', alignContent: 'center' }}>
                            {avatar ?
                                <img
                                    src={avatar}
                                    style={{
                                        width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #28c',
                                    }}
                                /> :
                                <div
                                    style={{
                                        backgroundColor: 'deeppink', width: '40px', height: '40px', borderRadius: '50%',
                                        border: '1px solid #28c', objectFit: 'cover', textAlign: 'center', fontSize: '36px',
                                        color: 'white',
                                    }}
                                >
                                    {firstName && firstName[0].toUpperCase()}
                                </div>
                            }
                            <div style={{
                                color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', marginTop: '3px', marginLeft: '10px',
                            }}>
                                {` ${firstName} ${lastName}`}
                            </div>
                        </div>
                        <br />
                        <br />
                        {(userType === 'administrator') &&
                            <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'} onClick={onManageUsers}>
                                Manage Users
                            </div>}
                        {(userType === 'administrator') &&
                            <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'} onClick={onAddPortfolio}>
                                Upload Portfolio
                            </div>}
                        {(userType === 'administrator' || userType === 'team') &&
                            <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'}>
                                Manage Endpoints
                            </div>}
                        {(userType === 'administrator' || userType === 'team') &&
                            <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'}>
                                Manage Custom Nodes
                            </div>}
                        {(userType === 'administrator' || userType === 'team') &&
                            <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'}>
                                Manage Value Types
                            </div>}
                        <br />
                        {userType && <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'}>
                            My Profile
                            </div>}
                        {userType && <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'} onClick={onMyEndpoints}>
                            My Endpoints
                            </div>}
                        <br />
                        <div className={lightMode ? 'navbar-button-light' : 'navbar-button-dark'} onClick={onLogOut}>
                            Log out
                        </div>
                    </div>
                </Slide>
            </div>
        </NavbarContext.Provider>
    );
};

export const useNavbar = () => {
    return useContext(NavbarContext);
};

export default NavbarProvider;
