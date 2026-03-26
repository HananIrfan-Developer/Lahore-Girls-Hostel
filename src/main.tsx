import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';
import { toast } from 'sonner';

const updateSW = registerSW({
  onNeedRefresh() {
    toast('New content available', {
      action: {
        label: 'Reload',
        onClick: () => updateSW(true)
      },
      duration: Infinity
    });
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
