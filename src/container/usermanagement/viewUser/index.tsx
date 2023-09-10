import React, { useState, useEffect, useRef } from 'react';
import store from '../../../store';
import {
	Button,
	InputLabel,
	Grid,
	TextField,
	Autocomplete,
	FormControl,
	Typography,
	Container,
	ThemeProvider,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

interface ClientNamesInterface {
	client_name: string;
	client_id: string;
}

const ViewUserComponent = () => {
	const [sn, setSn] = useState(localStorage.getItem('sideNav'));
	const data = useSelector((state: any) => state?.app);
	const windowWidth = useRef(window.innerWidth);
	const [open, setOpen] = useState(windowWidth.current > 1000 ? true : false);
	const [clientId, setClientId] = useState(null);
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
	const { id } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (id) {
			fetch(`http://localhost:8000/api/user/get/${id}/`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			})
				.then((response) => response.json())
				.then((data) => {
					console.log(data);
					setFormData(data);
				})
				.catch((error) => {
					console.error('Error:', error);
				});
		}
	}, [id]);

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

	return (
		<div
			style={open ? { marginLeft: 260, width: "calc(100% - 260px)", background: 'transparent' } : { background: 'transparent' }}
			className={"maina"}
		>
	      <div style={{ paddingBlock: '20px', paddingInline: '25px', borderRadius: '10px', background: 'white' }} className={`content-wrap chatwrap`}>
			<div style={{ display: "grid", justifyContent: "end" }}>
				<Button
					onClick={(_: any) => navigate("/usermanagement")}
					style={{ backgroundColor: "blue", color: "white" }}
				>
					Back
				</Button>
			</div>

			<table className='view_user_table'>
				<tr>
					<td className='title_td'>client name: </td>
					<td>{formData.client}</td>
					<td className='title_td'>Email Address: </td>
					<td>{formData.email_address}</td>
				</tr>
				
				<tr>
					<td className='title_td'>Project No: </td>
					<td>{formData.operation}</td>
					<td className='title_td'>Contact Number:</td>
					<td>{formData.telephone}</td>
				</tr>
				<tr>
					<td className='title_td'>Name: </td>
					<td>{formData.name}</td>
					<td className='title_td'>User Type: </td>
					<td>{formData.user_type}</td>
				</tr>
				<tr>
					<td className='title_td'>Contract No: </td>
					<td>{formData.contract_no}</td>
					<td className='title_td'>Region No:</td>
					<td>{formData.region}</td>
				</tr>
				<tr>
					<td className='title_td'>Site No: </td>
					<td>{formData.site_route}</td>
					<td className='title_td'>Start Date:</td>
					<td>{formData.start_date}</td>
				</tr>
				<tr>
					<td className='title_td'>Expected Date:</td>
					<td colSpan={3}	>{formData.expected_date}</td>
				</tr>
				<tr>
					<td className='title_td'>Metsys Name: </td>
					<td>{formData.metsys_name}</td>
					<td className='title_td'>Service Types:</td>
					<td>{formData.service_types}</td>
				</tr>
				<tr>
					<td className='title_td'>Day Shift: </td>
					<td>{formData.day_shift}</td>
					<td className='title_td'>Night Shift:</td>
					<td>{formData.night_shift}</td>
				</tr>
				<tr>
					<td className='title_td'>Last Bill Update: </td>
					<td>{formData.last_bill_update}</td>
					<td className='title_td'>Client Id:</td>
					<td>{formData.client_id}</td>
				</tr>
				<tr>
					<td className='title_td'>Latitude: </td>
					<td>{formData.lat}</td>
					<td className='title_td'>Logitude:</td>
					<td>{formData.lon}</td>
				</tr>
				
				<tr>
					<td className='title_td'>Sattilite Pic: </td>
					<td>{formData.satpic}</td>
					<td className='title_td'>Wave:</td>
					<td>{formData.wave}</td>
				</tr>
				<tr>
					<td className='title_td'>Wind:</td>
					<td>{formData.wind}</td>
					<td className='title_td'>Current: </td>
					<td colSpan={3}>{formData.current}</td>
				</tr>
			</table>
		</div>
	</div>
	);
};

export default ViewUserComponent;