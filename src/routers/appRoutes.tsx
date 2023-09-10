import Dashboard from '../container/dashboard';
import ForeCast from '../container/forecast';
import Overview from '../container/overview';
import Weather from '../container/weather';
import Observation from '../container/observation';
import AuthPage from '../container/login/auth';
import ChatAppClient from '../container/chatuser/chatuser';
import ChatAdmin from '../container/chatuser/adminchat';
import UserManagement from '../container/usermanagement';
import AddNewUserComponent from '../container/usermanagement/addUser';
import EditUserComponent from '../container/usermanagement/editUser';
import ViewUserComponent from '../container/usermanagement/viewUser';
import ChartComponent from '../container/chart'
import TyphoonComponent from '../container/typhoon'

export const Roles = {
	SUPERUSER: 'is_superuser',
};

const appRoutes = [
	{
		name: 'forecast',
		path: '/forecast',
		component: ForeCast,
		protected: false,
		isNavMenu: false,
		//icon: "CloudQueueIcon",
		permission: [],
	},
	{
		name: 'Dashboard',
		path: '/dashboard',
		component: Dashboard,
		protected: true,
		isNavMenu: true,
		// icon: "desktop_mac", // DesktopMac
		permission: [],
	},
	{
		name: 'Overview',
		path: '/overview',
		component: Overview,
		protected: true,
		isNavMenu: true,
		// icon: "desktop_mac", // DesktopMac
		permission: [],
	},
	{
		name: 'Weather Window',
		path: '/weather',
		component: Weather,
		protected: true,
		isNavMenu: true,
		// icon: "desktop_mac", // DesktopMac
		permission: [],
	},
	{
		name: 'Submit Observation',
		path: '/observation',
		component: Weather,
		protected: true,
		isNavMenu: true,
		// icon: "desktop_mac", // DesktopMac
		permission: [],
	},
	{
		name: 'login',
		path: '/login',
		protected: false,
		component: AuthPage,
		permission: [],
	},
	{
		name: 'default',
		path: '/',
		protected: false,
		component: Dashboard,
		permission: [],
	},
];

export default appRoutes;

export const router = [
	{
		path: '/',
		component: <Dashboard />,
	},
	{
		path: '/dashboard',
		component: <Dashboard />,
	},
	{
		path: '/auth',
		component: <AuthPage />,
	},
	{
		path: '/forecast',
		component: <ForeCast />,
	},
	{
		path: '/overview',
		component: <Overview />,
	},
	{
		path: '/weather',
		component: <Weather />,
	},
	{
		path: '/observation',
		component: <Observation />,
	},
	{
		path: '/forgot-password',
		component: <Dashboard />,
	},
	{
		path: '/privacypolicy',
		component: <Dashboard />,
	},
	{
		path: '/unauthorized',
		component: <Dashboard />,
	},
	{
		path: '/chat',
		component: <ChatAppClient />,
	},
	{
		path: '/adminchat',
		component: <ChatAdmin />,
	},
	{
		path: '/usermanagement',
		component: <UserManagement />,
	},
	{
		path: '/addnewuser',
		component: <AddNewUserComponent />,
	},
	{
		path: '/edit/:id',
		component: <EditUserComponent />,
	},
	{
		path: '/view/:id',
		component: <ViewUserComponent />,
	},
	{
		path: '/chart',
		component: <ChartComponent />
	},
	{
		path: '/typhoon',
		component: <TyphoonComponent />
	}
];