import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ToolsLayout from '../pages/ToolsLayout';
import EncryptionTabs from '../components/tools/Encryption';
import QRCodeGenerator from '../components/tools/QRCodeGenerator';
import TimestampPanel from '../components/tools/Timestamp';
import TimerPanel from '../components/tools/TimerPanel';
import JsonTools from '../components/tools/JsonTools';
import PasswordGenerator from '../components/tools/PasswordGenerator';
import TextDiffTool from '../components/tools/TextDiffTool';
import IPAddressView from '../components/tools/IPAddressView';
import EncoderDecoderTabs from '../components/tools/EncoderDecoder';
import CronTool from '../components/tools/CronTool';
import RegexTool from '../components/tools/RegexTool';

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
    path: 'tools/password',
    element: <PasswordGenerator />,
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
        element: <TextDiffTool />,
      },
      {
        path: 'json',
        element: <JsonTools />,
      },
      {
        path: 'encoder_decoder',
        element: <EncoderDecoderTabs />,
      },
      {
        path: 'encryption',
        element: <EncryptionTabs />,
      },
      {
        path: 'qrcode',
        element: <QRCodeGenerator />,
      },
      {
        path: 'ipaddress',
        element: <IPAddressView />,
      },
      {
        path: 'cron',
        element: <CronTool />,
      },
      {
        path: 'regex',
        element: <RegexTool />,
      },
    ],
  },
]);

export default router;
