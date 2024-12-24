import Header from '../components/header';
import { useLightMode } from '../globals/interface';
import './manager.css';

const Manager = (props) => {
    const lightMode = useLightMode();

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{
                display: 'flex', flexDirection: 'row', width: '100%', height: '100vh',
                backgroundColor: lightMode ? '#cfdfdf' : '#0f1f1f'
            }}>
                <div style={{ width: '350px', height: 'calc(100% - 72px)', marginTop: '72px', backgroundColor: lightMode ? '#00000011' : '#ffffff11' }}>
                    <div className={lightMode ? 'tab-button-light' : 'tab-button-dark'} style={{ marginTop: '100px', marginLeft: '100px', width: '250px', }}>
                        Inbox
                    </div>
                    <div className={lightMode ? 'tab-button-light' : 'tab-button-dark'} style={{ marginTop: '2px', marginLeft: '100px', width: '250px', }}>
                        Users
                    </div>
                    <div className={lightMode ? 'tab-button-light' : 'tab-button-dark'} style={{ marginTop: '2px', marginLeft: '100px', width: '250px', }}>
                        Portfolios
                    </div>
                    <div className={lightMode ? 'tab-button-light' : 'tab-button-dark'} style={{ marginTop: '2px', marginLeft: '100px', width: '250px', }}>
                        Endpoints
                    </div>
                    <div className={lightMode ? 'tab-button-light' : 'tab-button-dark'} style={{ marginTop: '2px', marginLeft: '100px', width: '250px', }}>
                        Profiles
                    </div>
                </div>
                <div style={{ flexGrow: 1, marginTop: '72px' }}>
                </div>
            </div>
            <Header />
        </div>
    )
}

export default Manager;