import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { UploadIcon, AddValueTypeIcon } from '../components/svg-icons';
import { useAlert } from '../components/alerts';
import ColumnBox from '../components/column-box';
import { MyTextField, MyMultilineTextField } from '../components/my-controls';
import {
    useLightMode,
    useEmail,
    useToken, useSaveToken,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './upload-workflow.css';

const UploadWorkflow = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const endpointId = queryParams.get('endpointId');

    const email = useEmail();
    const token = useToken();
    const lightMode = useLightMode();
    const saveToken = useSaveToken();

    const [endpointTitle, setEndpointTitle] = useState('');
    const [version, setVersion] = useState('v1.0');
    const [versionError, setVersionError] = useState('');
    const [price, setPrice] = useState('');
    const [priceError, setPriceError] = useState('');
    const [gPURequirement, setGPURequirement] = useState('');
    const [gPURequirementError, setGPURequirementError] = useState('');
    const [workflowImage, setWorkflowImage] = useState('');
    const [imageError, setImageError] = useState(false);
    const [description, setDescription] = useState('');
    const [workflowPath, setWorkflowPath] = useState('');
    const [workflowData, setWorkflowData] = useState({});
    const [valueTypes, setValueTypes] = useState([]);
    const [inputPaths, setInputPaths] = useState([]);
    const [inputedPaths, setInputedPaths] = useState([]);
    const [workflow, setWorkflow] = useState('');

    const { encrypt, decrypt } = useCryptionHelper();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const imageInputRef = useRef();
    const workflowInputRef = useRef();

    const onUploadImage = () => {
        imageInputRef.current.click();
    }

    const onUploadWorkflow = () => {
        workflowInputRef.current.click();
    }

    const onImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setWorkflowImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    const onWorkflowChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/json') {
            setWorkflowPath(file.name);
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    setWorkflow(e.target.result);
                    const data = JSON.parse(e.target.result);
                    setWorkflowData(data);
                    setInputedPaths([]);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    }

    useEffect(() => {
        const getEndpoint = async () => {
            if (email && token && endpointId) {
                const endpointData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                    id: await encrypt(endpointId),
                };
                try {
                    const response = await fetch(`endpoint/getendpoint`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(endpointData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                        navigate('/');
                    }
                    else {
                        const _title = await decrypt(data.title);
                        const _userEmail = await decrypt(data.userEmail);

                        if (_userEmail !== email) {
                            showAlert({ severity: 'error', message: 'You are not owner of this endpoint.' });
                            navigate('/');
                        }

                        setEndpointTitle(_title);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    navigate('/');
                }
            }
            else {
                showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
                navigate('/login');
            }
        }
        const getValueTypes = async () => {
            try {
                const response = await fetch(`valuetype`, {
                    method: 'GET',
                });
                const data = await response.json();
                setValueTypes(data.valueTypes);
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                navigate('/');
            }
        }
        getEndpoint();
        getValueTypes();
    }, []);

    useEffect(() => {
        try {
            const _inputPaths = [];

            for (const id in workflowData) {
                if (workflowData.hasOwnProperty(id)) {
                    const item = workflowData[id];
                    if (item.inputs) {
                        const classType = item.class_type;
                        const inputs = item.inputs;
                        for (const inputKey in inputs) {
                            if (inputs.hasOwnProperty(inputKey)) {
                                const inputValue = inputs[inputKey];
                                _inputPaths.push({
                                    path: `${id}. ${classType}/inputs/${inputKey}`,
                                    value: inputValue
                                });
                            }
                        }
                    }
                }
            }
            const inputPathsWithId = _inputPaths.map((item, index) => ({
                id: index,
                name: item.path
            }));
            setInputPaths(inputPathsWithId);
        }
        catch (error) {
            showAlert({ severity: 'error', message: 'Workflow file must be API format.' });
        }
    }, [workflowData])

    const handleEndpointTitle = () => {
        navigate(`/get-endpoint?id=${endpointId}`);
    }

    const handleVersionChange = (e) => {
        const _version = e.target.value;
        setVersion(_version);
    }

    const handlePriceChange = (e) => {
        const _price = e.target.value;
        setPrice(_price);
    }

    const handleGPURequirementChange = (e) => {
        const _GPURequirement = e.target.value;
        setGPURequirement(_GPURequirement);
    }

    const handleOutputIndexChange = (e) => {
        const _outputIndex = e.target.value;
        setOutputIndex(_outputIndex);
    }

    const handleDescriptionChange = (e) => {
        const _description = e.target.value;
        setDescription(_description);
    }

    const handleSubmitWorkflow = async () => {
        const validate = () => {
            let validated = true;
            if (workflowImage === '') {
                validated = false;
                setImageError(true);
            }
            else setImageError(false);
            if (version === '') {
                validated = false;
                setVersionError('You must input version.');
            }
            else setVersionError('');
            if (price === '') {
                validated = false;
                setPriceError('You must input price.');
            }
            else setPriceError('');
            if (gPURequirement === '') {
                validated = false;
                setGPURequirementError('You must input GPU usage.');
            }
            else setGPURequirementError('');

            return validated;
        }

        if (!validate())
            return;
        if (workflowPath === '') {
            showAlert({ severity: 'error', message: 'You must upload workflow' });
            return;
        }
        if (inputPaths === null || inputedPaths.length === 0) {
            showAlert({ severity: 'error', message: 'You must set at lease one of input value type.' });
            return;
        }
        if (inputPaths.some(inputPath => inputPath.name === '')) {
            showAlert({ severity: 'error', message: 'All input value names must be valid.' });
        }

        if (email && token && endpointId) {
            try {
                const _price = parseFloat(price);
                const _gpu = parseFloat(gPURequirement);
                if (_price < 0 || _gpu < 0) {
                    showAlert({ severity: 'error', message: 'Input values correctly.' });
                    return;
                }
            }
            catch {
                showAlert({ severity: 'error', message: 'Input values correctly.' });
                return;
            }

            const _inputValuePaths = inputedPaths.map((inputedPath) => inputedPath.path);
            const _inputValueTypeIds = inputedPaths.map((inputedPath) => inputedPath.typeId);
            const _inputValueNames = inputedPaths.map((inputedPath) => inputedPath.name);

            const workflowData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                endpointId: await encrypt(endpointId),
                image: await encrypt(workflowImage),
                workflow: await encrypt(workflow),
                version: await encrypt(version),
                price: await encrypt(price),
                gpuUsage: await encrypt(gPURequirement),
                description: await encrypt(description),
                inputValuePaths: _inputValuePaths,
                inputValueTypeIds: _inputValueTypeIds,
                inputValueNames: _inputValueNames,
            };

            try {
                const response = await fetch(`workflow/uploadworkflow`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(workflowData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                    navigate('/');
                }
                else {
                    const _newToken = await decrypt(data.token);
                    saveToken(_newToken);
                    navigate('/preview-workflow');
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                navigate('/');
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            navigate('/login');
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <input
                type='file'
                accept="image/*"
                onChange={onImageChange}
                ref={imageInputRef}
                style={{ display: 'none' }}
            />
            <input
                type='file'
                accept=".json"
                onChange={onWorkflowChange}
                ref={workflowInputRef}
                style={{ display: 'none' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '1000px', alignItems: 'center', marginTop: '70px', marginBottom: '100px' }}>
                    <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', width: '1000px' }}>
                        <div style={{ fontSize: '30px', color: lightMode ? '#1f2f2f' : '#dfefef', cursor: 'pointer' }}
                            onClick={handleEndpointTitle}
                        >{endpointTitle}</div>
                        <div style={{ fontSize: '30px', color: lightMode ? '#1f2f2f' : '#dfefef', cursor: 'pointer' }}>
                            &nbsp;&nbsp;{'/ ' + version}</div>
                    </div>
                    <div style={{ cursor: 'pointer', width: '900px', marginTop: '30px' }} onClick={onUploadImage}>
                        {workflowImage ?
                            <img src={workflowImage} alt="WorkflowImage" style={{ width: '900px', height: '675px', borderRadius: '30px' }} />
                            :
                            <div style={{
                                width: '900px', height: '675px',
                                borderRadius: '30px', border: `1px solid ${imageError ? '#ff0000' : '#7f8f8f'}`, display: 'flex', flexDirection: 'row',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <UploadIcon width='50px' height='50px' />
                                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', }}>
                                    &nbsp;Upload Image
                                </div>
                            </div>}
                    </div>
                    <MyTextField
                        required
                        name='Version'
                        id='version'
                        value={version}
                        style={{ marginTop: '30px', width: '900px' }}
                        error={versionError}
                        onChange={handleVersionChange}
                    />
                    <MyTextField
                        required
                        name='Price [$]'
                        type='number'
                        id='price'
                        style={{ marginTop: '10px', width: '900px' }}
                        error={priceError}
                        onChange={handlePriceChange}
                    />
                    <MyTextField
                        required
                        name='GPU usage amount [GB]'
                        type='number'
                        id='gPURequirement'
                        style={{ marginTop: '10px', width: '900px' }}
                        error={gPURequirementError}
                        onChange={handleGPURequirementChange}
                    />
                    <MyMultilineTextField
                        required
                        rows='3'
                        style={{ marginTop: '10px', width: '900px' }}
                        onChange={handleDescriptionChange}
                    />
                    <div className={lightMode ? 'workflow-button-light' : 'workflow-button-dark'} style={{ width: '900px' }}
                        onClick={onUploadWorkflow}>
                        {workflowPath ? workflowPath : 'Upload workflow'}
                    </div>
                    <div style={{
                        width: '900px', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', pointerEvents: workflowPath === '' ? 'none' : 'auto'
                    }}>
                        <div style={{ fontSize: '20px', color: lightMode ? '#1f2f2f' : '#dfefef', width: '900px', marginTop: '20px' }}>Input Values</div>
                        <div style={{
                            fontSize: '20px', color: lightMode ? '#1f2f2f' : '#dfefef', width: '900px', height: '2px',
                            marginTop: '5px', backgroundColor: lightMode ? '#1f2f2f' : '#dfefef'
                        }} />
                        {inputedPaths.map((inputedPath, index) => (
                            <div key={index} style={{ display: 'flex', flexDirection: 'row', width: '900px' }} >
                                <ColumnBox fontSize='20px' style={{ width: '500px', marginTop: '5px' }} items={inputPaths}
                                    placeholder='Input path of value here...' pickerWidth='470px'
                                    setSelectedItem={(item) => {
                                        const newPaths = [...inputedPaths];
                                        newPaths[index] = {
                                            ...newPaths[index],
                                            path: item.name,
                                        }
                                        setInputedPaths(newPaths);
                                    }} />
                                <ColumnBox fontSize='20px' style={{ width: '190px', marginTop: '5px', marginLeft: '10px' }} items={valueTypes}
                                    placeholder='Value type...' pickerWidth='173px'
                                    setSelectedItem={(item) => {
                                        const newPaths = [...inputedPaths];
                                        newPaths[index] = {
                                            ...newPaths[index],
                                            type: item.name,
                                            typeId: item.id,
                                        }
                                        setInputedPaths(newPaths);
                                    }} />
                                <MyTextField
                                    required
                                    style={{ marginTop: '5px', width: '190px', marginLeft: '10px' }}
                                    placeholder='Name'
                                    onChange={(e) => {
                                        const newPaths = [...inputedPaths];
                                        newPaths[index] = {
                                            ...newPaths[index],
                                            name: e.target.value,
                                        }
                                        setInputedPaths(newPaths);
                                    }}
                                />
                            </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '900px' }} >
                            <div className={lightMode ? 'workflow-button-light' : 'workflow-button-dark'}
                                style={{ width: '50px', borderRadius: '50%', display: 'flex', flexDirection: 'row', marginTop: '10px' }}
                                onClick={() => {
                                    setInputedPaths([...inputedPaths, {}]);
                                }}>
                                <AddValueTypeIcon width='40px' height='40px' />
                            </div>
                        </div>
                        <div style={{ fontSize: '20px', color: lightMode ? '#1f2f2f' : '#dfefef', width: '900px', marginTop: '20px' }}>Output Values</div>
                        <div style={{
                            fontSize: '20px', color: lightMode ? '#1f2f2f' : '#dfefef', width: '900px', height: '2px',
                            marginTop: '5px', backgroundColor: lightMode ? '#1f2f2f' : '#dfefef'
                        }} />
                    </div>
                    <div className={lightMode ? 'workflow-button-light' : 'workflow-button-dark'} style={{ width: '300px' }}
                        onClick={handleSubmitWorkflow}>
                        Submit Workflow
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
}

export default UploadWorkflow;