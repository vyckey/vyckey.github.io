import React, { useRef, useState } from 'react';
import {
  ClearOutlined,
  DownloadOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import {
  Button,
  Flex,
  Input,
  Segmented,
  Splitter,
  Typography,
  message,
  theme,
} from 'antd';
import { useTranslation } from 'react-i18next';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import CopyButton from '../CopyButton';

const { Text } = Typography;

const MONO_FONT = 'Menlo, Monaco, Consolas, "Courier New", monospace';

type ViewMode = 'split' | 'edit' | 'preview';

const EXPORT_CSS = `
body { margin: 0; padding: 40px 16px; background: #fff; }
article { max-width: 820px; margin: 0 auto; color: #1f2328; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif; font-size: 16px; line-height: 1.75; word-wrap: break-word; }
article h1, article h2, article h3, article h4 { margin: 1.4em 0 .6em; font-weight: 600; line-height: 1.3; }
article h1 { font-size: 2em; padding-bottom: .3em; border-bottom: 1px solid #eaecef; }
article h2 { font-size: 1.5em; padding-bottom: .3em; border-bottom: 1px solid #eaecef; }
article h3 { font-size: 1.25em; }
article p, article ul, article ol, article blockquote, article table, article pre { margin: 0 0 16px; }
article ul, article ol { padding-left: 2em; }
article a { color: #0969da; }
article code { background: #f2f3f5; padding: .15em .4em; border-radius: 4px; font-family: ${MONO_FONT}; font-size: .88em; }
article pre { background: #f6f8fa; padding: 14px 16px; border-radius: 8px; overflow: auto; }
article pre code { background: none; padding: 0; font-size: 13px; }
article blockquote { padding: 0 1em; color: #59636e; border-left: 4px solid #d1d9e0; }
article table { border-collapse: collapse; display: block; overflow: auto; }
article th, article td { border: 1px solid #d1d9e0; padding: 6px 13px; }
article th { background: #f6f8fa; }
article img { max-width: 100%; }
article hr { border: none; border-top: 1px solid #d1d9e0; margin: 24px 0; }
article input[type="checkbox"] { margin-right: 6px; }
.hljs-keyword, .hljs-selector-tag, .hljs-literal { color: #cf222e; }
.hljs-string, .hljs-attr { color: #0a3069; }
.hljs-comment { color: #6e7781; }
.hljs-number, .hljs-built_in { color: #0550ae; }
.hljs-title, .hljs-function .hljs-title { color: #8250df; }
`;

const markdownComponents: Components = {
  a({ node: _node, children, ...rest }) {
    return (
      <a {...rest} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    );
  },
  code({ node: _node, className, children, ...rest }) {
    const match = /language-([\w+#-]+)/.exec(className || '');
    if (!match) {
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
    }

    const source = String(children).replace(/\n$/, '');
    try {
      const highlighted = hljs.highlight(source, {
        language: match[1],
        ignoreIllegals: true,
      }).value;
      return (
        <code
          className={className}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      );
    } catch {
      return <code className={className}>{children}</code>;
    }
  },
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const MarkdownTool: React.FC = () => {
  const { t } = useTranslation();
  const {
    token: { colorBorder, colorFillTertiary },
  } = theme.useToken();
  const [value, setValue] = useState(() =>
    t('markdown.sample', { returnObjects: true }).join('\n')
  );
  const [mode, setMode] = useState<ViewMode>('split');
  const previewRef = useRef<HTMLDivElement>(null);

  const characters = value.length;
  const lines = value ? value.split('\n').length : 0;
  const words = (value.match(/[\u4e00-\u9fa5]|[A-Za-z0-9_'-]+/g) ?? []).length;

  function handleExportMarkdown() {
    downloadFile('markdown.md', value, 'text/markdown;charset=utf-8');
  }

  function handleExportHtml() {
    const body = previewRef.current?.innerHTML;
    if (!body) {
      message.warning(t('markdown.exportEmpty'));
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="${document.documentElement.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t('markdown.exportTitle')}</title>
<style>${EXPORT_CSS}</style>
</head>
<body>
<article class="markdown-preview">${body}</article>
</body>
</html>`;

    downloadFile('markdown.html', html, 'text/html;charset=utf-8');
    message.success(t('markdown.exported'));
  }

  const preview = (
    <div
      style={{
        height: '100%',
        padding: '8px 20px',
        overflow: 'auto',
        background: '#fff',
      }}>
      <div ref={previewRef} className="markdown-preview">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={markdownComponents}>
          {value || `*${t('markdown.previewPlaceholder')}*`}
        </ReactMarkdown>
      </div>
    </div>
  );

  const editor = (
    <Input.TextArea
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={t('markdown.editorPlaceholder')}
      spellCheck={false}
      style={{
        height: '100%',
        padding: 16,
        border: 'none',
        borderRadius: 0,
        resize: 'none',
        background: colorFillTertiary,
        fontFamily: MONO_FONT,
        fontSize: 13,
        lineHeight: 1.7,
      }}
    />
  );

  const panelStyle: React.CSSProperties = {
    height: 600,
    border: `1px solid ${colorBorder}`,
    borderRadius: 8,
    overflow: 'hidden',
  };

  return (
    <Flex vertical gap={12}>
      <Flex wrap gap={8} align="center" justify="space-between">
        <Flex wrap gap={8} align="center">
          <Segmented
            value={mode}
            onChange={next => setMode(next as ViewMode)}
            options={[
              { label: t('markdown.mode.split'), value: 'split' },
              { label: t('markdown.mode.edit'), value: 'edit' },
              { label: t('markdown.mode.preview'), value: 'preview' },
            ]}
          />
          <CopyButton value={value} style={{ borderColor: colorBorder }}>
            {t('markdown.copyMarkdown')}
          </CopyButton>
          <Button icon={<DownloadOutlined />} onClick={handleExportMarkdown}>
            {t('markdown.downloadMarkdown')}
          </Button>
          <Button
            icon={<ExportOutlined />}
            disabled={mode === 'edit' || !value}
            onClick={handleExportHtml}>
            {t('markdown.exportHtml')}
          </Button>
          <Button
            icon={<ClearOutlined />}
            disabled={!value}
            onClick={() => setValue('')}>
            {t('markdown.clear')}
          </Button>
        </Flex>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('markdown.stats', { characters, lines, words })}
        </Text>
      </Flex>

      {mode === 'split' ? (
        <Splitter style={panelStyle}>
          <Splitter.Panel defaultSize="50%" min="20%">
            {editor}
          </Splitter.Panel>
          <Splitter.Panel>{preview}</Splitter.Panel>
        </Splitter>
      ) : (
        <div style={panelStyle}>{mode === 'edit' ? editor : preview}</div>
      )}
    </Flex>
  );
};

export default MarkdownTool;
