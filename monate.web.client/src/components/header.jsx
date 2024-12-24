import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import DisplayRegion from './display-region';
import ModeSwitch from './mode-switch';
import { MonateIcon } from './svg-icons';
import { useNavbar } from './navbar';
import {
    useLightMode,
    useFirstName,
    useLastName,
    useAvatar,
} from '../globals/interface';
import './header.css';

const Header = (props) => {
    const [scrolled, setScrolled] = useState(false);
    const lightMode = useLightMode();
    const firstName = useFirstName();
    const lastName = useLastName();
    const avatar = useAvatar();
    const navigate = useNavigate();
    const { showNavbar } = useNavbar();

    const onShowNavbar = () => {
        showNavbar();
    }

    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    let headerClasses = ['header' + (lightMode ? '-light' : '-dark')];
    if (scrolled) {
        headerClasses.push('header-scrolled');
    }

    const handleSignUp = () => {
        navigate('/signup');
    }

    const handleLogIn = () => {
        navigate('/login');
    }

    return (
        <header className={headerClasses.join(' ')}>
            <nav className='header-nav'>
                <div>
                    <Link to='/' className={(lightMode ? 'header-light-link-title Large' : 'header-dark-link-title Large') + ' header-title-link'}>
                        <div className='header-title'><MonateIcon width='45px' height='45px' />ONATE</div>
                    </Link>
                </div>
                <div className='header-right'>
                    <div className='header-region'>
                        <DisplayRegion />
                    </div>
                    {firstName ? (
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={onShowNavbar}>
                            <div className='header-avatar-container'>
                                {avatar ? (
                                    <img src={avatar} className='header-avatar-image'/>
                                ) : (
                                    <div className='header-avatar-div'>
                                        {firstName[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <div className='header-name'>
                                {firstName + ' ' + lastName[0].toUpperCase() + '.'}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <Button variant='text' className='header-log-in-button'
                                style={{ color: lightMode ? '#60f' : '#fff', }}
                                onClick={handleLogIn}>Log in</Button>
                            <Button variant='text' className='header-sign-up-button'
                                style={{ color: lightMode ? '#60f' : '#fff', }}
                                onClick={handleSignUp}>Sign up</Button>
                        </div>
                    )}
                    <ModeSwitch />
                </div>
            </nav>
        </header >
    );
};

export default Header;