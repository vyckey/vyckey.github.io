export interface ReferenceEntry {
  /** Code, MIME type or command shown in monospace. */
  code: string;
  /** Short technical name (English), may be empty. */
  name: string;
  zh: string;
  en: string;
}

export const HTTP_STATUS_CODES: ReferenceEntry[] = [
  {
    code: '100',
    name: 'Continue',
    zh: '继续发送请求',
    en: 'Continue the request',
  },
  {
    code: '101',
    name: 'Switching Protocols',
    zh: '切换协议',
    en: 'Switching protocols',
  },
  { code: '102', name: 'Processing', zh: '处理中', en: 'Processing' },
  { code: '200', name: 'OK', zh: '请求成功', en: 'Request succeeded' },
  { code: '201', name: 'Created', zh: '资源已创建', en: 'Resource created' },
  {
    code: '202',
    name: 'Accepted',
    zh: '请求已接受，尚未处理完成',
    en: 'Accepted but not processed yet',
  },
  {
    code: '204',
    name: 'No Content',
    zh: '成功，但无返回内容',
    en: 'Succeeded with no content',
  },
  {
    code: '206',
    name: 'Partial Content',
    zh: '部分内容（断点续传）',
    en: 'Partial content (range request)',
  },
  {
    code: '301',
    name: 'Moved Permanently',
    zh: '永久重定向',
    en: 'Permanently moved',
  },
  { code: '302', name: 'Found', zh: '临时重定向', en: 'Temporary redirect' },
  {
    code: '303',
    name: 'See Other',
    zh: '使用 GET 访问其他地址',
    en: 'See another URL with GET',
  },
  {
    code: '304',
    name: 'Not Modified',
    zh: '资源未修改，可使用缓存',
    en: 'Not modified, use the cache',
  },
  {
    code: '307',
    name: 'Temporary Redirect',
    zh: '临时重定向并保持原方法',
    en: 'Temporary redirect, keep the method',
  },
  {
    code: '308',
    name: 'Permanent Redirect',
    zh: '永久重定向并保持原方法',
    en: 'Permanent redirect, keep the method',
  },
  {
    code: '400',
    name: 'Bad Request',
    zh: '请求参数或格式错误',
    en: 'Malformed request',
  },
  {
    code: '401',
    name: 'Unauthorized',
    zh: '未认证或凭证无效',
    en: 'Not authenticated',
  },
  {
    code: '402',
    name: 'Payment Required',
    zh: '需要付费',
    en: 'Payment required',
  },
  {
    code: '403',
    name: 'Forbidden',
    zh: '已认证但无权访问',
    en: 'Authenticated but forbidden',
  },
  {
    code: '404',
    name: 'Not Found',
    zh: '资源不存在',
    en: 'Resource not found',
  },
  {
    code: '405',
    name: 'Method Not Allowed',
    zh: '请求方法不被允许',
    en: 'Method not allowed',
  },
  {
    code: '406',
    name: 'Not Acceptable',
    zh: '无法满足 Accept 头',
    en: 'Cannot satisfy the Accept header',
  },
  {
    code: '408',
    name: 'Request Timeout',
    zh: '请求超时',
    en: 'Request timed out',
  },
  {
    code: '409',
    name: 'Conflict',
    zh: '请求与当前资源状态冲突',
    en: 'Conflicts with the resource state',
  },
  {
    code: '410',
    name: 'Gone',
    zh: '资源已永久删除',
    en: 'Resource permanently gone',
  },
  {
    code: '411',
    name: 'Length Required',
    zh: '缺少 Content-Length',
    en: 'Content-Length required',
  },
  {
    code: '412',
    name: 'Precondition Failed',
    zh: '前置条件不满足',
    en: 'Precondition failed',
  },
  {
    code: '413',
    name: 'Payload Too Large',
    zh: '请求体过大',
    en: 'Payload too large',
  },
  { code: '414', name: 'URI Too Long', zh: '请求地址过长', en: 'URI too long' },
  {
    code: '415',
    name: 'Unsupported Media Type',
    zh: '不支持的媒体类型',
    en: 'Unsupported media type',
  },
  {
    code: '416',
    name: 'Range Not Satisfiable',
    zh: '请求范围无效',
    en: 'Range not satisfiable',
  },
  {
    code: '418',
    name: "I'm a teapot",
    zh: '我是茶壶（愚人节彩蛋）',
    en: "I'm a teapot (April Fools' joke)",
  },
  {
    code: '422',
    name: 'Unprocessable Entity',
    zh: '语义错误，无法处理',
    en: 'Unprocessable entity',
  },
  { code: '423', name: 'Locked', zh: '资源已锁定', en: 'Resource locked' },
  {
    code: '425',
    name: 'Too Early',
    zh: '请求过早，可能被重放',
    en: 'Too early, possible replay',
  },
  {
    code: '426',
    name: 'Upgrade Required',
    zh: '需要升级协议',
    en: 'Protocol upgrade required',
  },
  {
    code: '428',
    name: 'Precondition Required',
    zh: '要求条件请求',
    en: 'Precondition required',
  },
  {
    code: '429',
    name: 'Too Many Requests',
    zh: '请求过于频繁',
    en: 'Too many requests',
  },
  {
    code: '431',
    name: 'Request Header Fields Too Large',
    zh: '请求头过大',
    en: 'Request headers too large',
  },
  {
    code: '451',
    name: 'Unavailable For Legal Reasons',
    zh: '因法律原因不可用',
    en: 'Unavailable for legal reasons',
  },
  {
    code: '500',
    name: 'Internal Server Error',
    zh: '服务器内部错误',
    en: 'Internal server error',
  },
  {
    code: '501',
    name: 'Not Implemented',
    zh: '服务器未实现该功能',
    en: 'Not implemented',
  },
  {
    code: '502',
    name: 'Bad Gateway',
    zh: '网关收到无效响应',
    en: 'Bad gateway',
  },
  {
    code: '503',
    name: 'Service Unavailable',
    zh: '服务暂时不可用',
    en: 'Service unavailable',
  },
  {
    code: '504',
    name: 'Gateway Timeout',
    zh: '网关超时',
    en: 'Gateway timeout',
  },
  {
    code: '505',
    name: 'HTTP Version Not Supported',
    zh: '不支持的 HTTP 版本',
    en: 'HTTP version not supported',
  },
  {
    code: '507',
    name: 'Insufficient Storage',
    zh: '存储空间不足',
    en: 'Insufficient storage',
  },
  {
    code: '508',
    name: 'Loop Detected',
    zh: '检测到无限循环',
    en: 'Loop detected',
  },
  {
    code: '510',
    name: 'Not Extended',
    zh: '需要进一步扩展',
    en: 'Further extensions required',
  },
  {
    code: '511',
    name: 'Network Authentication Required',
    zh: '需要网络认证',
    en: 'Network authentication required',
  },
];

export const MIME_TYPES: ReferenceEntry[] = [
  { code: 'application/json', name: 'JSON', zh: 'JSON 数据', en: 'JSON data' },
  {
    code: 'application/ld+json',
    name: 'JSON-LD',
    zh: '结构化数据 JSON-LD',
    en: 'JSON-LD structured data',
  },
  { code: 'application/xml', name: 'XML', zh: 'XML 数据', en: 'XML data' },
  {
    code: 'application/javascript',
    name: 'JavaScript',
    zh: 'JavaScript 脚本',
    en: 'JavaScript',
  },
  { code: 'application/pdf', name: 'PDF', zh: 'PDF 文档', en: 'PDF document' },
  { code: 'application/zip', name: 'ZIP', zh: 'ZIP 压缩包', en: 'ZIP archive' },
  {
    code: 'application/gzip',
    name: 'GZIP',
    zh: 'GZIP 压缩包',
    en: 'GZIP archive',
  },
  {
    code: 'application/wasm',
    name: 'WebAssembly',
    zh: 'WebAssembly 模块',
    en: 'WebAssembly module',
  },
  {
    code: 'application/octet-stream',
    name: 'Binary',
    zh: '任意二进制数据',
    en: 'Arbitrary binary data',
  },
  {
    code: 'application/x-www-form-urlencoded',
    name: 'Form',
    zh: 'URL 编码表单',
    en: 'URL-encoded form',
  },
  {
    code: 'multipart/form-data',
    name: 'Multipart',
    zh: '多部分表单（文件上传）',
    en: 'Multipart form (file upload)',
  },
  {
    code: 'application/x-ndjson',
    name: 'NDJSON',
    zh: '换行分隔 JSON',
    en: 'Newline-delimited JSON',
  },
  { code: 'text/plain', name: 'Plain text', zh: '纯文本', en: 'Plain text' },
  { code: 'text/html', name: 'HTML', zh: 'HTML 页面', en: 'HTML document' },
  { code: 'text/css', name: 'CSS', zh: 'CSS 样式表', en: 'CSS stylesheet' },
  {
    code: 'text/csv',
    name: 'CSV',
    zh: '逗号分隔数据',
    en: 'Comma-separated values',
  },
  {
    code: 'text/markdown',
    name: 'Markdown',
    zh: 'Markdown 文档',
    en: 'Markdown document',
  },
  { code: 'image/png', name: 'PNG', zh: 'PNG 图片', en: 'PNG image' },
  { code: 'image/jpeg', name: 'JPEG', zh: 'JPEG 图片', en: 'JPEG image' },
  { code: 'image/gif', name: 'GIF', zh: 'GIF 图片', en: 'GIF image' },
  { code: 'image/webp', name: 'WebP', zh: 'WebP 图片', en: 'WebP image' },
  { code: 'image/svg+xml', name: 'SVG', zh: 'SVG 矢量图', en: 'SVG image' },
  { code: 'image/avif', name: 'AVIF', zh: 'AVIF 图片', en: 'AVIF image' },
  { code: 'image/x-icon', name: 'ICO', zh: '网站图标', en: 'Favicon' },
  { code: 'audio/mpeg', name: 'MP3', zh: 'MP3 音频', en: 'MP3 audio' },
  { code: 'audio/ogg', name: 'OGG', zh: 'OGG 音频', en: 'OGG audio' },
  { code: 'audio/wav', name: 'WAV', zh: 'WAV 音频', en: 'WAV audio' },
  { code: 'video/mp4', name: 'MP4', zh: 'MP4 视频', en: 'MP4 video' },
  { code: 'video/webm', name: 'WebM', zh: 'WebM 视频', en: 'WebM video' },
  { code: 'font/woff', name: 'WOFF', zh: 'WOFF 字体', en: 'WOFF font' },
  { code: 'font/woff2', name: 'WOFF2', zh: 'WOFF2 字体', en: 'WOFF2 font' },
  { code: 'font/ttf', name: 'TTF', zh: 'TrueType 字体', en: 'TrueType font' },
  { code: 'font/otf', name: 'OTF', zh: 'OpenType 字体', en: 'OpenType font' },
];

export const GIT_COMMANDS: ReferenceEntry[] = [
  {
    code: 'git init',
    name: '',
    zh: '在当前目录初始化仓库',
    en: 'Initialize a repository',
  },
  {
    code: 'git clone <url>',
    name: '',
    zh: '克隆远程仓库',
    en: 'Clone a remote repository',
  },
  {
    code: 'git status',
    name: '',
    zh: '查看工作区与暂存区状态',
    en: 'Show working tree status',
  },
  {
    code: 'git add <file>',
    name: '',
    zh: '把文件加入暂存区',
    en: 'Stage a file',
  },
  {
    code: 'git add -p',
    name: '',
    zh: '交互式选择要暂存的代码块',
    en: 'Stage changes hunk by hunk',
  },
  {
    code: 'git commit -m "msg"',
    name: '',
    zh: '提交暂存区并填写说明',
    en: 'Commit staged changes',
  },
  {
    code: 'git commit --amend',
    name: '',
    zh: '修改最近一次提交',
    en: 'Amend the last commit',
  },
  {
    code: 'git log --oneline --graph',
    name: '',
    zh: '以图形方式查看提交历史',
    en: 'Show a compact commit graph',
  },
  {
    code: 'git diff',
    name: '',
    zh: '查看尚未暂存的改动',
    en: 'Show unstaged changes',
  },
  {
    code: 'git diff --staged',
    name: '',
    zh: '查看已暂存的改动',
    en: 'Show staged changes',
  },
  {
    code: 'git branch -a',
    name: '',
    zh: '列出本地和远程分支',
    en: 'List local and remote branches',
  },
  {
    code: 'git switch -c <branch>',
    name: '',
    zh: '创建并切换到新分支',
    en: 'Create and switch to a branch',
  },
  {
    code: 'git switch <branch>',
    name: '',
    zh: '切换到已有分支',
    en: 'Switch branches',
  },
  {
    code: 'git merge <branch>',
    name: '',
    zh: '把指定分支合并到当前分支',
    en: 'Merge a branch into the current one',
  },
  {
    code: 'git rebase <branch>',
    name: '',
    zh: '把当前分支变基到指定分支',
    en: 'Rebase onto another branch',
  },
  {
    code: 'git pull --rebase',
    name: '',
    zh: '拉取远程更新并变基',
    en: 'Fetch and rebase',
  },
  {
    code: 'git push -u origin <branch>',
    name: '',
    zh: '推送分支并设置上游',
    en: 'Push and set the upstream',
  },
  {
    code: 'git remote -v',
    name: '',
    zh: '查看远程仓库地址',
    en: 'Show remote URLs',
  },
  {
    code: 'git stash',
    name: '',
    zh: '临时保存当前改动',
    en: 'Stash current changes',
  },
  {
    code: 'git stash pop',
    name: '',
    zh: '恢复最近一次 stash',
    en: 'Restore the latest stash',
  },
  {
    code: 'git restore <file>',
    name: '',
    zh: '撤销工作区中的文件改动',
    en: 'Discard working tree changes',
  },
  {
    code: 'git reset --soft HEAD~1',
    name: '',
    zh: '撤销最近一次提交，保留改动',
    en: 'Undo the last commit, keep changes',
  },
  {
    code: 'git cherry-pick <commit>',
    name: '',
    zh: '把指定提交应用到当前分支',
    en: 'Apply a commit to the current branch',
  },
  {
    code: 'git tag -a v1.0.0 -m "msg"',
    name: '',
    zh: '创建附注标签',
    en: 'Create an annotated tag',
  },
];

export interface AsciiEntry {
  decimal: number;
  hex: string;
  binary: string;
  char: string;
  entity: string;
}

const HTML_ENTITIES: Record<number, string> = {
  34: '&quot;',
  38: '&amp;',
  39: '&#39;',
  60: '&lt;',
  62: '&gt;',
};

export const ASCII_TABLE: AsciiEntry[] = Array.from(
  { length: 95 },
  (_, index) => {
    const decimal = index + 32;
    return {
      decimal,
      hex: decimal.toString(16).toUpperCase().padStart(2, '0'),
      binary: decimal.toString(2).padStart(8, '0'),
      char: String.fromCharCode(decimal),
      entity: HTML_ENTITIES[decimal] ?? '',
    };
  }
);
