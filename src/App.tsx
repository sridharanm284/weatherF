import { ThemeProvider, createTheme } from '@mui/material/styles';
import MainComponent from './main';
import './styles/_app.scss';

const theme = createTheme({
  palette: {
    primary: {
      light: '#1A3D67',
      main: '#1A3D67',
      dark: '#1A3D67',
      contrastText: '#fff',
    },
    secondary: {
      light: '#D5D5D5',
      main: '#D5D5D5',
      dark: '#D5D5D5',
      contrastText: '#000',
    },
    success: {
      light: '#4CAF50',
      main: '#4CAF50',
      dark: '#4CAF50',
      contrastText: '#fff',
    },
    error: {
      light: '#F44336',
      main: '#F44336',
      dark: '#F44336',
      contrastText: '#fff',
    },
    warning: {
      light: '#ff9800',
      main: '#ff9800',
      dark: '#ff9800',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    info: {
      light: '#3399FF',
      main: '#3399FF',
      dark: '#1976d2',
      contrastText: '#fff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
        <MainComponent />
    </ThemeProvider>
  );
}

export default App;
