import { useEffect, useState, useRef } from 'react';
import { useAlert } from './alerts';
import { LocationIcon, GithubIcon, PhoneIcon, NextIcon, BackIcon } from './svg-icons';
import { MyTextField } from './my-controls';
import {
    useLightMode,
    useEmail,
    useToken,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';
import './user-control.css';

const UserElement = ({ id }) => {
    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [state, setState] = useState('');
    const [region, setRegion] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [avatar, setAvatar] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [userType, setUserType] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const upperRef = useRef(null);
    const lowerRef = useRef(null);
    const [spaceBetween, setSpaceBetween] = useState(0);

    useEffect(() => {
        if (upperRef.current && lowerRef.current) {
            const upperRect = upperRef.current.getBoundingClientRect();
            const lowerRect = lowerRef.current.getBoundingClientRect();
            const heightBetween = lowerRect.top - upperRect.bottom;
            setSpaceBetween(heightBetween);
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            if (email && token) {
                const userData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                    id: await encrypt(id),
                };
                try {
                    const response = await fetch(`user/getuser`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                    }
                    else {
                        const _firstName = await decrypt(data.firstName);
                        const _lastName = await decrypt(data.lastName);
                        const _state = await decrypt(data.state);
                        const _region = await decrypt(data.region);
                        const _title = await decrypt(data.title);
                        const _description = await decrypt(data.description);
                        const _avatar = await decrypt(data.avatar);
                        const _githubUrl = await decrypt(data.githubUrl);
                        const _userType = await decrypt(data.userType);
                        const _phoneNumber = await decrypt(data.phoneNumber);

                        setFirstName(_firstName);
                        setLastName(_lastName);
                        setState(_state);
                        setRegion(_region);
                        setTitle(_title);
                        setDescription(_description);
                        setAvatar(_avatar);
                        setGithubUrl(_githubUrl);
                        setPhoneNumber(_phoneNumber);
                        if (_userType === '0')
                            setUserType('Administrator');
                        if (_userType === '1')
                            setUserType('');
                        if (_userType === '2')
                            setUserType('MONATE');
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                }
            }
        };
        getUser();
    }, []);

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '430px', marginLeft: '1%', marginRight: '1%',
            marginTop: '20px', height: '500px', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
            alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div ref={upperRef} style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                {avatar ?
                    <img
                        src={avatar}
                        alt='Avatar'
                        style={{ width: '100px', height: '100px', borderRadius: '50%', border: '1px solid #28c', marginTop: '30px', }}
                    /> :
                    <div
                        style={{
                            backgroundColor: 'deeppink', width: '100px', height: '100px',
                            borderRadius: '50%', border: '1px solid #28c', objectFit: 'cover',
                            textAlign: 'center', fontSize: '85px', color: 'white', marginTop: '30px',
                        }}
                    >
                        {firstName && firstName[0].toUpperCase()}
                    </div>
                }
                <div style={{ marginTop: '15px', marginLeft: '10px', marginRight: '10px', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '40px', textAlign: 'center' }}>
                    {firstName + ' ' + lastName}
                </div>
                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '20px', textAlign: 'center' }}>
                    {`(${title})`}
                </div>
            </div>
            <div style={{
                marginTop: '20px', marginBottom: '20px', height: `${spaceBetween}px`, width: '85%', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '15px',
                overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
                {description}
            </div>
            <div ref={lowerRef} style={{ width: '85%', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <LocationIcon width='20px' height='20px' />
                    <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                        {`${state}, ${region}`}
                    </div>
                </div>
                {githubUrl &&
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                        <GithubIcon width='20px' height='20px' />
                        <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                            {`${githubUrl}`}
                        </div>
                    </div>}
                {phoneNumber &&
                    <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'row' }}>
                        <PhoneIcon width='20px' height='20px' />
                        <div style={{ marginLeft: '2%', color: lightMode ? '#1f2f2f' : '#dfefef' }}>
                            {`${phoneNumber}`}
                        </div>
                    </div>}
            </div>
        </div>
    );
}

const UserControl = (props) => {
    const lightMode = useLightMode();
    const email = useEmail();
    const token = useToken();

    const [userIds, setUserIds] = useState([]);
    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const timerRef = useRef(null);

    const getUsers = async () => {
        if (email && token) {
            const pageData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                page: await encrypt(`${currentPage - 1}`),
                query: await encrypt(searchQuery),
            };
            try {
                const response = await fetch(`user/getusers`, {
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
                    const userIdsStr = await decrypt(data.userIds);
                    const maxPageStr = await decrypt(data.maxPage);
                    setMaxPage(parseInt(maxPageStr))
                    setUserIds(userIdsStr === '' ? [] : userIdsStr.split(' '));
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
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

    useEffect(() => {
        getUsers();
    }, [currentPage, searchQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center' }} >
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', alignItems: 'center', justifyContent: 'center' }}>
                <MyTextField
                    placeholder='Search...'
                    id='portfolio-title'
                    style={{ marginTop: '3%', width: '20vw' }}
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
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', flexWrap: 'wrap', width: '100%', justifyContent: 'center' }}>
                {userIds.map((userId, index) => (
                    <UserElement key={index} id={userId} />
                ))}
            </div>
        </div>
    );
}

export default UserControl;