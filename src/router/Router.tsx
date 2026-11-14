import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Homepage from '../pages/Homepage';
import ToolsLayout from '../pages/ToolsLayout';
import ToolsIndex from '../pages/ToolsIndex';
import NotFound from '../pages/NotFound';
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
import MarkdownTool from '../components/tools/MarkdownTool';
import UuidGenerator from '../components/tools/UuidGenerator';
import ColorTool from '../components/tools/ColorTool';
import CidrTool from '../components/tools/CidrTool';
import UrlTool from '../components/tools/UrlTool';
import FileHashTool from '../components/tools/FileHashTool';
import DateCalcTool from '../components/tools/DateCalcTool';
import TotpTool from '../components/tools/TotpTool';
import TextTools from '../components/tools/TextTools';
import ReferenceTool from '../components/tools/ReferenceTool';

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
        index: true,
        element: <ToolsIndex />,
      },
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
        path: 'markdown',
        element: <MarkdownTool />,
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
      {
        path: 'uuid',
        element: <UuidGenerator />,
      },
      {
        path: 'color',
        element: <ColorTool />,
      },
      {
        path: 'cidr',
        element: <CidrTool />,
      },
      {
        path: 'url',
        element: <UrlTool />,
      },
      {
        path: 'filehash',
        element: <FileHashTool />,
      },
      {
        path: 'datecalc',
        element: <DateCalcTool />,
      },
      {
        path: 'totp',
        element: <TotpTool />,
      },
      {
        path: 'texttools',
        element: <TextTools />,
      },
      {
        path: 'reference',
        element: <ReferenceTool />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
