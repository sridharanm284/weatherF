import SideNavMenu from '../../routers/sideNav';

interface SideNavProps {
  show: any;
  hideSideNav: any;
}

const SideNavComponent: React.FC<SideNavProps> = ({ show, hideSideNav }) => {
    return show ? <div >
        <SideNavMenu />
    </div> : <></>
};

export default SideNavComponent;