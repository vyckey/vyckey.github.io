import './App.css';
import './i18n';
import { RouterProvider } from 'react-router-dom';
import router from './router/Router';

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
