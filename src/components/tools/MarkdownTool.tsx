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
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import CopyButton from '../CopyButton';

const { Text } = Typography;

const MONO_FONT = 'Menlo, Monaco, Consolas, "Courier New", monospace';

type ViewMode = 'split' | 'edit' | 'preview';

const SAMPLE_MARKDOWN = [
  '# Markdown 预览',
  '',
  '在左侧输入 Markdown，右侧会**实时渲染**，所有内容都在浏览器本地处理。',
  '',
  '## 常用语法',
  '',
  '- **粗体**、*斜体*、~~删除线~~、`行内代码`',
  '- [链接](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)',
  '- 表格、任务列表（GFM）',
  '',
  '| 功能 | 是否支持 | 说明 |',
  '| --- | --- | --- |',
  '| 表格 | 是 | GFM 扩展语法 |',
  '| 代码高亮 | 是 | highlight.js |',
  '| 导出 HTML | 是 | 工具栏按钮 |',
  '',
  '> 提示：预览使用安全的默认渲染，不会执行 Markdown 中的原始 HTML。',
  '',
  '```js',
  'function greet(name) {',
  '  return `Hello, ${name}!`;',
  '}',
  'console.log(greet("Vyckey"));',
  '```',
  '',
  '- [x] 支持任务列表',
  '- [ ] 支持导出 HTML',
].join('\n');

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
  const {
    token: { colorBorder, colorFillTertiary },
  } = theme.useToken();
  const [value, setValue] = useState(SAMPLE_MARKDOWN);
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
      message.warning('没有可导出的内容');
      return;
    }

    const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Markdown 导出</title>
<style>${EXPORT_CSS}</style>
</head>
<body>
<article class="markdown-preview">${body}</article>
</body>
</html>`;

    downloadFile('markdown.html', html, 'text/html;charset=utf-8');
    message.success('已导出 HTML');
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
          {value || '*（预览区域，左侧输入后实时更新）*'}
        </ReactMarkdown>
      </div>
    </div>
  );

  const editor = (
    <Input.TextArea
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder="# 在这里输入 Markdown"
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
              { label: '分屏', value: 'split' },
              { label: '仅编辑', value: 'edit' },
              { label: '仅预览', value: 'preview' },
            ]}
          />
          <CopyButton value={value} style={{ borderColor: colorBorder }}>
            复制 Markdown
          </CopyButton>
          <Button icon={<DownloadOutlined />} onClick={handleExportMarkdown}>
            下载 .md
          </Button>
          <Button
            icon={<ExportOutlined />}
            disabled={mode === 'edit' || !value}
            onClick={handleExportHtml}>
            导出 HTML
          </Button>
          <Button
            icon={<ClearOutlined />}
            disabled={!value}
            onClick={() => setValue('')}>
            清空
          </Button>
        </Flex>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {characters} 字符 · {lines} 行 · 约 {words} 词
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
