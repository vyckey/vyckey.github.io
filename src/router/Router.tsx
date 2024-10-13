import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';

const router = createBrowserRouter([
  {
    path: '/home',
    element: <Homepage />,
  },
]);

export default router;
