import EndpointControl from '../components/endpoint-control';
import Header from '../components/header';
import { useLightMode } from '../globals/interface';
import './my-endpoints.css';

const MyEndpoints = (props) => {
    const lightMode = useLightMode();
    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '70px' }}>
                <EndpointControl user />
            </div>
            <Header />
        </div>
    );
}

export default MyEndpoints;