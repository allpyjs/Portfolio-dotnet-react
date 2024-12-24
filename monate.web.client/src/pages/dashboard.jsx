import { useState } from 'react';
import Header from '../components/header';
import AnimatedBackgrounds from '../components/animated-backgrounds';
import { useAlert } from '../components/alerts';
import DashboardTabs from '../components/dashboard-tabs';
import PortfolioControl from '../components/portfolio-control';
import EndpointControl from '../components/endpoint-control';
import UserControl from '../components/user-control';
import Footer from '../components/footer';
import useCryptionHelper from '../../helpers/cryption-helper';
import {
    useLightMode,
    useEmail,
    useToken, useSaveToken,
} from '../globals/interface';
import './dashboard.css';

const Dashboard = (props) => {
    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();
    const saveToken = useSaveToken();

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const [currentPage, setCurrentPage] = useState('portfolios');

    const onPortfolios = async() => {
        setCurrentPage('portfolios');
    }
    const onUsers = async() => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('users');
        }
    }
    const onEndpoints = async () => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('endpoints');
        }
    }
    const onAboutUs = async () => {
        const permition = await validateToken();
        if (permition) {
            setCurrentPage('aboutus');
        }
    }

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
                    return false;
                }
                else {
                    const newToken = await decrypt(data.token);
                    saveToken(newToken);

                    if (data.state === 'pending') {
                        showAlert({ severity: 'error', message: 'Your account is pending now. Please contact with support team.' });
                        return false;
                    }
                    if (data.state === 'suspended') {
                        showAlert({ severity: 'error', message: 'Your account is suspended now. Please contact with support team.' });
                        return false;
                    }
                    return true;
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                return false;
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            return false;
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <AnimatedBackgrounds />
                <DashboardTabs onPortfolios={onPortfolios} onUsers={onUsers} onEndpoints={onEndpoints} onAboutUs={onAboutUs} />
                {currentPage === 'portfolios' &&
                    <PortfolioControl />}
                {currentPage === 'users' &&
                    <UserControl />}
                {currentPage === 'endpoints' &&
                    <EndpointControl />}
                <Footer />
            </div>
            <Header />
        </div>
    );
}

export default Dashboard;