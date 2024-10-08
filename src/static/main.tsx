import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from '../globalStore/globalStore';
import './main.scss';

import MainPage from '../pages/main/main';
import VehiclePage from '../pages/vehicle/vehicle';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainPage />,
    children: [],
  },
  {
    path: '/vehicles/:vehicleId',
    element: <VehiclePage />,
    children: [],
  },
]);

const rootElement = document.getElementById('root') as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
