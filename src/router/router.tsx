import React from "react";
import { createBrowserRouter } from "react-router";
import Home from "../Page/Home";
import Dashboard from "../Layout/Dashboard";
import { LoginPage } from "../Page/Login";
import { RegisterPage } from "../Page/Register";
import NewNote from "../Page/Dashboard/NewNote";
import { NoteView } from "../Page/Dashboard/NoteView";
import UpdateNote from "../Page/Dashboard/UpdateNote";
import PrivateRoute from "../Route/PrivateRoute";
import ErrorPage from "../Page/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/new",
    element: (
      <PrivateRoute>
        <NewNote />
      </PrivateRoute>
    ),
  },
  {
    path: "/update/:id",
    element: (
      <PrivateRoute>
        <UpdateNote />
      </PrivateRoute>
    ),
  },
  {
    path: "/note/:id",
    element: (
      <PrivateRoute>
        <NoteView />
      </PrivateRoute>
    ),
  },
  {
    path:'/*',
    element:<ErrorPage code={404} message="Page Not Found"/>
  }
]);
