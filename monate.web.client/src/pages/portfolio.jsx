import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import { useAlert } from '../components/alerts';
import { MyTextField } from '../components/my-controls';
import { UploadIcon, LinkIcon } from '../components/svg-icons';
import ItemPicker from '../components/item-picker';
import {
    useLightMode,
    useToken, useSaveToken,
    useEmail,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';

import './portfolio.css';

const Portfolio = (props) => {
    const lightMode = useLightMode();
    const token = useToken();
    const email = useEmail();
    const saveToken = useSaveToken();

    const navigate = useNavigate();

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [url, setUrl] = useState('');
    const [urlError, setUrlError] = useState('');
    const [image, setImage] = useState('');
    const [imageError, setImageError] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState([]);

    const imageInputRef = useRef();

    const onTitleChange = (e) => {
        setTitle(e.target.value);
    }
    const onUrlchange = (e) => {
        setUrl(e.target.value);
    }

    const onUploadImage = () => {
        imageInputRef.current.click();
    }
    const onImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    useEffect(() => {
        const redirect = () => {
            navigate('/');
        };
        const validateToken = async () => {
            if (email && token) {
                const tokenData = {
                    email: await encrypt(email.toLowerCase()),
                    token: await encrypt(token),
                };
                try {
                    const response = await fetch(`user/getusertype`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(tokenData),
                    });
                    const data = await response.json();

                    if (!response.ok) {
                        showAlert({ severity: 'error', message: data.message });
                        redirect();
                    }
                    else {
                        const _userType = await decrypt(data.userType);
                        if (_userType !== 'administrator') {
                            showAlert({ severity: 'error', message: 'You are not administrator.' });
                            redirect();
                        }
                    }
                } catch (error) {
                    showAlert({ severity: 'error', message: 'Could not found server.' });
                    redirect();
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
                redirect();
            }
        }
        validateToken();
        getCategories();
    }, []);

    const redirect = () => {
        var finalUrl = url;
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'http://' + finalUrl;
        }
        window.open(finalUrl, '_blank');
    }

    const onUploadPortfolio = async () => {
        const validate = async() => {
            var validation = true;
            if (!title) {
                setTitleError('The title must be valid');
                validation = false;
            }
            else {
                setTitleError('');
            }
            if (!url) {
                setUrlError('The url must be valid');
                validation = false;
            }
            else {
                setUrlError('');
            }
            if (!image) {
                setImageError(true);
                validation = false;
            }
            else {
                setImageError('');
            }

            //if (validation) {
            //    try {
            //        let finalUrl = url;

            //        if (!/^https?:\/\//i.test(finalUrl)) {
            //            finalUrl = 'http://' + finalUrl;
            //        }

            //        const response = await fetch(finalUrl, { method: 'HEAD' });

            //        if (response.ok) {
            //            setUrlError('');
            //        } else {
            //            setUrlError('Url does not exist');
            //            validation = false;
            //        }
            //    } catch (err) {
            //        setUrlError('Url does not exist');
            //        validation = false;
            //    }
            //}

            return validation;
        }

        const validated = await validate();
        if (!validated)
            return;

        if (email && token) {
            const categoryIds = selectedCategories.map(category => category.id);
            const portfolioData = {
                email: await encrypt(email.toLowerCase()),
                token: await encrypt(token),
                title: await encrypt(title),
                url: await encrypt(url),
                image: await encrypt(image),
                categoryIds: categoryIds
            };
            try {
                const response = await fetch(`portfolio/uploadportfolio`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(portfolioData),
                });
                const data = await response.json();

                if (!response.ok) {
                    showAlert({ severity: 'error', message: data.message });
                }
                else {
                    const newToken = await decrypt(data.token);
                    saveToken(newToken);
                    showAlert({ severity: 'success', message: 'Successfully uploaded portfolio.' });
                    navigate('/');
                }
            } catch (error) {
                showAlert({ severity: 'error', message: 'Could not found server.' });
            }
        }
        else {
            showAlert({ severity: 'error', message: 'You are not logged in now. Please log in.' });
            navigate('/login');
        }
    }

    return (
        <div className={lightMode ? 'body-light' : 'body-dark'}>
            <div style={{
                display: 'flex', flexDirection: 'row', width: '100%', height: '100vh',
                backgroundColor: lightMode ? '#cfdfdf' : '#0f1f1f'
            }}>
                <div style={{
                    width: '50%', display: 'flex', flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'center', marginLeft: '5vw'
                }}>
                    <div style={{
                        width: '80%', height: '80%', borderRadius: '10%', backgroundColor: '#ffffff22',
                        marginTop: '10vh', display: 'flex', flexDirection: 'column', alignItems: 'center'
                    }}>
                        <input
                            type='file'
                            accept="image/*"
                            onChange={onImageChange}
                            ref={imageInputRef}
                            style={{ display: 'none' }}
                        />
                        <div style={{
                            fontSize: '6vh', height: '10%', marginTop: '5%', color: lightMode ? '#1f2f2f' : '#dfefef', width: '100%',
                            display: 'flex', flexDirection: 'row',
                            justifyContent: 'center', alignItems: 'center'
                        }}>
                            Upload Portfolio
                        </div>
                        <MyTextField
                            required
                            name='Title'
                            error={titleError}
                            id='portfolio-title'
                            style={{ marginTop: '3%', width: '70%' }}
                            onChange={onTitleChange}
                        />
                        <MyTextField
                            required
                            name='Url'
                            error={urlError}
                            id='portfolio-url'
                            style={{ marginTop: '3%', width: '70%' }}
                            onChange={onUrlchange}
                        />
                        <ItemPicker
                            style={{ width: '68%', marginTop: '3%' }}
                            selectedItems={selectedCategories}
                            setSelectedItems={setSelectedCategories}
                            items={categories}
                            placeholder='Enter category here...'
                        />
                        <div style={{ cursor: 'pointer', }} onClick={onUploadImage}>
                            {image ?
                                <img src={image} alt='preview' style={{
                                    width: '28vw', height: '35vh', marginTop: '5%',
                                    borderRadius: '5%'
                                }} /> :
                                <div style={{
                                    width: '28vw', height: '35vh', marginTop: '5%',
                                    borderRadius: '5%', border: `1px solid ${imageError ? '#ff0000' : '#7f8f8f'}`, display: 'flex', flexDirection: 'row',
                                    justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <UploadIcon width='5vh' height='5vh' />
                                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2.5vh', }}>
                                        &nbsp;Upload Image
                                    </div>
                                </div>}
                        </div>
                    </div>
                </div>
                <div style={{ width: '40%' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '430px', marginLeft: '1%', marginRight: '1%',
                        marginTop: '15vh', height: '370px', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
                    }}>
                        {image ?
                            <img src={image} alt='preview' style={{
                                width: '90%', height: '60%', marginTop: '5%', marginLeft: '5%',
                                borderRadius: '5%'
                            }} /> :
                            <div style={{
                                width: '90%', height: '60%', marginTop: '5%',
                                borderRadius: '5%', border: `1px solid #7f8f8f`, display: 'flex', flexDirection: 'row', marginLeft: '5%',
                                justifyContent: 'center', alignItems: 'center'
                            }}>
                                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '2.5vh' }}>
                                    None
                                </div>
                            </div>}
                        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '5%', width: '90%' }} >
                            <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', height: '30px', marginTop: '3%' }}>
                                {title}
                            </div>
                            <div style={{
                                color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '20px', marginTop: '2%',
                                display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer'
                            }} onClick={redirect}>
                                <LinkIcon width='25px' height='25px' />&nbsp;{url}
                            </div>
                            <div style={{
                                color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '15px', marginTop: '2%',
                                display: 'flex', flexDirection: 'row', alignItems: 'center'
                            }}>
                                {selectedCategories.map((category, index) => (
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
                    <div style={{ width: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className={lightMode ? 'portfolio-button-light' : 'portfolio-button-dark'} onClick={onUploadPortfolio}>
                            Upload
                        </div>
                    </div>
                </div>
            </div>
            <Header />
        </div>
    );
}

export default Portfolio;