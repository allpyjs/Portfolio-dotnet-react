import {
    useState,
    useRef,
} from 'react';
import Button from '@mui/material/Button';
import { useAlert } from './alerts';
import {
    MyTextField,
    MyMultilineTextField,
} from './my-controls';
import {
    useLightMode,
    useFirstName,
    useLastName,
    useStateAddr,
    useRegion,
    useAvatar, useSaveAvatar,
    useToken, useSaveToken,
    useEmail,
    useSaveTitle,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';

const ProfileControl = (props) => {
    const { onSuccess } = props;

    const firstName = useFirstName();
    const lastName = useLastName();
    const state = useStateAddr();
    const region = useRegion();
    const avatar = useAvatar();
    const token = useToken();
    const email = useEmail();
    const saveAvatar = useSaveAvatar();
    const saveToken = useSaveToken();
    const saveTitle = useSaveTitle();

    const [newAvatar, setNewAvatar] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const fileInputRef = useRef(null);

    const { showAlert } = useAlert();

    const { encrypt, decrypt } = useCryptionHelper();

    const lightMode = useLightMode();

    const handleOpenImage = () => {
        fileInputRef.current.click();
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSave = async () => {
        if (!title) {
            setTitleError('Title must be valid.');
            return;
        }
        else setTitleError('');
        if (!description) {
            setDescriptionError('Description must be valid.');
            return;
        }
        else setDescriptionError('');

        const profileData = {
            email: await encrypt(email.toLowerCase()),
            token: await encrypt(token),
            avatar: await encrypt(newAvatar),
            title: await encrypt(title),
            description: await encrypt(description),
        };

        try {
            const response = await fetch(`user/saveprofile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });
            const data = await response.json();

            if (!response.ok) {
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                const newToken = await decrypt(data.token);
                saveToken(newToken);
                saveAvatar(newAvatar);
                saveTitle(title);

                showAlert({ severity: 'success', message: 'Saved profile successfully.' });

                onSuccess(data.state);
            }
        } catch (error) {
            showAlert({ severity: 'error', message: 'Could not found server.' });
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <input
                type='file'
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <div style={{ marginTop: 'calc(8vh - 12px)', display: 'flex', flexDirection: 'row', width: '30vw' }}>
                {(newAvatar || avatar) ?
                    <img
                        src={newAvatar ? newAvatar : avatar}
                        alt='Preview'
                        onClick={handleOpenImage}
                        style={{ width: '100px', height: '100px', borderRadius: '50px', border: '1px solid #28c' }}
                    /> :
                    <div
                        style={{ backgroundColor: 'deeppink', width: '100px', height: '100px', borderRadius: '50px', border: '1px solid #28c', objectFit: 'cover', textAlign: 'center', fontSize: '85px', color: 'white' }}
                        onClick={handleOpenImage}
                    >
                        {firstName[0].toUpperCase()}
                    </div>
                }
                <div style={{ marginLeft: '1vw' }}>
                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', marginTop: '20px', transition: '.3s' }}>
                        {firstName + ' ' + lastName}
                    </div>
                    <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '20px', marginTop: '7px', transition: '.3s' }}>
                        {state + ', ' + region}
                    </div>
                </div>
            </div>
            <MyTextField
                required
                name='Title'
                id='title'
                error={titleError}
                onChange={handleTitleChange}
                style={{ marginTop: 'calc(7vh - 12px)', width: '30vw' }}
            />
            <MyMultilineTextField
                id='address-line-2'
                error={descriptionError}
                onChange={handleDescriptionChange}
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                rows='5'
            />
            <Button
                varient='contained'
                onClick={handleSave}
                style={{
                    marginTop: '3vh', width: '17vw', height: '5vh', fontSize: '3vh',
                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                }}
            >Save</Button>
        </form>
    )
};

export default ProfileControl;