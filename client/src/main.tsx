import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import store from '@/store/store.ts';
import { AuthWrapper } from '@/components';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <AuthWrapper>
      <BrowserRouter>
        <App />
        <Toaster position="bottom-center" />
      </BrowserRouter>
    </AuthWrapper>
  </Provider>
);
