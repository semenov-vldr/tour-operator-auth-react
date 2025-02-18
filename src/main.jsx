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

// import Storage from './routes/storage';
// import Storage_v2 from './routes/storage-v2';



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

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
