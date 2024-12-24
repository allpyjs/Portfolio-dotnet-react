import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Header from '../components/header';
import { useAlert } from '../components/alerts';
import { AddIcon, UploadIcon } from '../components/svg-icons';
import ItemPicker from '../components/item-picker';
import {
    useLightMode,
    useEmail,
    useToken
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './get-endpoint.css';

const GetEndpoint = (props) => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');

    const { encrypt, decrypt } = useCryptionHelper();
    const { showAlert } = useAlert();
    const navigate = useNavigate();

    const email = useEmail();
    const token = useToken();
    const lightMode = useLightMode();

    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [endpointImage, setEndpointImage] = useState('');
    const [description, setDescription] = useState('');
    const [userType, setUserType] = useState('');
    const [workflows, setWorkflows] = useState([]);
    const [isPreview, setIsPreview] = useState(true);
    const [permition, setPermition] = useState(1);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);
    const [imageError, setImageError] = useState(false);

    const imageInputRef = useRef();

    const onUploadImage = () => {
        imageInputRef.current.click();
    }
    const onImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setEndpointImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        const getEndpoint = async () => {
            if (email && token && id) {
                const endpointData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                    id: await encrypt(id),
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
                        const _userName = await decrypt(data.userName);
                        const _userEmail = await decrypt(data.userEmail);
                        const _userAvatar = await decrypt(data.userAvatar);
                        const _endpointImage = await decrypt(data.imageData);
                        const _description = await decrypt(data.description);
                        const _userType = await decrypt(data.userType);

                        setTitle(_title);
                        setUserName(_userName);
                        setUserEmail(_userEmail);
                        setUserAvatar(_userAvatar);
                        if (_userType === 'administrator') {
                            setUserType("Administrator")
                        }
                        else if (_userType === "team") {
                            setUserType("MONATE");
                        }
                        setEndpointImage(_endpointImage);
                        setDescription(_description);
                        setSelectedCategories(data.categories);
                        setWorkflows(data.workflows);
                        setPermition(data.permition);

                        if (email === _userEmail)
                            setIsPreview(false);
                        else
                            setIsPreview(true);
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
        const getCategories = async () => {
            try {
                const response = await fetch(`category`, {
                    method: 'GET',
                });
                const data = await response.json();
                setCategories(data.categories);
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
                navigate('/');
            }
        }
        getEndpoint();
        getCategories();
    }, []);

    const handleTitleChange = (e) => {
        const _title = e.target.value;
        setTitle(_title);
    }

    const handleDescriptionChange = (e) => {
        const _description = e.target.value;
        setDescription(_description);
    }

    const handleUploadWorkflow = () => {
        navigate(`/upload-workflow?endpointId=${id}`)
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
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '70px', alignItems: 'center' }}>
                <div style={{ position: 'absolute', top: '100px', left: '100px', color: 'red' }}>
                    {permition === 0 && 'Pending now'}
                    {permition === 2 && 'Suspended'}
                </div>
                <div style={{ width: '1400px', display: 'flex', flexDirection: 'column', marginTop: '30px', alignItems: 'center' }}>
                    {isPreview ? <div style={{ fontSize: '50px', color: lightMode ? '#1f2f2f' : '#dfefef' }}>{title}</div> :
                        <TextField
                            variant="standard"
                            InputProps={{
                                disableUnderline: true,
                            }}
                            value={title}
                            onChange={handleTitleChange}
                            sx={{
                                border: 'none',
                                backgroundColor: 'transparent',
                                '& .MuiInputBase-input': {
                                    color: lightMode ? '#1f2f2f' : '#dfefef',
                                    fontSize: '50px'
                                },
                            }}
                        />}
                    <div style={{ width: '1400px', marginTop: '30px', display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '1000px', display: 'flex', flexDirection: 'column', marginBottom: '100px' }}>
                            <div disabled={isPreview} style={{ marginLeft: '50px', cursor: 'pointer', width: '900px' }} onClick={onUploadImage}>
                                {endpointImage ?
                                    <img src={endpointImage} alt="EndpointImage" style={{ width: '900px', height: '675px', borderRadius: '30px' }} />
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
                            <TextField
                                multiline
                                style={{ marginLeft: '50px', marginTop: '30px', width: '900px' }}
                                rows='4'
                                variant="standard"
                                InputProps={{
                                    disableUnderline: true,
                                }}
                                value={description}
                                onChange={handleDescriptionChange}
                                sx={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    '& .MuiInputBase-input': {
                                        color: lightMode ? '#1f2f2f' : '#dfefef',
                                        fontSize: '20px'
                                    },
                                }}
                            />
                            <ItemPicker
                                style={{ marginLeft: '50px', width: '890px', marginTop: '10px' }}
                                selectedItems={selectedCategories}
                                setSelectedItems={setSelectedCategories}
                                items={categories}
                                placeholder='Enter category here...'
                                fontSize='20px'
                            />
                        </div>
                        <div style={{ width: '400px', display: 'flex', flexDirection: 'column', marginBottom: '100px' }}>
                            <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '25px', marginBottom: '20px' }}>Workflows</div>
                            {workflows && workflows.map((workflow, index) => (
                                (!isPreview || workflow.permition === 1) && <div key={index} style={{
                                    marginBottom: '10px', width: '400px',
                                    height: '300px', borderRadius: '10px',
                                    position: 'relative', border: `4px solid #7f8f8f`,
                                    cursor: workflow.permition === 1 ? 'pointer' : 'auto',
                                    pointerEvents: workflow.permition !== 1 ? 'none' : 'auto',
                                }} onClick={() => {
                                    if (!isPreview)
                                        navigate(`/edit-workflow?id=${workflow.id}`);
                                    else
                                        navigate(`/preview-workflow?id=${workflow.id}`)
                                }}>
                                    {workflow.image && <img src={workflow.image} style={{
                                        width: '400px',
                                        height: '300px',
                                        position: 'absolute',
                                        borderRadius: '6px'
                                    }} />}
                                    {workflow.permition === 0 && <div style={{
                                        width: '400px', height: '300px', color: 'cyan',
                                        backgroundColor: '#ffaa0077', fontSize: '20px',
                                        position: 'absolute', borderRadius: '6px',
                                        justifyContent: 'center', display: 'flex', alignItems: 'center'
                                    }}>Pending now</div>}
                                    {workflow.permition === 2 && <div style={{
                                        width: '400px', height: '300px', color: 'lightgreen',
                                        backgroundColor: '#ff000077', fontSize: '20px',
                                        position: 'absolute', borderRadius: '6px',
                                        justifyContent: 'center', display: 'flex', alignItems: 'center'
                                    }}>Suspended</div>}
                                    <div style={{
                                        padding: '3px 15px', color: 'blue',
                                        backgroundColor: '#ffdd00', fontSize: '14px',
                                        position: 'absolute', borderRadius: '6px', margin: '15px',
                                        justifyContent: 'center', display: 'flex', alignItems: 'center'
                                    }}>{workflow.price === 0 ? 'Free' : `$${workflow.price}`}</div>
                                    <div style={{
                                        padding: '3px 15px', color: 'red',
                                        backgroundColor: 'cyan', fontSize: '14px',
                                        position: 'absolute', borderRadius: '6px', marginTop: '260px', marginLeft: '15px',
                                        justifyContent: 'center', display: 'flex', alignItems: 'center'
                                    }}>{workflow.version}</div>
                                </div>
                            ))}
                            {!isPreview &&
                                <div style={{
                                    width: '400px', height: '300px', borderRadius: '10px', border: `4px solid #7f8f8f`,
                                    display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'
                                }} onClick={handleUploadWorkflow}>
                                    <AddIcon width='100px' height='100px' disabled />
                                </div>}
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
}

export default GetEndpoint;