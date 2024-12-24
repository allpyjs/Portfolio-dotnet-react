import { PortfolioIcon, UsersIcon, WorkflowIcon, AboutUsIcon } from './svg-icons';
import { useLightMode } from '../globals/interface';
import './dashboard-tabs.css';

const DashboardTabs = (props) => {
    const { onPortfolios, onUsers, onEndpoints, onAboutUs } = props;
    const lightMode = useLightMode();

    return (
        <div style={{ marginTop: '-7.5vh', display: 'flex', flexDirection: 'row' }}>
            <div className={lightMode ? 'tabs-light' : 'tabs-dark'} onClick={onPortfolios}>
                <PortfolioIcon width='8vh' height='8vh' marginTop='3.5vh' marginLeft='3.5vh' />
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column' }} >
                    <div className={lightMode ? 'tabs-title-light' : 'tabs-title-dark'}>Portfolios</div>
                    <div className={lightMode ? 'tabs-middle-line-light' : 'tabs-middle-line-dark'} />
                    <div className={lightMode ? 'tabs-description-light' : 'tabs-description-dark'} >
                        Search portfolios what are completed by MONATE team.
                    </div>
                </div>
            </div>
            <div className={lightMode ? 'tabs-light' : 'tabs-dark'} onClick={onUsers}>
                <UsersIcon width='8vh' height='8vh' marginTop='3.5vh' marginLeft='3.5vh' />
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column' }} >
                    <div className={lightMode ? 'tabs-title-light' : 'tabs-title-dark'}>Users</div>
                    <div className={lightMode ? 'tabs-middle-line-light' : 'tabs-middle-line-dark'} />
                    <div className={lightMode ? 'tabs-description-light' : 'tabs-description-dark'} >
                        Search users who are logined in this site.
                    </div>
                </div>
            </div>
            <div className={lightMode ? 'tabs-light' : 'tabs-dark'} onClick={onEndpoints}>
                <WorkflowIcon width='8vh' height='8vh' marginTop='3.5vh' marginLeft='3.5vh' />
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column' }} >
                    <div className={lightMode ? 'tabs-title-light' : 'tabs-title-dark'}>Endpoints</div>
                    <div className={lightMode ? 'tabs-middle-line-light' : 'tabs-middle-line-dark'} />
                    <div className={lightMode ? 'tabs-description-light' : 'tabs-description-dark'} >
                        Search endpoints what are completed by users.
                    </div>
                </div>
            </div>
            <div className={lightMode ? 'tabs-light' : 'tabs-dark'} onClick={onAboutUs}>
                <AboutUsIcon width='8vh' height='8vh' marginTop='4vh' marginLeft='3.5vh' />
                <div style={{ marginLeft: '15px', display: 'flex', flexDirection: 'column' }} >
                    <div className={lightMode ? 'tabs-title-light' : 'tabs-title-dark'}>About Us</div>
                    <div className={lightMode ? 'tabs-middle-line-light' : 'tabs-middle-line-dark'} />
                    <div className={lightMode ? 'tabs-description-light' : 'tabs-description-dark'} >
                        Please read services of MONATE team.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardTabs;