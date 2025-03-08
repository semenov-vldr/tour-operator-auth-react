import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.sass';

import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Register from "./routes/Register";
import UserForm from './routes/UserForm';
import User from "./routes/User";
import Admin from "./routes/Admin";
import TravelAgencies from "./routes/TravelAgencies";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="login"/>,
    errorElement: <ErrorPage/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },

  {
    path: "/register",
    element: <Register/>,
  },

  {
    path: "/user-form",
    element: <UserForm/>,
  },

  {
    path: "/user",
    element: <User/>,
  },

  {
    path: "/admin",
    element: <Admin/>,
  },

  {
    path: "/travel-agencies",
    element: <TravelAgencies/>,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
