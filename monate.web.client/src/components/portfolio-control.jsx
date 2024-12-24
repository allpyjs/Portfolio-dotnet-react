import { useState, useEffect, useRef } from 'react';
import { LinkIcon, NextIcon, BackIcon } from './svg-icons';
import { MyTextField } from './my-controls';
import { useLightMode } from '../globals/interface';
import './portfolio-control.css';

const PortfolioElement = ({ image, url, title, categories }) => {
    const lightMode = useLightMode();

    const redirect = () => {
        var finalUrl = url;
        if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'http://' + finalUrl;
        }
        window.open(finalUrl, '_blank');
    }

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', borderRadius: '5%', width: '430px', marginLeft: '1%', marginRight: '1%',
            marginTop: '20px', height: '370px', backgroundColor: lightMode ? '#1f2f2f22' : '#dfefef22', marginBottom: '20px',
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
                <div style={{ color: lightMode ? '#1f2f2f' : '#dfefef', fontSize: '30px', marginTop: '3%' }}>
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
                    {categories.map((category, index) => (
                        <div key={index} style={{
                            display: 'flex', justifyContent: 'center', alignItems: 'center',
                            backgroundColor: '#7f8f8f', color: lightMode ? '#1f2f2f' : '#dfefef',
                            borderRadius: '4px', padding: '2px', marginRight: '6px'
                        }}>
                            &nbsp;&nbsp;{category}&nbsp;&nbsp;
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const PortfolioControl = (props) => {
    const lightMode = useLightMode();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [portfolios, setPortfolios] = useState([]);
    const timerRef = useRef(null);

    const getPortfolios = async () => {
        const url = `/portfolio?page=${currentPage}&query=${searchQuery}`;
        const response = await fetch(url, {
            method: 'GET',
        });
        const data = await response.json();

        if (!response.ok) {
            return;
        } else {
            setPortfolios(data.portfolios);
            setMaxPage(data.maxPage);
        }
    };

    const handleQueryChange = (e) => {
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
        getPortfolios();
    }, [currentPage, searchQuery]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', justifyContent: 'center' }} >
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh', alignItems: 'center', justifyContent: 'center' }}>
                <MyTextField
                    placeholder='Search...'
                    id='portfolio-title'
                    style={{ marginTop: '3%', width: '20vw' }}
                    onChange={handleQueryChange}
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
                {portfolios.map((portfolio, index) => (
                    <PortfolioElement key={index} title={portfolio.title} url={portfolio.url} image={portfolio.image} categories={portfolio.categories} />
                ))}
            </div>
        </div>
    );
}

export default PortfolioControl;