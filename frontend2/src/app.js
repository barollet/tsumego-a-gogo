import {React} from './config.js';
import {ReactRouter} from './config.js';

import CollectionView from './collection_view.js';

const router2 = window.ReactRouterDOM.createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);

export default function App() {
    return (
      <React.StrictMode>
        <ReactRouter.RouterProvider router={router2} />
      </React.StrictMode>
    );
  }


const container = document.getElementById('app');
const root = window.ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<App />);