import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "../Page/Home";
import Dashboard from "../Layout/Dashboard";
import { LoginPage } from "../Page/Login";
import { RegisterPage } from "../Page/Register";
import NewNote from "../Page/Dashboard/NewNote";






export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />

  },
  {
    path: "/dashboard",
    element: <Dashboard />,

  },
  {
    path: "/new",
    element: <NewNote />
  }
]);


