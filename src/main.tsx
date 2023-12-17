import React, { useEffect, useState, useRef } from 'react';
import './styles/_app.scss';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Header from './components/header';
import { styled } from '@mui/material/styles';
import store from './store';
import { useSelector } from 'react-redux';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import SideNavComponent from './components/sideNav/sideNav';
import { router } from './routers/appRoutes';


function MainComponent() {
	const windowWidth = useRef(window.innerWidth);
	const [open, setOpen] = useState(
		window.location.pathname === '/auth' ? false : true,
	);
	const [show, setShow] = useState(
		window.location.pathname === '/auth' ? false : true,
	);
	const [token, setToken] = useState(localStorage.getItem('login'));
	const data = useSelector((state: any) => state?.app);
	useEffect(() => {
		store.dispatch({
			type: 'TOGGLE_MENU',
			payload: windowWidth.current > 1000 ? true : false,
		});
	}, []);

	useEffect(() => {
		setOpen(data.toggle);
		localStorage.setItem('sideNav',open.toString())
	}, [data]);

	interface AppBarProps extends MuiAppBarProps {
		open?: boolean;
	}

	const AppBar = styled(MuiAppBar, {
		shouldForwardProp: (prop) => prop !== 'open',
	})<AppBarProps>(({ theme, open }) => ({
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		...(open && {
			width: `calc(100% - ${260}px)`,
			marginLeft: `${260}px`,
			transition: theme.transitions.create(['margin', 'width'], {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen,
			}),
		}),
	}));

	return (
		<>
			<Router>
				{show ? (
					<AppBar
						onClick={() => localStorage.setItem('sideNav', open.toString())}
						open={open}
						position='sticky'>
						<Header className={data.toggle ? 'headerpadding' : null} />
					</AppBar>
				) : null}

				{show ? <SideNavComponent show={open} hideSideNav={false} /> : null}
				<div className='content'>
					<Routes>
						{router.map((route) => (
							<Route
								key={route.path}
								path={route.path}
								element={route.component}
							/>
						))}
					</Routes>
					{/* Add more routes as needed */}
				</div>
			</Router>
		</>
	);
}

export default MainComponent;
