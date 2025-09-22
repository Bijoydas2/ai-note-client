import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "../Page/Home";
import Dashboard from "../Page/Dashboard/Dashboard";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/dashboard",
    element: <Dashboard/>,
  },
]);


