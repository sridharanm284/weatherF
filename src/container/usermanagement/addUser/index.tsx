import React, { useState, useEffect, useRef } from 'react';
import './_index.scss';
import store from '../../../store';
import {
	Button,
	InputLabel,
	Grid,
	TextField,
	Autocomplete,
	Select,
	MenuItem,
	FormControl,
	ThemeProvider,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



interface ClientNamesInterface {
	client_name: string;
	client_id: string;
}

const AddNewUserComponent = () => {
	const [sn, setSn] = useState(localStorage.getItem('sideNav'));
	const data = useSelector((state: any) => state?.app);
	const windowWidth = useRef(window.innerWidth);
	const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
	const [clientId, setClientId] = useState(null);
	const [nameError, setNameError] = useState(false);

	const [formData, setFormData] = useState({
		name: '',
		password: '',
		user_type: 'user',
		client: '',
		operation: '',
		email_address: '',
		telephone: '',
		contract_no: '',
		region: '',
		vessel: '',
		lat: '',
		lon: '',
		site_route: '',
		start_date: '',
		end_date: '',
		expected_date: '',
		metsys_name: '',
		service_types: '',
		day_shift: '',
		night_shift: '',
		last_bill_update: '',
		wind: '',
		wave: '',
		current: '',
		satpic: '',
		client_id: '',
		forecast_id: '',
	});
	const [userId, setUserId] = useState('');
	const [clientNames, setClientNames] = useState<ClientNamesInterface[]>([]);
	const [operationsData, setOperationsData] = useState<any[]>([]);
	const [filesData, setFilesData] = useState({
		wind: '',
		wave: '',
		current: '',
		satpic: '',
	});
	const projectNo = useRef<HTMLInputElement | null>(null);
	

	const navigate = useNavigate();

	const getClientNames = async () => {
		fetch('http://localhost:8000/api/getclients/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setClientNames(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	useEffect(() => {
		getClientNames();
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const getFiles = async (id: any) => {
		await setFilesData({ wind: '', wave: '', satpic: '', current: '' });
		fetch(`http://localhost:8000/api/getfiles/${id}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then(async (data) => {
				await setFilesData(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault()
		const newData = {
			...formData,
			
			// name: formData.name,
			password: formData.password.toString(),
			user_type: formData.user_type.toString(),
			client: formData.client.toString(),
			operation: formData.operation.toString(),
			email_address: formData.email_address.toString(),
			telephone: formData.telephone.toString(),
			contract_no:
				formData.contract_no === null ? '' : formData.contract_no.toString(),
			region: formData.region === null ? '' : formData.region.toString(),
			vessel: formData.vessel === null ? '' : formData.vessel.toString(),
			lat: formData.lat === null ? '' : formData.lat.toString(),
			lon: formData.lon === null ? '' : formData.lon.toString(),
			site_route:
				formData.site_route === null ? '' : formData.site_route.toString(),
			start_date:
				formData.start_date === null ? '' : formData.start_date.toString(),
			end_date: formData.end_date === null ? '' : formData.end_date.toString(),
			metsys_name:
				formData.metsys_name === null ? '' : formData.metsys_name.toString(),
			service_types:
				formData.service_types === null
					? ''
					: formData.service_types.toString(),
			day_shift:
				formData.day_shift === null ? '' : formData.day_shift.toString(),
			night_shift: formData.night_shift.toString(),
			last_bill_update: formData.last_bill_update.toString(),
			wind: filesData.wind.toString(),
			wave: filesData.wave.toString(),
			current: filesData.current.toString(),
			satpic: filesData.satpic.toString(),
			forecast_id: formData.forecast_id.toString(),
		};

		fetch('http://localhost:8000/api/user/save/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newData),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				navigate('/usermanagement');
			})
			.catch((error) => {
				console.error('Error:', error);
			});
		
	};

	useEffect(() => {
		const l = localStorage.getItem('sideNav');
		setSn(l);
	}, []);

	useEffect(() => {
		store.dispatch({
			type: 'TOGGLE_MENU',
			payload: windowWidth.current > 1000 ? true : false,
		});
	}, []);

	useEffect(() => {
		setOpen(data.toggle);
	}, [data]);

	console.log(filesData);

	// useEffect(() => {
	// 	if (clientId) {

	// 	}
	// }, [clientId]);

	const getClientData = (a: any) => {
		fetch(`http://localhost:8000/api/operations/${a}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
				setOperationsData(data);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};

	return (
		<div
			style={open ? { marginLeft: 260, width: 'calc(100% - 260px)' } : {}}
			className={'maina'}>
			<div className={`content-wrap chatwrap`}>
			
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
  <Button
    onClick={(_: any) => navigate("/usermanagement")}
    style={{ backgroundColor: "blue", color: "white" }}
  >
    Back
  </Button>
</div>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={2}>
						<Grid
							spacing={3}
							item
							data-aos="fade-up"
							style={{
								padding: 10,
								gap: 10,
								display: 'flex',
								flexDirection: 'column',
							}}
							xs={6}>
							<React.Fragment >
								<InputLabel>Client</InputLabel>
								<Autocomplete
									id='free-solo-demo'
									freeSolo
									autoHighlight
									disableClearable
									size="small"
									options={clientNames.map((option) => ({
										label: option.client_name,
										value: option.client_id.toString(),
									}))}
									getOptionLabel={(option: any) => (option ? option.label : '')}
									onChange={(
										event: any,
										newValue: any | { label: string; value: string } | null,
									) => {
										if (newValue) {
											getClientData(newValue.value);
											setFormData({
												name: '',
												password: '',
												user_type: 'user',
												client: newValue.label,
												operation: '',
												email_address: '',
												telephone: '',
												contract_no: '',
												region: '',
												vessel: '',
												lat: '',
												lon: '',
												site_route: '',
												start_date: '',
												end_date: '',
												expected_date: '',
												metsys_name: '',
												service_types: '',
												day_shift: '',
												night_shift: '',
												last_bill_update: '',
												wind: '',
												wave: '',
												current: '',
												satpic: '',
												client_id: '',
												forecast_id: '',
											});
											setFilesData({
												wind: '',
												wave: '',
												current: '',
												satpic: '',
											});
										}
									}}
									renderInput={(params) => (
										<TextField required type='search' {...params} label='Client Name' />
									)}
								/>
								<InputLabel>Project No</InputLabel>
								<Autocomplete
									id='free-solo-demoa'
									size="small"
									disableClearable
									freeSolo
									autoHighlight
									options={operationsData.map((option) => ({
										label: option.forecast_description,
										value: option,
									}))}
									defaultValue={{label: formData.operation, value: operationsData}}
									getOptionLabel={(option: any) => (option ? option.label : '')}
									onChange={(
										event: any,
										newValue: any | { label: string; value: string } | null,
									) => {
										const n = newValue.value;
										setFormData({
											...formData,
											contract_no: n?.contract_number,
											region: n?.region_id,
											vessel: n?.vessel_rig_platform_name,
											lat: n?.lat,
											lon: n?.long,
											site_route: n?.route,
											start_date: n?.start_date,
											forecast_id: n?.forecast_id,
											expected_date: n?.expected_date,
											operation: n?.forecast_description,
											client_id: n?.client_id,
										});
										getFiles(n.forecast_id);
									}}
									renderInput={(params) => (
										<TextField
											type='search'
											ref={projectNo}
											{...params}
											value={formData.operation}
											label='Project No'
											required
										/>
									)}
								/>
								<InputLabel htmlFor='name'>Name</InputLabel>
								<input
									name='name'
									required
									value={formData.name}
									onChange={handleInputChange}

								/>
								<InputLabel htmlFor='password'>Password</InputLabel>
								<input
									name='password'
									type='password'
									defaultValue={formData.password}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='user_type'>User Type</InputLabel>
								<Select
									labelId='role-label'
									id='role-select'
									defaultValue={formData?.user_type}
									size='small'
									required
									onChange={(e) => {
										setFormData({ ...formData, user_type: e.target.value });
									}}>
									<MenuItem value='user'>User</MenuItem>
									<MenuItem value='admin'>Admin</MenuItem>
								</Select>
								<InputLabel htmlFor='email_address'>Email Address</InputLabel>
								<input
									name='email_address'
									type='email'
									defaultValue={formData.email_address}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='telephone'>Telephone</InputLabel>
								<input
									name='telephone'
									type='text'
									defaultValue={formData.telephone}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='contract_no'>CTRCT NO</InputLabel>
								<input
									name='contract_no'
									type='text'
									defaultValue={formData.contract_no}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='region'>Region</InputLabel>
								<input
									name='region'
									type='text'
									defaultValue={formData.region}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='vessel'>VESSEL/RIG/PLTFRM</InputLabel>
								<input
									name='vessel'
									type='text'
									defaultValue={formData.vessel}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='lat'>Latitude</InputLabel>
								<input
									name='lat'
									defaultValue={formData.lat}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='lon'>Longitude</InputLabel>
								<input
									name='lon'
									defaultValue={formData.lon}
									required
									onChange={handleInputChange}
								/>
								<InputLabel htmlFor='site_route'>Site Route</InputLabel>
								<input
									name='site_route'
									defaultValue={formData.site_route}
									onChange={handleInputChange}
									required
								/>
								<InputLabel htmlFor='start_date'>Start Date</InputLabel>
								<input
									name='start_date'
									type='datetime-local'
									value={formData.start_date}
									onChange={handleInputChange}
									required
								/>
							</React.Fragment>
						</Grid>
						<Grid
							spacing={3}
							item
							style={{
								padding: 10,
								gap: 10,
								display: 'flex',
								flexDirection: 'column',
							}}
							xs={6}>
							
							<InputLabel htmlFor='expected_date'>Expected Date</InputLabel>
							<input
								name='expected_date'
								type='datetime-local'
								defaultValue={formData.expected_date}
								onChange={handleInputChange}
								required
							/>
							<InputLabel htmlFor='metsys_name'>Metsys Name</InputLabel>
							<input
								name='metsys_name'
								type='text'
								value={formData.metsys_name}
								onChange={handleInputChange}
								required
							/>
							<InputLabel htmlFor='service_types'>Service Types</InputLabel>
							<input
								name='service_types'
								value={formData.service_types}
								onChange={handleInputChange}
								required
							/>
							<InputLabel htmlFor='day_shift'>Day Shift</InputLabel>
							<input
								name='day_shift'
								value={formData.day_shift}
								onChange={handleInputChange}
								required
							/>
							<InputLabel htmlFor='night_shift'>Night Shift</InputLabel>
							<input
								name='night_shift'
								value={formData.night_shift}
								onChange={handleInputChange}
								required
							/>
							<div
								style={{
									border: '1px solid black',
									padding: 10,
									marginTop: 20,
								}}>
								<Grid>
									<InputLabel htmlFor='wind'>Wind</InputLabel>
									<input
										name='wind'
										value={filesData?.wind}
										onChange={handleInputChange}
										required
									/>
									<InputLabel htmlFor='wave'>Wave</InputLabel>
									<input
										name='wave'
										value={filesData?.wave}
										onChange={handleInputChange}
										required
									/>
									<InputLabel htmlFor='current'>Current</InputLabel>
									<input
										name='current'
										value={filesData?.current}
										onChange={handleInputChange}
										required
									/>
									<InputLabel htmlFor='satpic'>Satpic</InputLabel>
									<input
										name='satpic'
										value={filesData?.satpic}
										onChange={handleInputChange}
										required
									/>
								</Grid>
							</div>
						</Grid>
					</Grid>
					
					<Button type='submit' variant='contained' color='primary'>
						Submit
					</Button>
				</form>
				<div style={{ height: '100px' }}></div>
			</div>
		</div>
	);
};

export default AddNewUserComponent;