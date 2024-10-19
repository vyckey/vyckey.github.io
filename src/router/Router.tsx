import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ToolsLayout from '../pages/ToolsLayout';
import EncryptionTabs from '../components/tools/Encryption';
import QRCodeGenerator from '../components/tools/QRCodeGenerator';
import TimestampPanel from '../components/tools/Timestamp';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Homepage />,
  },
  {
    path: 'home',
    element: <Homepage />,
  },
  {
    path: 'tools',
    element: <ToolsLayout />,
    children: [
      {
        path: 'timestamp',
        element: <TimestampPanel />,
      },
      {
        path: 'encryption',
        element: <EncryptionTabs />,
      },
      {
        path: 'qrcode',
        element: <QRCodeGenerator />,
      },
    ],
  },
]);

export default router;
