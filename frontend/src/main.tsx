// import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store.ts'
import { PersistGate } from 'redux-persist/lib/integration/react';


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <Router>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <App />
        </PersistGate>
      </Provider>
    </Router>
  // </React.StrictMode>,
)
