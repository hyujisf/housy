import React from 'react';

import ReactDOM from 'react-dom/client';

import 'index.scss';
// import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from 'context/AppContext';
import { QueryClient, QueryClientProvider } from 'react-query';

const client = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <QueryClientProvider client={client}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();
