import React, { useState, useEffect, useRef } from 'react';
import {
	Button,
	Table,
	TableBody,
	TableCell,
	Menu,
	MenuItem,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import store from '../../store';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import './styles/_index.scss';
import { useNavigate } from 'react-router-dom';

interface UserData {
	id: number;
	name: string;
	password: string;
	email_address: string;
	project_no: string;
	operation:string;
	lat: string;
	lon: string;
	site_route: string;
	start_date: string;
	end_date: string;
	expected_date: string;
	service_types: string;
	day_shift: string;
	user_type: string;
	night_shift: string;
	last_bill_update: string;
	client_id: string;
}

const UserManagement: React.FC = () => {
	const [users, setUsers] = useState<UserData[]>([]);
	const [sn, setSn] = useState(localStorage.getItem('sideNav'));
	const data = useSelector((state: any) => state?.app);
	const windowWidth = useRef(window.innerWidth);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [selectedId, setSelectedId] = useState(0);

	const menuOpen = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const getUsersData = async () => {
		fetch('http://localhost:8000/api/user/get/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setUsers(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	useEffect(() => {
		getUsersData();
	}, []);

	useEffect(() => {
		const l = localStorage.getItem('sideNav');
		setSn(l);
	}, []);

	const handleDelete = (id: any) => {
		if (window.confirm('Are you sure want to delete this User?')) {
			fetch(`http://localhost:8000/api/user/get/${id}/`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					getUsersData();
					handleClose()
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	};

	useEffect(() => {
		store.dispatch({
			type: 'TOGGLE_MENU',
			payload: windowWidth.current > 1000 ? true : false,
		});
	}, []);

	useEffect(() => {
		setOpen(data.toggle);
	}, [data]);

	
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	return (
		<div
			style={open ? { marginLeft: 260, width: 'calc(100% - 260px)' } : {}}
			className={'mainas'}>
			<div>
				<div className='tabel_users'>
					<div
						style={{
							display: 'flex',
							flexDirection: 'row-reverse',
							gap: 10,
							flexWrap: 'wrap',
							width: '100%',
							justifyContent:'space-between'
						}}>
						<Button
							onClick={() => navigate('/addnewuser')}
							variant='contained'
							color='primary'
							style={{ margin: 10 ,float:'right'}}
							className='add-user-button'>
							Add User
						</Button>
						<input
							style={{ margin: 10 }}
							type='search'
							onChange={(e: any) => setSearch(e.target.value)}
							placeholder='Enter User Name To Search'
						/>
					</div>
					<TableContainer className={'user-table-container'}>
						<Table style={{ borderRadius: 10 }}>
							<TableHead>
								<TableRow>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderLeft: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										ID
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Name
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Email Address
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Project Number
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Latitude
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Longitude
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Site Route
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Start Date
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										End Date
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Expected Date
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Service Types
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Day Shift
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Night Shift
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>
										Status
									</TableCell>
									<TableCell
										className='tabel_header'
										style={{
											borderRight: '1px solid #e0e0e0',
											borderTop: '1px solid #e0e0e0',
										}}>Actions</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{users
									.sort((a, b) => a.id - b.id)
									.filter((data) => data.name.includes(search))
									.map((user: any) => (
										<TableRow key={user.id}>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
													borderLeft: '1px solid #e0e0e0',
												}}
												onClick={() => console.log(user.id)}>
												{user.id}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.name}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.email_address}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.operation}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.lat}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.lon}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.site_route}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.start_date}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.end_date}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.expected_date}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.service_types}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.day_shift}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{user.night_shift}
											</TableCell>
											<TableCell
												style={{
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												{((user.expected_date !== undefined) &&  (new Date(user.expected_date) < new Date())) ? "Inactive" : "Active"}
											</TableCell>
											<TableCell
												style={{
														
													textAlign: 'center',
													borderRight: '1px solid #e0e0e0',
												}}>
												<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
													<EditIcon fontSize='small' style={{ cursor: 'pointer', padding: '2.5px', borderRadius: '10px', border: '2px solid black' }} onClick={() => navigate(`/edit/${user.id}/`)} />
													<VisibilityIcon fontSize='small' style={{ cursor: 'pointer', padding: '2.5px', borderRadius: '10px', border: '2px solid black' }} onClick={() => navigate(`/view/${user.id}/`)} />
													<DeleteIcon fontSize='small' style={{ cursor: 'pointer', padding: '2.5px', borderRadius: '10px', border: '2px solid black' }} onClick={() => handleDelete(user.id)} />
												</div>
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
				</div>
			</div>
		</div>
	);
};

export default UserManagement;