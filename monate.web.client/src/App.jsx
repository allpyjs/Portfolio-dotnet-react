import { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Routes
} from 'react-router-dom';

import './style.css';

import Dashboard from './pages/dashboard';
import NotFound from './pages/not-found';
import Portfolio from './pages/portfolio';
import UploadEndpoint from './pages/upload-endpoint';
import GetEndpoint from './pages/get-endpoint';
import UploadWorkflow from './pages/upload-workflow';
import PreviewWorkflow from './pages/preview-workflow';
import Sign from './pages/sign';
import Manager from './pages/manager';
import MyEndpoints from './pages/my-endpoints';
import AlertProvider from './components/alerts';
import NavbarProvider from './components/navbar';
import {
    useSaveRegion, useRegion,
} from './globals/interface';
//import useStorageHooks from './globals/storage-hooks';
import initRegion from '../helpers/region-helper';

const App = (props) => {
    //useStorageHooks();

    const saveRegion = useSaveRegion();
    const region = useRegion();

    useEffect(() => {
        const fetchRegion = async () => {
            if (region === null) {
                const regionData = await initRegion();
                saveRegion(regionData.country);
            }
        };
        fetchRegion();
    }, []);

    return (
        <AlertProvider>
            <NavbarProvider>
                <Router>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/signup" element={<Sign signUp />} />
                        <Route path="/login" element={<Sign />} />
                        <Route path="/upload-portfolio" element={<Portfolio />} />
                        <Route path="/upload-endpoint" element={<UploadEndpoint />} />
                        <Route path="/manage-users" element={<Manager />} />
                        <Route path="/manage-endpoints" element={<Manager />} />
                        <Route path="/manage-custom-nodes" element={<Manager />} />
                        <Route path="/manage-value-types" element={<Manager />} />
                        <Route path="/my-endpoints" element={<MyEndpoints />} />
                        <Route path="/get-endpoint" element={<GetEndpoint />} />
                        <Route path="/upload-workflow" element={<UploadWorkflow />} />
                        <Route path="/preview-workflow" element={<PreviewWorkflow />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Router>
            </NavbarProvider>
        </AlertProvider>
    );
}

export default App;
