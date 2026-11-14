import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Flex, Spin } from 'antd';
import Homepage from '../pages/Homepage';
import ToolsLayout from '../pages/ToolsLayout';
import ToolsIndex from '../pages/ToolsIndex';
import NotFound from '../pages/NotFound';

// Tool pages are split into their own chunks: opening the home page or the
// tools index no longer downloads every tool (and its libraries).
const EncryptionTabs = lazy(() => import('../components/tools/Encryption'));
const QRCodeGenerator = lazy(
  () => import('../components/tools/QRCodeGenerator')
);
const TimestampPanel = lazy(() => import('../components/tools/Timestamp'));
const TimerPanel = lazy(() => import('../components/tools/TimerPanel'));
const JsonTools = lazy(() => import('../components/tools/JsonTools'));
const PasswordGenerator = lazy(
  () => import('../components/tools/PasswordGenerator')
);
const TextDiffTool = lazy(() => import('../components/tools/TextDiffTool'));
const IPAddressView = lazy(() => import('../components/tools/IPAddressView'));
const EncoderDecoderTabs = lazy(
  () => import('../components/tools/EncoderDecoder')
);
const CronTool = lazy(() => import('../components/tools/CronTool'));
const RegexTool = lazy(() => import('../components/tools/RegexTool'));
const MarkdownTool = lazy(() => import('../components/tools/MarkdownTool'));
const UuidGenerator = lazy(() => import('../components/tools/UuidGenerator'));
const ColorTool = lazy(() => import('../components/tools/ColorTool'));
const CidrTool = lazy(() => import('../components/tools/CidrTool'));
const UrlTool = lazy(() => import('../components/tools/UrlTool'));
const FileHashTool = lazy(() => import('../components/tools/FileHashTool'));
const DateCalcTool = lazy(() => import('../components/tools/DateCalcTool'));
const TotpTool = lazy(() => import('../components/tools/TotpTool'));
const TextTools = lazy(() => import('../components/tools/TextTools'));
const ReferenceTool = lazy(() => import('../components/tools/ReferenceTool'));
const ImageTool = lazy(() => import('../components/tools/ImageTool'));
const ConverterTool = lazy(() => import('../components/tools/ConverterTool'));
const CssTool = lazy(() => import('../components/tools/CssTool'));

const RouteFallback: React.FC = () => (
  <Flex align="center" justify="center" style={{ padding: 64 }}>
    <Spin />
  </Flex>
);

type LazyPage = React.LazyExoticComponent<React.ComponentType>;

/** Keep the layout mounted while a tool chunk loads. */
function page(Component: LazyPage) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Component />
    </Suspense>
  );
}

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
    element: page(PasswordGenerator),
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
        element: page(TimestampPanel),
      },
      {
        path: 'timer',
        element: page(TimerPanel),
      },
      {
        path: 'textdiff',
        element: page(TextDiffTool),
      },
      {
        path: 'markdown',
        element: page(MarkdownTool),
      },
      {
        path: 'json',
        element: page(JsonTools),
      },
      {
        path: 'encoder_decoder',
        element: page(EncoderDecoderTabs),
      },
      {
        path: 'encryption',
        element: page(EncryptionTabs),
      },
      {
        path: 'qrcode',
        element: page(QRCodeGenerator),
      },
      {
        path: 'ipaddress',
        element: page(IPAddressView),
      },
      {
        path: 'cron',
        element: page(CronTool),
      },
      {
        path: 'regex',
        element: page(RegexTool),
      },
      {
        path: 'uuid',
        element: page(UuidGenerator),
      },
      {
        path: 'color',
        element: page(ColorTool),
      },
      {
        path: 'cidr',
        element: page(CidrTool),
      },
      {
        path: 'url',
        element: page(UrlTool),
      },
      {
        path: 'filehash',
        element: page(FileHashTool),
      },
      {
        path: 'datecalc',
        element: page(DateCalcTool),
      },
      {
        path: 'totp',
        element: page(TotpTool),
      },
      {
        path: 'texttools',
        element: page(TextTools),
      },
      {
        path: 'reference',
        element: page(ReferenceTool),
      },
      {
        path: 'image',
        element: page(ImageTool),
      },
      {
        path: 'converter',
        element: page(ConverterTool),
      },
      {
        path: 'css',
        element: page(CssTool),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
