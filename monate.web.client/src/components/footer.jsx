import { MonateIcon, GithubIcon, PhoneIcon, EmailIcon, CopyrightIcon } from './svg-icons';
import { useLightMode } from '../globals/interface';

const Footer = () => {
    const lightMode = useLightMode();

    return (
        <div style={{
            width: '100%', height: '35vh', marginTop: '10vh', backgroundColor: lightMode ? '#efffff' : '#0f1f1f',
            display: 'flex', flexDirection: 'column'
        }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div style={{
                    width: '40%', marginLeft: '10%', marginTop: '8vh', color: lightMode ? '#1f2f2f' : '#dfefef',
                    display: 'flex', flexDirection: 'row', justifyContent: 'center'
                }}>
                    <MonateIcon height='8vh' width='8vh' />
                    <div style={{ marginLeft: '1vh', fontSize: '6.8vh' }}>
                        ONATE
                    </div>
                </div>
                <div style={{
                    width: '30%', marginTop: '5vh', color: lightMode ? '#1f2f2f' : '#dfefef',
                    display: 'flex', flexDirection: 'column',
                }}>
                    <div style={{ marginLeft: '1vh', fontSize: '4vh', }}>
                        Contact us
                    </div>
                    <div style={{ marginLeft: '1vh', marginTop: '3vh', fontSize: '2.5vh', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                       <PhoneIcon height='3vh' width='3vh' />&nbsp;+1(201) 620-3178
                    </div>
                    <div style={{ marginLeft: '1vh', marginTop: '1vh', fontSize: '2.5vh', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                        <EmailIcon height='3vh' width='3vh' />&nbsp;monate615@gmail.com
                    </div>
                    <div style={{ marginLeft: '1vh', marginTop: '1vh', fontSize: '2.5vh', display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                        <GithubIcon height='3vh' width='3vh' />&nbsp;github.com/monate0615
                    </div>
                </div>
            </div>
            <div style={{ backgroundColor: lightMode ? '#1f2f2f' : '#dfefef', borderRadius: '50%', height: '3px', marginTop: '5vh' }} />
            <div style={{
                textAlign: 'center', marginTop: '1.5vh', color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '1.8vh',
                display: 'flex', flexDirection: 'row', justifyContent: 'center',
            }}>
                <CopyrightIcon height='2vh' width='2vh' />&nbsp;2024 Copyright by MONATE. All rights reserved.
            </div>
        </div>
    )
}

export default Footer;