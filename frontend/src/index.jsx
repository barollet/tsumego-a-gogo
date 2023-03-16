import { StrictMode } from 'react';
import { createRoot } from "react-dom/client";

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
  
import 'bootstrap/dist/css/bootstrap.min.css';

import Root from "./routes/root";
import Login from './routes/login';
import CollectionEdit from './routes/edit-collection';
import CollectionsEdit from './routes/edit-collections';

import ErrorPage from "./routes/error-page";

const router = createBrowserRouter([
  {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <Login />,
},
  {
    path: "collection/:collectionId/edit",
    element: <CollectionEdit />,
  },
  {
    path: "collection/edit",
    element: <CollectionsEdit />,
  },
]);

function App() {
    return (
     <h1>Hello world!</h1>
    );
  }


createRoot(document.getElementById("app")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );