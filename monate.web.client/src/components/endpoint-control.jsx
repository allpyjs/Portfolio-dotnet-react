import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from './alerts';
import { EmailIcon, NextIcon, BackIcon } from './svg-icons';
import { MyTextField } from './my-controls';
import {
    useLightMode,
    useEmail,
    useToken,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './endpoint-control.css';

const EndpointElement = ({ id }) => {
    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();

    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const [title, setTitle] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userAvatar, setUserAvatar] = useState('');
    const [categories, setCategories] = useState([]);
    const [endpointImage, setEndpointImage] = useState('');
    const [userType, setUserType] = useState('');

    useEffect(() => {
        const getEndpoint = async () => {
            if (email && token) {
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
                    }
                    else {
                        const _title = await decrypt(data.title);
                        const _userName = await decrypt(data.userName);
                        const _userEmail = await decrypt(data.userEmail);
                        const _userAvatar = await decrypt(data.userAvatar);
                        const _endpointImage = await decrypt(data.imageData);
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
                        setCategories(data.categories);
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        getEndpoint();
    }, []);

    const onEndpoint = async () => {
        navigate(`/get-endpoint?id=${id}`);
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '430px', marginLeft: '1%', marginRight: '1%',
            marginTop: '20px', height: '500px', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
            alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
        }} onClick={onEndpoint}>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
                    {userType === "Administrator" &&
                        <div style={{
                            marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'orange',
                            height: '15px', marginTop: '20px', fontSize: '14px', padding: '4px', borderRadius: '3px'
                        }}>
                            Administrator
                        </div>}
                    {!userType &&
                        <div style={{
                            marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'transparent',
                            height: '15px', marginTop: '20px', fontSize: '14px', padding: '4px', borderRadius: '3px'
                        }}>
                        </div>}
                    {userType === "MONATE" &&
                        <div style={{
                            marginLeft: '15px', fontWeight: 'bold', color: 'blue', backgroundColor: 'greenyellow',
                            height: '15px', marginTop: '20px', fontSize: '14px', padding: '4px', borderRadius: '3px'
                        }}>
                            MONATE
                        </div>}
                </div>
                {endpointImage ?
                    <img
                        src={endpointImage}
                        alt='EndpointImage'
                        style={{ width: '400px', height: '300px', borderRadius: '20px', marginTop: '10px', }}
                    /> :
                    <div
                        style={{ width: '400px', height: '300px', borderRadius: '20px', marginTop: '10px' }}
                    />
                }
            </div>
            <div style={{ width: '100%', marginBottom: '10px', marginTop: '10px' }}>
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ fontSize: '30px', color: lightMode ? '#1f2f2f' : '#dfefef', height: '30px' }}>
                        {title}
                    </div>
                </div>
                <div style={{ marginLeft: '15px', marginTop: '15px', display: 'flex', flexDirection: 'row' }}>
                    {userAvatar ?
                        <img
                            src={userAvatar}
                            alt='UserAvatar'
                            style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid #28c' }}
                        /> :
                        <div
                            style={{
                                backgroundColor: 'deeppink', width: '18px', height: '18px',
                                borderRadius: '50%', border: '1px solid #28c', objectFit: 'cover',
                                textAlign: 'center', fontSize: '17px', color: 'white'
                            }}
                        >
                            {userName && userName[0].toUpperCase()}
                        </div>
                    }
                    <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                        {userName}
                    </div>
                </div>
                <div style={{ marginLeft: '15px', marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                    <EmailIcon width='20px' height='20px' />
                    <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                        {userEmail}
                    </div>
                </div>
                <div style={{
                    marginLeft: '15px', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '15px', marginTop: '10px',
                    display: 'flex', flexDirection: 'row', alignItems: 'center'
                }}>
                    {categories.map((category, index) => (
                        <div key={index} style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            backgroundColor: '#7f8f8f', color: lightMode ? '#1f2f2f' : '#dfefef',
                            borderRadius: '4px', padding: '2px', marginRight: '6px'
                        }}>
                            &nbsp;&nbsp;{category.name}&nbsp;&nbsp;
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const EndpointControl = (props) => {
    const { user } = props;

    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();

    const navigate = useNavigate();
    const { showAlert } = useAlert();
    const { encrypt, decrypt } = useCryptionHelper();

    const [endpointIds, setEndpointIds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const timerRef = useRef(null);

    const getEndpoints = async () => {
        if (email && token) {
            const pageData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                page: await encrypt(`${currentPage - 1}`),
                query: await encrypt(searchQuery),
            };
            try {
                const response = await fetch(user ? `endpoint/getendpointsbyuser` : `endpoint/getendpoints`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(pageData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                }
                else {
                    const endpointIdsStr = await decrypt(data.endpointIds);
                    const maxPageStr = await decrypt(data.maxPage);
                    setMaxPage(parseInt(maxPageStr))
                    setEndpointIds(endpointIdsStr === '' ? [] : endpointIdsStr.split(' '));
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
        }
        else if (user) {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            navigate('/login');
        }
    };

    const handleQueueChange = (e) => {
        const value = e.target.value;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            setSearchQuery(value);
            setCurrentPage(1);
        }, 500);
    };

    const onBeforePage = async () => {
        const page = currentPage > 1 ? currentPage - 1 : currentPage;
        setCurrentPage(page);
    };

    const onNextPage = async () => {
        const page = currentPage < maxPage ? currentPage + 1 : currentPage;
        setCurrentPage(page);
    };

    const onUploadEndpoint = async () => {
        navigate(`/upload-endpoint`);
    };

    useEffect(() => {
        getEndpoints();
    }, [currentPage, searchQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center' }} >
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', alignItems: 'center', justifyContent: 'center' }}>
                <MyTextField
                    placeholder='Search...'
                    id='portfolio-title'
                    style={{
                        marginTop: user ? '1.5%' : '3%', width: '20vw'
                    }}
                    onChange={handleQueueChange}
                />
                <div disabled={currentPage === 1} className={lightMode ?
                    (currentPage === 1 ? 'page-button-light-disabled' : 'page-button-light') :
                    (currentPage === 1 ? 'page-button-dark-disabled' : 'page-button-dark-disabled')}
                    style={{
                        height: '50px', width: '50px', borderRadius: '50%', marginTop: '0.8vw', marginLeft: '5vw',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }} onClick={onBeforePage}><BackIcon width='35px' height='35px' disabled={currentPage === 1} marginLeft='-5px' /></div>
                <div style={{
                    height: '50px', width: '100px', borderRadius: '50%', marginTop: '0.8vw', marginLeft: '0.2vw', fontSize: '35px',
                    color: lightMode ? '#1f2f2f' : '#dfefef', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>{currentPage}</div>
                <div disabled={currentPage === maxPage} className={lightMode ?
                    (currentPage === maxPage ? 'page-button-light-disabled' : 'page-button-light') :
                    (currentPage === maxPage ? 'page-button-dark-disabled' : 'page-button-dark-disabled')}
                    style={{
                        height: '50px', width: '50px', borderRadius: '50%', marginTop: '0.8vw', marginLeft: '0.2vw',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }} onClick={onNextPage}><NextIcon width='35px' height='35px' disabled={currentPage === maxPage} marginLeft='5px' /></div>
                {user && <div className={lightMode ? 'page-button-light' : 'page-button-dark'}
                    style={{
                        height: '50px', width: '300px', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', marginTop: '0.8vw', marginLeft: '5vw',
                        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: '15px',
                    }} onClick={onUploadEndpoint}>Upload Endpoint</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                {endpointIds.map((endpointId, index) => (
                    <EndpointElement key={index} id={endpointId} />
                ))}
            </div>
        </div>
    );
}

export default EndpointControl;