import { useState } from 'react';
import Button from '@mui/material/Button';
import { MyTextField } from './my-controls';
import { useAlert } from './alerts';
import {
    useLightMode,
    useEmail,
    useRegion,
    useToken, useSaveToken,
    useSaveStateAddr,
    useSaveFirstName,
    useSaveLastName,
} from '../globals/interface';
import useCryptionHelper from '../../helpers/cryption-helper';

const LocationInfoControl = (props) => {
    const { editMode, onSuccess } = props;

    const { encrypt, decrypt } = useCryptionHelper();

    const region = useRegion();
    const email = useEmail();
    const token = useToken();
    const saveToken = useSaveToken();
    const saveStateAddr = useSaveStateAddr();
    const saveFirstName = useSaveFirstName();
    const saveLastName = useSaveLastName();

    const { showAlert } = useAlert();
    const lightMode = useLightMode();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [address1Error, setAddress1Error] = useState('');
    const [cityError, setCityError] = useState('');
    const [stateError, setStateError] = useState('');
    const [zipCodeError, setZipCodeError] = useState('');

    const firstNameChanged = (e) => {
        setFirstName(e.target.value);
    }

    const lastNameChanged = (e) => {
        setLastName(e.target.value);
    }

    const address1Changed = (e) => {
        setAddress1(e.target.value);
    }

    const address2Changed = (e) => {
        setAddress2(e.target.value);
    }

    const cityChanged = (e) => {
        setCity(e.target.value);
    }

    const stateChanged = (e) => {
        setState(e.target.value);
    }

    const zipCodeChanged = (e) => {
        setZipCode(e.target.value);
    }

    const handleNext = async() => {
        if (!firstName) {
            setFirstNameError('Fist name must be input.');
            return;
        }
        else setFirstNameError('');
        if (!lastName) {
            setLastNameError('Last name must be input.');
            return;
        }
        else setLastNameError('');
        if (!address1) {
            setAddress1Error('Address line 1 must be input.');
            return;
        }
        else setAddress1Error('');
        if (!city) {
            setCityError('City must be input.');
            return;
        }
        else setCityError('');
        if (!state) {
            setStateError('State must be input.');
            return;
        }
        else setStateError('');
        if (!zipCode) {
            setZipCodeError('Zip code must be input.');
            return;
        }
        else setZipCodeError('');

        const locationData = {
            email: await encrypt(email.toLowerCase()),
            token: await encrypt(token),
            firstName: await encrypt(firstName),
            lastName: await encrypt(lastName),
            address1: await encrypt(address1),
            address2: await encrypt(address2),
            city: await encrypt(city),
            state: await encrypt(state),
            zipCode: await encrypt(zipCode),
            country: await encrypt(region),
        }

        try {
            const response = await fetch(`user/savelocation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(locationData),
            });
            const data = await response.json();

            if (!response.ok) {
                showAlert({ severity: 'error', message: data.message });
                return;
            }
            else {
                const newToken = await decrypt(data.token);
                saveToken(newToken);
                saveFirstName(firstName);
                saveLastName(lastName);
                saveStateAddr(state);
                showAlert({ severity: 'success', message: 'Saved location successfully.' });
                onSuccess(data.state);
            }
        } catch (error) {
            showAlert({ severity: 'error', message: 'Could not found server.' });
        }
    }

    return (
        <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(8vh - 12px)', }}>
                <MyTextField
                    required
                    disabled={editMode}
                    error={firstNameError}
                    name='First Name'
                    id='first-name'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={firstNameChanged}
                />
                <MyTextField
                    required
                    disabled={editMode}
                    error={lastNameError}
                    name='Last Name'
                    id='last-name'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    onChange={lastNameChanged}
                />
            </div>
            <MyTextField
                required
                error={address1Error}
                name='Address Line 1'
                id='address-line-1'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                onChange={address1Changed}
            />
            <MyTextField
                name='Address Line 2'
                id='address-line-2'
                style={{ marginTop: 'calc(3vh - 12px)', width: '30vw' }}
                onChange={address2Changed}
            />
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    error={cityError}
                    name='City'
                    id='city'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={cityChanged}
                />
                <MyTextField
                    required
                    error={stateError}
                    name='State'
                    id='state'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                    onChange={stateChanged}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: 'calc(3vh - 12px)', }}>
                <MyTextField
                    required
                    error={zipCodeError}
                    name='Zip / Postal Code'
                    id='zip-code'
                    style={{ width: 'calc(15vw - 10px)' }}
                    onChange={zipCodeChanged}
                />
                <MyTextField
                    required
                    disabled
                    value={region ? region : ''}
                    name='Country'
                    id='country'
                    style={{ marginLeft: '20px', width: 'calc(15vw - 10px)' }}
                />
            </div>
            <Button
                varient='contained'
                onClick={handleNext}
                style={{
                    marginTop: '6vh', width: '17vw', height: '5vh', fontSize: '3vh',
                    color: lightMode ? '#cfdfdf' : '#1f2f2f', backgroundColor: lightMode ? '#3f4f4f' : '#afbfbf'
                }}
            >Next</Button>
        </form>
    )
};

export default LocationInfoControl;