import { createRoot } from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import { AppDataProvider } from './app/context/AppDataContext';

createRoot(document.getElementById('root')!).render(
  <AppDataProvider>
    <App />
  </AppDataProvider>
);
