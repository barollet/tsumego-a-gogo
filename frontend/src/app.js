import CollectionView from './collection_view.js';

export default function App() {
    return (
      <CollectionView />
    );
  }

const ReactDOM = window.ReactDOM;


const container = document.getElementById('app');
const root = ReactDOM.createRoot(container); // createRoot(container!) if you use TypeScript

root.render(<App />);