import React, { useEffect, useState } from 'react';
import { MenuList, MenuItem, ListItemIcon, ListItemText, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import QuickreplyIcon from '@mui/icons-material/Quickreply';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import AirIcon from '@mui/icons-material/Air';
import StormIcon from '@mui/icons-material/Storm';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SendIcon from '@mui/icons-material/Send';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { PieChart } from '@mui/icons-material';
import logoMain from './../../assets/logoMain.jpg';

const SideNavMenu = (props: any) => {
	const [location, setLocation] = useState(window.location);
	const [unreadMsgs, setUnreadMsgs] = useState<number>(0)

	useEffect(() => {
		if (!localStorage.getItem('token')) {
			window.location.href = '/auth';
		}
	}, []);

	useEffect(() => {
		if (localStorage.getItem('type') === 'user') {
			fetch(`http://127.0.0.1:8000/api/chatroom/${localStorage.getItem('user_id')}/`, {method: "GET"})
				.then(data => data.json())
				.then(data => {
					setUnreadMsgs(data.rooms.unread_user)
				})
		} else if (localStorage.getItem('type') === 'admin') {			
			fetch("http://127.0.0.1:8000/api/listchats/", {method: "POST", body: JSON.stringify({user: localStorage.getItem('token')}), headers: {"Content-Type": "application/json"}})
				.then(data => data.json())
				.then(data => {
					setUnreadMsgs(data.map((msgs: any) => msgs.unread_admin).reduce((a: number, b: number) => a + b, 0))
				})
		}
	}, [unreadMsgs])

	return (
		<div className='sidenav'>
			<img
				alt={'Logo'}
				style={{ borderRadius: '10px', marginInline: '10px', marginTop: 40 }}
				src={logoMain}
			/>
			<MenuList className='Nav-menu-LIst' style={{ gap: '10px', overflow:'auto' }}>
				<MenuItem
					className={location.pathname === '/dashboard' ? 'custom_active' : ''}>
					<Link
						to={'/dashboard'}
						state={{ title: 'Dashboard' }}
						style={{ display: 'flex' }}>
						<ListItemIcon>
							<DashboardIcon style={{ color: 'white' }} fontSize='small' />
						</ListItemIcon>
						<ListItemText>Dashboard</ListItemText>
					</Link>
				</MenuItem>
				<MenuItem
					className={location.pathname === '/forecast' ? 'custom_active' : ''}>
					<Link
						to={'/forecast'}
						state={{ title: 'Forecast' }}
						style={{ display: 'flex' }}>
						<ListItemIcon>
							<CloudQueueIcon style={{ color: 'white' }} fontSize='small' />
						</ListItemIcon>
						<ListItemText>Forecast</ListItemText>
					</Link>
				</MenuItem>
				<MenuItem
					className={location.pathname === '/overview' ? 'custom_active' : ''}>
					<Link
						to={'/overview'}
						state={{ title: 'Quick Overview' }}
						style={{ display: 'flex' }}>
						<ListItemIcon>
							<QuickreplyIcon style={{ color: 'white' }} fontSize='small' />
						</ListItemIcon>
						<ListItemText>Quick Overview</ListItemText>
					</Link>
				</MenuItem>
				<MenuItem
					className={location.pathname === '/weather' ? 'custom_active' : ''}>
					<Link
						to={'/weather'}
						state={{ title: 'Weather Window' }}
						style={{ display: 'flex' }}>
						<ListItemIcon>
							<ArtTrackIcon style={{ color: 'white' }} fontSize='small' />
						</ListItemIcon>
						<ListItemText>Weather Window</ListItemText>
					</Link>
				</MenuItem>
				<MenuItem>
					<ListItemIcon>
						<AirIcon style={{ color: 'white' }} fontSize='small' />
					</ListItemIcon>
					<ListItemText>Squall</ListItemText>
				</MenuItem>
				<MenuItem
				className={location.pathname === '/typhoon' ? 'custom_active' : ''}>
					<Link
						to={'/typhoon'}
						state={{ title: 'typhoon' }}
						style={{ display: 'flex' }}>
					<ListItemIcon>
						<StormIcon style={{ color: 'white' }} fontSize='small' />
					</ListItemIcon>
					<ListItemText>Typhoon</ListItemText>
					</Link>
				</MenuItem>
				<MenuItem>
					<ListItemIcon>
						<FlashOnIcon style={{ color: 'white' }} fontSize='small' />
					</ListItemIcon>
					<ListItemText>Lightning</ListItemText>
				</MenuItem>
				<MenuItem
					className={
						location.pathname === '/observation' ? 'custom_active' : ''
					}>
					<Link
						to={'/observation'}
						state={{ title: 'Submit Observation' }}
						style={{ display: 'flex' }}>
						<ListItemIcon>
							<SendIcon style={{ color: 'white' }} fontSize='small' />
						</ListItemIcon>
						<ListItemText>Submit Observation</ListItemText>
					</Link>
				</MenuItem>
				{localStorage.getItem('type') === 'user' ? (
					<MenuItem>
						<Link
							to={'/chat'}
							state={{ title: 'Submit Observation' }}
							style={{ display: 'flex' }}>
							<ListItemIcon>
								<ConnectWithoutContactIcon
									style={{ color: 'white' }}
									fontSize='small'
								/>
							</ListItemIcon>
							<Badge badgeContent={unreadMsgs} color="info">
								<ListItemText>Contact Duty Forecaster</ListItemText>
							</Badge>
						</Link>
					</MenuItem>
				) : (
					<MenuItem>
						<Link
							to={'/adminchat'}
							state={{ title: 'Submit Observation' }}
							style={{ display: 'flex' }}>
							<ListItemIcon>
								<ConnectWithoutContactIcon
									style={{ color: 'white' }}
									fontSize='small'
								/>
							</ListItemIcon>
							<Badge badgeContent={unreadMsgs} color="info">
								<ListItemText>Contact Duty Forecaster</ListItemText>
							</Badge>
						</Link>
					</MenuItem>
				)}
				
				{localStorage.getItem('type') === 'admin' ? (
					<MenuItem>
						<Link
							to={'/usermanagement'}
							state={{ title: 'Submit Observation' }}
							style={{ display: 'flex' }}>
							<ListItemIcon>
								<SupervisorAccountIcon
									style={{ color: 'white' }}
									fontSize='small'
								/>
							</ListItemIcon>
							<ListItemText>User Management</ListItemText>
						</Link>
					</MenuItem>
				) : null}
				<MenuItem>
						<Link
							to={'/chart'}
							state={{ title: 'Chart' }}
							style={{ display: 'flex' }}>
							<ListItemIcon>
								<PieChart
									style={{ color: 'white' }}
									fontSize='small'
								/>
							</ListItemIcon>
							<ListItemText>Chart</ListItemText>
						</Link>
					</MenuItem>
			</MenuList>
		</div>
	);
};

export default SideNavMenu;