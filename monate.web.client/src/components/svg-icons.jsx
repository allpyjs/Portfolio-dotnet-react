import SvgIcon from '@mui/material/SvgIcon';
import { useLightMode } from '../globals/interface';

export const MonateIcon = ({width, height}) => {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, transient: '.3s' }}>
            <svg
                viewBox="0 0 36 36"
                xmlns="http://www.w3.org/2000/svg"
                fill="none">
                <g id="SVGRepo_iconCarrier">
                    <path fill={lightMode ? "#1f2f2f" : "#dfefef"} d="M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18S8.059 0 18 0s18 8.059 18 18z"></path>
                    <path fill={lightMode ? "#dfefef" : "#1f2f2f"} d="M8.174 9.125c.186-1.116 1.395-2.387 3.039-2.387c1.55 0 2.76 1.116 3.101 2.232l3.659 12.278h.062L21.692 8.97c.341-1.116 1.55-2.232 3.101-2.232c1.642 0 2.852 1.271 3.039 2.387l2.883 17.302c.031.186.031.372.031.526c0 1.365-.992 2.232-2.232 2.232c-1.582 0-2.201-.713-2.418-2.17l-1.83-12.619h-.062l-3.721 12.991c-.217.744-.805 1.798-2.48 1.798c-1.674 0-2.263-1.054-2.48-1.798l-3.721-12.991h-.062l-1.83 12.62c-.217 1.457-.837 2.17-2.418 2.17c-1.24 0-2.232-.867-2.232-2.232c0-.154 0-.341.031-.526L8.174 9.125z"></path>
                </g>
            </svg>
        </SvgIcon>
    )
}

export const GoogleIcon = ({width, height}) => {
    return (
        <SvgIcon style={{ width: width, height: height, transient: '.3s' }}>
            <svg
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
                    fill="#4285F4"
                />
                <path
                    d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
                    fill="#34A853"
                />
                <path
                    d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z"
                    fill="#FBBC05"
                />
                <path
                    d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z"
                    fill="#EA4335"
                />
            </svg>
        </SvgIcon>
    );
}

export function AppleIcon({ width, height }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, transient: '.3s' }}>
            <svg
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.773 22.773">
                <path fill={lightMode ? '#1f2f2f' : '#cfdfdf'} d="M15.769,0c0.053,0,0.106,0,0.162,0c0.13,1.606-0.483,2.806-1.228,3.675c-0.731,0.863-1.732,1.7-3.351,1.573 c-0.108-1.583,0.506-2.694,1.25-3.561C13.292,0.879,14.557,0.16,15.769,0z"></path>
                <path fill={lightMode ? '#1f2f2f' : '#cfdfdf'} d="M20.67,16.716c0,0.016,0,0.03,0,0.045c-0.455,1.378-1.104,2.559-1.896,3.655c-0.723,0.995-1.609,2.334-3.191,2.334 c-1.367,0-2.275-0.879-3.676-0.903c-1.482-0.024-2.297,0.735-3.652,0.926c-0.155,0-0.31,0-0.462,0 c-0.995-0.144-1.798-0.932-2.383-1.642c-1.725-2.098-3.058-4.808-3.306-8.276c0-0.34,0-0.679,0-1.019 c0.105-2.482,1.311-4.5,2.914-5.478c0.846-0.52,2.009-0.963,3.304-0.765c0.555,0.086,1.122,0.276,1.619,0.464 c0.471,0.181,1.06,0.502,1.618,0.485c0.378-0.011,0.754-0.208,1.135-0.347c1.116-0.403,2.21-0.865,3.652-0.648 c1.733,0.262,2.963,1.032,3.723,2.22c-1.466,0.933-2.625,2.339-2.427,4.74C17.818,14.688,19.086,15.964,20.67,16.716z"></path>
            </svg>
        </SvgIcon>
    );
}

export function PortfolioIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M4 5H.78c-.37 0-.74.32-.69.84l1.56 9.99S3.5 8.47 3.86 6.7c.11-.53.61-.7.98-.7H10s-.7-2.08-.77-2.31C9.11 3.25 8.89 3 8.45 3H5.14c-.36 0-.7.23-.8.64C4.25 4.04 4 5 4 5zm4.88 0h-4s.42-1 .87-1h2.13c.48 0 1 1 1 1zM2.67 16.25c-.31.47-.76.75-1.26.75h15.73c.54 0 .92-.31 1.03-.83.44-2.19 1.68-8.44 1.68-8.44.07-.5-.3-.73-.62-.73H16V5.53c0-.16-.26-.53-.66-.53h-3.76c-.52 0-.87.58-.87.58L10 7H5.59c-.32 0-.63.19-.69.5 0 0-1.59 6.7-1.72 7.33-.07.37-.22.99-.51 1.42zM15.38 7H11s.58-1 1.13-1h2.29c.71 0 .96 1 .96 1z" />
            </svg>
        </SvgIcon>
    );
}

export function UsersIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M5 9.5C5 7.01472 7.01472 5 9.5 5C11.9853 5 14 7.01472 14 9.5C14 11.9853 11.9853 14 9.5 14C7.01472 14 5 11.9853 5 9.5Z" />
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M14.3675 12.0632C14.322 12.1494 14.3413 12.2569 14.4196 12.3149C15.0012 12.7454 15.7209 13 16.5 13C18.433 13 20 11.433 20 9.5C20 7.567 18.433 6 16.5 6C15.7209 6 15.0012 6.2546 14.4196 6.68513C14.3413 6.74313 14.322 6.85058 14.3675 6.93679C14.7714 7.70219 15 8.5744 15 9.5C15 10.4256 14.7714 11.2978 14.3675 12.0632Z" />
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M4.64115 15.6993C5.87351 15.1644 7.49045 15 9.49995 15C11.5112 15 13.1293 15.1647 14.3621 15.7008C15.705 16.2847 16.5212 17.2793 16.949 18.6836C17.1495 19.3418 16.6551 20 15.9738 20H3.02801C2.34589 20 1.85045 19.3408 2.05157 18.6814C2.47994 17.2769 3.29738 16.2826 4.64115 15.6993Z" />
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M14.8185 14.0364C14.4045 14.0621 14.3802 14.6183 14.7606 14.7837V14.7837C15.803 15.237 16.5879 15.9043 17.1508 16.756C17.6127 17.4549 18.33 18 19.1677 18H20.9483C21.6555 18 22.1715 17.2973 21.9227 16.6108C21.9084 16.5713 21.8935 16.5321 21.8781 16.4932C21.5357 15.6286 20.9488 14.9921 20.0798 14.5864C19.2639 14.2055 18.2425 14.0483 17.0392 14.0008L17.0194 14H16.9997C16.2909 14 15.5506 13.9909 14.8185 14.0364Z" />
            </svg>
        </SvgIcon>
    );
}

export function WorkflowIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.566 18.566">
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M17.705,11.452h-0.73v-3.65c0.929-0.352,1.591-1.247,1.591-2.299c0-1.359-1.102-2.46-2.461-2.46
		            c-1.044,0-1.936,0.651-2.291,1.568h-1.668V4.522c0-0.475-0.384-0.86-0.859-0.86h-5.2c-0.475,0-0.859,0.386-0.859,0.86V4.61H3.566
		            V2.924c0-0.475-0.385-0.86-0.859-0.86H1.24c-0.475,0-0.859,0.385-0.859,0.86v5.199c0,0.476,0.385,0.859,0.859,0.859h1.467
		            c0.474,0,0.859-0.384,0.859-0.859V5.9h1.663v0.089c0,0.475,0.384,0.86,0.859,0.86h5.199c0.476,0,0.859-0.385,0.859-0.86V5.9h1.533
		            c0.168,1.032,0.977,1.848,2.006,2.025v3.527h-3.179c-0.475,0-0.859,0.385-0.859,0.858v0.089H9.851v-1.955
		            c0-0.474-0.386-0.859-0.86-0.859H7.524c-0.475,0-0.859,0.386-0.859,0.859v1.955H4.833c-0.284-1.046-1.237-1.815-2.372-1.815
		            C1.102,10.584,0,11.686,0,13.044c0,1.359,1.102,2.46,2.461,2.46c1.136,0,2.088-0.769,2.372-1.815h1.832v1.955
		            c0,0.476,0.385,0.859,0.859,0.859h1.467c0.474,0,0.86-0.384,0.86-0.859v-1.955h1.796v0.089c0,0.476,0.385,0.859,0.859,0.859h5.199
		            c0.476,0,0.86-0.384,0.86-0.859v-1.467C18.565,11.837,18.18,11.452,17.705,11.452z"/>
            </svg>
        </SvgIcon>
    );
}

export function AboutUsIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" >
                <path fill={lightMode ? '#000000' : '#ffffff'} d="M213.333333,3.55271368e-14 C331.154987,3.55271368e-14 426.666667,95.51168 426.666667,213.333333 C426.666667,331.153707 331.154987,426.666667 213.333333,426.666667 C95.51296,426.666667 3.55271368e-14,331.153707 3.55271368e-14,213.333333 C3.55271368e-14,95.51168 95.51296,3.55271368e-14 213.333333,3.55271368e-14 Z M234.713387,192 L192.04672,192 L192.04672,320 L234.713387,320 L234.713387,192 Z M213.55008,101.333333 C197.99616,101.333333 186.713387,112.5536 186.713387,127.704107 C186.713387,143.46752 197.698773,154.666667 213.55008,154.666667 C228.785067,154.666667 240.04672,143.46752 240.04672,128 C240.04672,112.5536 228.785067,101.333333 213.55008,101.333333 Z" />
            </svg>
        </SvgIcon>
    );
}

export function LocationIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M32,0C18.745,0,8,10.745,8,24c0,5.678,2.502,10.671,5.271,15l17.097,24.156C30.743,63.686,31.352,64,32,64
		            s1.257-0.314,1.632-0.844L50.729,39C53.375,35.438,56,29.678,56,24C56,10.745,45.255,0,32,0z M32,38c-7.732,0-14-6.268-14-14
		            s6.268-14,14-14s14,6.268,14,14S39.732,38,32,38z"/>
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M32,12c-6.627,0-12,5.373-12,12s5.373,12,12,12s12-5.373,12-12S38.627,12,32,12z M32,34
		            c-5.523,0-10-4.478-10-10s4.477-10,10-10s10,4.478,10,10S37.523,34,32,34z"/>
            </svg>
        </SvgIcon>
    );
}

export function GithubIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d = "M16 1.375c-8.282 0-14.996 6.714-14.996 14.996 0 6.585 4.245 12.18 10.148 14.195l0.106 0.031c0.75 0.141 1.025-0.322 1.025-0.721 0-0.356-0.012-1.3-0.019-2.549-4.171 0.905-5.051-2.012-5.051-2.012-0.288-0.925-0.878-1.685-1.653-2.184l-0.016-0.009c-1.358-0.93 0.105-0.911 0.105-0.911 0.987 0.139 1.814 0.718 2.289 1.53l0.008 0.015c0.554 0.995 1.6 1.657 2.801 1.657 0.576 0 1.116-0.152 1.582-0.419l-0.016 0.008c0.072-0.791 0.421-1.489 0.949-2.005l0.001-0.001c-3.33-0.375-6.831-1.665-6.831-7.41-0-0.027-0.001-0.058-0.001-0.089 0-1.521 0.587-2.905 1.547-3.938l-0.003 0.004c-0.203-0.542-0.321-1.168-0.321-1.821 0-0.777 0.166-1.516 0.465-2.182l-0.014 0.034s1.256-0.402 4.124 1.537c1.124-0.321 2.415-0.506 3.749-0.506s2.625 0.185 3.849 0.53l-0.1-0.024c2.849-1.939 4.105-1.537 4.105-1.537 0.285 0.642 0.451 1.39 0.451 2.177 0 0.642-0.11 1.258-0.313 1.83l0.012-0.038c0.953 1.032 1.538 2.416 1.538 3.937 0 0.031-0 0.061-0.001 0.091l0-0.005c0 5.761-3.505 7.029-6.842 7.398 0.632 0.647 1.022 1.532 1.022 2.509 0 0.093-0.004 0.186-0.011 0.278l0.001-0.012c0 2.007-0.019 3.619-0.019 4.106 0 0.394 0.262 0.862 1.031 0.712 6.028-2.029 10.292-7.629 10.292-14.226 0-8.272-6.706-14.977-14.977-14.977-0.006 0-0.013 0-0.019 0h0.001z" ></path>
            </svg>
        </SvgIcon>
    );
}

export function PhoneIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M2.00589 4.54166C1.905 3.11236 3.11531 2 4.54522 2H7.60606C8.34006 2 9.00207 2.44226 9.28438 3.1212L10.5643 6.19946C10.8761 6.94932 10.6548 7.81544 10.0218 8.32292L9.22394 8.96254C8.86788 9.24798 8.74683 9.74018 8.95794 10.1448C10.0429 12.2241 11.6464 13.9888 13.5964 15.2667C14.008 15.5364 14.5517 15.4291 14.8588 15.0445L15.6902 14.003C16.1966 13.3687 17.0609 13.147 17.8092 13.4594L20.8811 14.742C21.5587 15.0249 22 15.6883 22 16.4238V19.5C22 20.9329 20.8489 22.0955 19.4226 21.9941C10.3021 21.3452 2.65247 13.7017 2.00589 4.54166Z" />
            </svg>
        </SvgIcon>
    );
}

export function EmailIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 -3.5 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon-Set-Filled" transform="translate(-414.000000, -261.000000)" fill={lightMode ? '#1f2f2f' : '#dfefef'}>
                    <path d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z" />
                </g>
            </svg>
        </SvgIcon>
    );
}

export function CopyrightIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M18 0C8.059 0 0 8.06 0 18c0 9.941 8.059 18 18 18s18-8.059 18-18c0-9.94-8.059-18-18-18zm0 34C9.164 34 2 26.837 2 18C2 9.164 9.164 2 18 2c8.837 0 16 7.164 16 16c0 8.837-7.163 16-16 16z"></path>
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M18.723 6.552c2.263 0 6.666.744 6.666 3.473c0 1.116-.775 2.077-1.922 2.077c-1.272 0-2.139-1.085-4.744-1.085c-3.845 0-5.829 3.256-5.829 7.038c0 3.689 2.015 6.852 5.829 6.852c2.605 0 3.658-1.302 4.929-1.302c1.396 0 2.047 1.395 2.047 2.107c0 2.977-4.682 3.659-6.976 3.659c-6.294 0-10.666-4.992-10.666-11.41c0-6.448 4.341-11.409 10.666-11.409z"></path>
            </svg>
        </SvgIcon>
    );
}

export function UploadIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill="none" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M0 16v-1.984q0-3.328 2.336-5.664t5.664-2.336q1.024 0 2.176 0.352 0.576-2.752 2.784-4.544t5.056-1.824q3.296 0 5.632 2.368t2.368 5.632q0 0.896-0.32 2.048 0.224-0.032 0.32-0.032 2.464 0 4.224 1.76t1.76 4.224v2.016q0 2.496-1.76 4.224t-4.224 1.76h-0.384q0.288-0.8 0.352-1.44 0.096-1.312-0.32-2.56t-1.408-2.208l-4-4q-1.76-1.792-4.256-1.792t-4.224 1.76l-4 4q-0.96 0.96-1.408 2.24t-0.32 2.592q0.032 0.576 0.256 1.248-2.72-0.608-4.512-2.784t-1.792-5.056zM10.016 22.208q-0.096-0.96 0.576-1.6l4-4q0.608-0.608 1.408-0.608 0.832 0 1.408 0.608l4 4q0.672 0.64 0.608 1.6-0.032 0.288-0.16 0.576-0.224 0.544-0.736 0.896t-1.12 0.32h-1.984v6.016q0 0.832-0.608 1.408t-1.408 0.576-1.408-0.576-0.576-1.408v-6.016h-2.016q-0.608 0-1.088-0.32t-0.768-0.896q-0.096-0.288-0.128-0.576z"></path>
            </svg>
        </SvgIcon>
    );
}

export function LinkIcon({ width, height, marginTop, marginLeft }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill={lightMode ? '#1f2f2f' : '#dfefef'} d="M10.975 14.51a1.05 1.05 0 0 0 0-1.485 2.95 2.95 0 0 1 0-4.172l3.536-3.535a2.95 2.95 0 1 1 4.172 4.172l-1.093 1.092a1.05 1.05 0 0 0 1.485 1.485l1.093-1.092a5.05 5.05 0 0 0-7.142-7.142L9.49 7.368a5.05 5.05 0 0 0 0 7.142c.41.41 1.075.41 1.485 0zm2.05-5.02a1.05 1.05 0 0 0 0 1.485 2.95 2.95 0 0 1 0 4.172l-3.5 3.5a2.95 2.95 0 1 1-4.171-4.172l1.025-1.025a1.05 1.05 0 0 0-1.485-1.485L3.87 12.99a5.05 5.05 0 0 0 7.142 7.142l3.5-3.5a5.05 5.05 0 0 0 0-7.142 1.05 1.05 0 0 0-1.485 0z" />
            </svg>
        </SvgIcon>
    );
}

export function CloseIcon({ width, height, marginTop, marginLeft, style }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{...style, width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke={lightMode ? '#1f2f2f' : '#dfefef'} />
                <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke={lightMode ? '#1f2f2f' : '#dfefef'} />
            </svg>
        </SvgIcon>
    );
}

export function BackIcon({ width, height, marginTop, marginLeft, style, disabled }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ ...style, width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42">
                <polygon points="31,38.32 13.391,21 31,3.68 28.279,1 8,21.01 28.279,41 " />
            </svg>
        </SvgIcon>
    );
}

export function NextIcon({ width, height, marginTop, marginLeft, style, disabled }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ ...style, width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg fill={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <polygon points="6.8,23.7 5.4,22.3 15.7,12 5.4,1.7 6.8,0.3 18.5,12" />
            </svg>
        </SvgIcon>
    );
}

export function AddIcon({ width, height, marginTop, marginLeft, style, disabled }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ ...style, width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} />
                <path d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8" stroke={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} />
            </svg>
        </SvgIcon>
    );
}

export function AddValueTypeIcon({ width, height, marginTop, marginLeft, style, disabled }) {
    const lightMode = useLightMode();

    return (
        <SvgIcon style={{ ...style, width: width, height: height, marginTop: marginTop, marginLeft: marginLeft }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 12L12 12M12 12L17 12M12 12V7M12 12L12 17" stroke={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} />
                <circle cx="12" cy="12" r="9" stroke={disabled ? '#7f8f8f' : (lightMode ? '#1f2f2f' : '#dfefef')} />
            </svg>
        </SvgIcon>
    );
}