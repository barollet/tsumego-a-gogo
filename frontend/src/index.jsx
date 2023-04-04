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
import TsumegoEdit from './routes/edit-tsumego';

import ErrorPage from "./routes/error-page";
import ChooseCollection from './routes/choose-collection';

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
    path: "collection/edit/:collectionId",
    element: <CollectionEdit />,
  },
  {
    path: "collection/edit",
    element: <CollectionsEdit />,
  },
  {
    path: "tsumego/edit/:tsumegoId",
    element: <TsumegoEdit />,
  },
  {
    path: "play/collections",
    element: <ChooseCollection />,
  },
]);

createRoot(document.getElementById("app")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );