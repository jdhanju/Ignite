import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import Home from "./pages/Home";
import Login, { loader as loginLoader } from "./pages/Login";
import ErrorPage from "./pages/ErrorPage";
import Signup from "./pages/Signup";
import PublicDates from "./pages/PublicDates";
import MyDates from "./pages/MyDates";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect, useState } from "react";
import { getSession } from "./api/internal/postgres";

export default function App() {
  const { user, dispatch } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  // React Router
  // TODO: Uncomment/add protected routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: user ? <Home /> : <Login />,
      // element: <Home />,
      loader: loginLoader,
      errorElement: <ErrorPage />,
    },
    {
      path: "/login",
      element: user ? <Navigate to="/" /> : <Login />,
      loader: loginLoader,
    },
    {
      path: "/signup",
      element: user ? <Navigate to="/" /> : <Signup />,
      loader: loginLoader,
    },
    {
      path: "/dates",
      element: user ? <Navigate to="/" /> : <PublicDates />,
      loader: loginLoader,
    },
    {
      path: "/mydates",
      element: user ? <Navigate to="/" /> : <MyDates />,
      loader: loginLoader,
    },
  ]);

  // On page refresh, make a call to DB to restore client-side state about
  // any existing sessions
  useEffect(() => {
    async function getSessionDetails() {
      setIsLoading(true);
      const session = await getSession();
      if (session.error) {
        dispatch({ type: "LOGOUT" });
      } else {
        dispatch({ type: "LOGIN", payload: session });
      }
      setIsLoading(false);
    }

    getSessionDetails();
  }, []);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {!isLoading && <RouterProvider router={router} />}
    </>
  );
}
