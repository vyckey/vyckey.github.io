import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ToolsLayout from '../pages/ToolsLayout';
import EncryptionTabs from '../components/tools/Encryption';
import QRCodeGenerator from '../components/tools/QRCodeGenerator';
import TimestampPanel from '../components/tools/Timestamp';
import TextDiffView from '../components/tools/TextDiffView';
import TimerPanel from '../components/tools/TimerPanel';
import JsonTools from '../components/tools/JsonTools';
import PasswordGenerator from '../components/tools/PasswordGenerator';

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
        path: 'timer',
        element: <TimerPanel />,
      },
      {
        path: 'textdiff',
        element: <TextDiffView />,
      },
      {
        path: 'json',
        element: <JsonTools />,
      },
      {
        path: 'encryption',
        element: <EncryptionTabs />,
      },
      {
        path: 'password',
        element: <PasswordGenerator />,
      },
      {
        path: 'qrcode',
        element: <QRCodeGenerator />,
      },
    ],
  },
]);

export default router;
