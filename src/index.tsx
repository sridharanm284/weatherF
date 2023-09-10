import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import App from './App';
import { router } from './routers/appRoutes';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement,
);
root.render(
	<React.StrictMode>
		<Provider store={store}>
		<App />
		{/* <RouterProvider router={router} /> */}
		</Provider>
	</React.StrictMode>,
);