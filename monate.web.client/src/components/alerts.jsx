import { createContext, useState, useContext } from 'react';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);

    const showAlert = ({ severity, message }) => {
        const id = Date.now();
        setAlerts(prevAlerts => [...prevAlerts, { id, severity, message, open: true }]);

        setTimeout(() => {
            setAlerts(prevAlerts => prevAlerts.map(alert =>
                alert.id === id ? { ...alert, open: false } : alert
            ));
            setTimeout(() => {
                setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
            }, 500);
        }, 2000);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}
            <div style={styles.alertContainer}>
                {alerts.map(alert => (
                    <Slide key={alert.id} direction="left" in={alert.open} timeout={500}>
                        <Alert variant='filled' severity={alert.severity} style={styles.alert}>
                            {alert.message}
                        </Alert>
                    </Slide>
                ))}
            </div>
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    return useContext(AlertContext);
};

const styles = {
    alertContainer: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        zIndex: 1000,
        width: '300px',
    },
    alert: {
        transition: 'opacity 0.5s ease-in-out',
    },
};

export default AlertProvider;
