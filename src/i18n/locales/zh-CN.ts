// Simplified Chinese resources. This file is the source of truth for keys:
// `en-US.ts` must expose the exact same structure.

const common = {
  copy: '复制',
  copySuccess: '复制成功',
  copyFailed: '复制失败',
  copyEmpty: '内容为空',
  start: '▷ 开始',
  pause: '□ 暂停',
  clear: '清空',
  reset: '重置',
  swap: '↕ 交换',
  encode: '编码',
  decode: '解码',
  uppercase: '大写',
  input: '输入',
  output: '输出',
  outputPlaceholder: '输出结果',
  seconds: '秒',
  milliseconds: '毫秒',
};

const language = {
  label: '语言',
};

const layout = {
  allTools: '全部工具',
};

const toolsIndex = {
  title: '开发者工具箱',
  subtitle: '纯浏览器运行、不上传数据的在线小工具，选择下面的卡片即可使用',
  searchPlaceholder: '搜索工具，如 Base64、时间戳、JSON、正则',
  privacy: '所有计算均在本地完成，内容不会上传到服务器',
  noResults: '没有找到与「{{keyword}}」匹配的工具',
  noResultsHint: '试试搜索「编码」「时间」「JSON」等关键词',
  toolCount: '{{count}} 个工具',
};

const notFound = {
  subtitle: '页面不存在，或者链接已经失效',
  backHome: '返回首页',
  browseTools: '浏览全部工具',
};

const homepage = {
  menu: {
    home: '首页',
    tools: '开发者工具',
  },
  hero: {
    eyebrow: '开发者 · 构建者 · 探索者',
    greeting: '你好，我是',
    name: 'Vyckey.',
    line1: '我构建',
    line2: '面向 Web 的作品。',
    description:
      '全栈开发者，热爱软件工程、系统架构与网络安全。喜欢把复杂的想法变成优雅的解决方案。',
    exploreWork: '查看我的作品',
    getInTouch: '联系我',
    basedOn: '源于好奇。',
    drivenBy: '成于工程。',
  },
  terminal: {
    window: 'about.me — zsh',
    language: 'ZH',
    whoami: 'whoami',
    interests: 'cat interests.txt',
    mission: 'echo $MISSION',
    role: '全栈开发者',
    interest1: '软件工程',
    interest2: '系统架构',
    interest3: '应用安全',
    missionOutput: '构建有意义的东西。',
    user: 'USER: VYCKEY',
    session: 'SESSION: ACTIVE',
  },
  about: {
    index: '01 / 我做什么',
    heading: '好奇驱动创造。',
    intro: '探索技术、解决问题，并构建真正有价值的东西。',
  },
  expertise: {
    fullStack: {
      title: '全栈开发',
      description: '用清晰的架构与用心的体验，构建现代化的 Web 应用。',
    },
    architecture: {
      title: '系统架构',
      description: '设计可扩展的后端系统、分布式服务与可靠的数据架构。',
    },
    security: {
      title: '网络安全',
      description: '研究应用安全、身份认证、隐私保护与安全软件工程。',
    },
  },
  tech: {
    index: '02 / 技术栈',
    heading: '我使用的工具。',
    intro: '一组帮助我把想法变成现实的技术。',
  },
  contact: {
    index: '03 / 联系我',
    heading: '有个有趣的想法？',
    description: '我始终乐于交流想法、探索技术，并一起构建新的东西。',
    action: '打个招呼',
  },
  footer: {
    tagline: '用代码构建未来。',
  },
};

const tool = {
  categories: {
    time: '时间日期',
    text: '文本处理',
    code: '编码与加密',
    data: '数据格式',
    network: '网络工具',
    generator: '生成器',
  },
  registry: {
    timestamp: {
      label: '时间戳',
      description: 'Unix 时间戳与日期互转，支持多时区',
    },
    timer: {
      label: '计时器',
      description: '倒计时与正计时，支持暂停和重置',
    },
    cron: {
      label: 'Cron 表达式',
      description: 'Cron 表达式解析与下次执行时间预测',
    },
    textdiff: {
      label: '文本对比',
      description: '逐行对比两段文本，高亮增删差异',
    },
    regex: {
      label: '正则表达式',
      description: '正则匹配、高亮、替换与语法速查',
    },
    markdown: {
      label: 'Markdown 预览',
      description: '实时预览 Markdown，支持 GFM 表格与导出 HTML',
    },
    encoder_decoder: {
      label: '编码/解码',
      description: 'Base64、URL、HTML 实体、JWT、哈希、进制转换',
    },
    encryption: {
      label: '加密/解密',
      description: 'MD5、SHA256、Base64、RSA 加解密',
    },
    json: {
      label: 'JSON',
      description: 'JSON 格式化、校验、排序与可视化编辑',
    },
    ipaddress: {
      label: 'IP 地址查询',
      description: 'IPv4/IPv6 校验与公网 IP 归属地查询',
    },
    qrcode: {
      label: '二维码生成',
      description: '生成带颜色和 Logo 的二维码，支持下载',
    },
    password: {
      label: '密码生成',
      description: '生成高强度随机密码并评估密码强度',
    },
  },
};

const timestamp = {
  currentTitle: '当前时间戳',
  unitSecond: '秒',
  unitMillisecond: '毫秒',
  switchTo: '↺切换{{unit}}',
  invalidTimestamp: '无效的时间戳',
  invalidDate: '无效的日期时间，请使用 YYYY-MM-DD HH:mm:ss 格式',
  timestampToDate: '时间戳转日期时间',
  dateToTimestamp: '日期时间转时间戳',
  units: {
    millis: '毫秒(ms)',
    seconds: '秒(s)',
  },
  timestampRequired: '请输入时间戳',
  dateRequired: '请输入YYYY-MM-DD HH:mm:ss格式日期',
  convert: '转换',
};

const timer = {
  countdownTitle: '倒计时',
  stopwatchTitle: '计时器',
  targetTime: '设定时间',
  finished: '已结束！',
  units: {
    year: '年',
    month: '月',
    day: '日',
    hour: '时',
    minute: '分',
    second: '秒',
  },
};

const textdiff = {
  diff: 'Diff文本',
  backToEdit: '返回编辑',
  clear: '清除',
  sideBySide: '左右对比',
  lineByLine: '分行对比',
  originalPlaceholder: '请输入原始文本',
  currentPlaceholder: '请输入当前文本',
};

const markdown = {
  sample: [
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
  ],
  exportEmpty: '没有可导出的内容',
  exportTitle: 'Markdown 导出',
  exported: '已导出 HTML',
  previewPlaceholder: '（预览区域，左侧输入后实时更新）',
  editorPlaceholder: '# 在这里输入 Markdown',
  mode: {
    split: '分屏',
    edit: '仅编辑',
    preview: '仅预览',
  },
  copyMarkdown: '复制 Markdown',
  downloadMarkdown: '下载 .md',
  exportHtml: '导出 HTML',
  clear: '清空',
  stats: '{{characters}} 字符 · {{lines}} 行 · 约 {{words}} 词',
};

const encoder = {
  tabs: {
    case: '大小写转换',
    base64: 'Base64',
    url: 'URL 编解码',
    html: 'HTML 实体',
    hex: 'Hex / Unicode',
    radix: '进制转换',
    jwt: 'JWT 解析',
    hash: '哈希计算',
  },
  panel: {
    swap: '交换（输出 → 输入）',
  },
  case: {
    inputPlaceholder: '请输入需要转换大小写的文本',
    outputPlaceholder: '转换结果',
    upper: '转为大写',
    lower: '转为小写',
  },
  base64: {
    encodePlaceholder: '请输入需要编码的文本（支持中文和 Emoji）',
    decodePlaceholder: '请输入需要解码的 Base64 字符串',
    urlSafe: 'URL 安全（使用 - _，去掉 =）',
  },
  url: {
    encodePlaceholder: '请输入需要 URL 编码的文本或链接',
    decodePlaceholder: '请输入需要 URL 解码的内容，如 %E4%BD%A0%E5%A5%BD',
    formMode: '表单模式（空格 ↔ +）',
  },
  html: {
    encodePlaceholder: '请输入需要转义的 HTML 文本，如 <div class="box">',
    decodePlaceholder: '请输入需要反转义的 HTML 实体，如 &lt;div&gt;',
    escape: '转义',
    unescape: '反转义',
  },
  hex: {
    unicodeEncodePlaceholder: '请输入需要转成 Unicode 转义的文本',
    unicodeDecodePlaceholder: '请输入 Unicode 转义，如 \\u4F60\\u597D',
    hexEncodePlaceholder: '请输入需要转成十六进制的文本（按 UTF-8 字节）',
    hexDecodePlaceholder: '请输入十六进制内容，如 E4 BD A0 E5 A5 BD',
    formatHex: '十六进制',
    formatUnicode: 'Unicode 转义',
    separatorSpace: '空格分隔',
    separatorNone: '无分隔',
    separatorComma: '逗号分隔',
  },
  radix: {
    inputPlaceholder:
      '请输入 {{radix}} 进制数值（支持 0x / 0b / 0o 前缀和负数）',
    outputPlaceholder: '各进制转换结果',
    hint: '使用 BigInt 计算，不受 JavaScript 安全整数范围限制',
    line: '{{label}}：{{value}}',
    binary: '二进制 (2)',
    octal: '八进制 (8)',
    decimal: '十进制 (10)',
    hex: '十六进制 (16)',
    base36: '三十六进制 (36)',
  },
  hash: {
    inputPlaceholder: '请输入需要计算哈希的文本',
    outputPlaceholder: '哈希结果（Hexadecimal）',
  },
  jwt: {
    tokenPlaceholder:
      '粘贴 JWT，可带 Bearer 前缀，例如 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    hint: 'JWT 由 Header、Payload、Signature 三段 Base64URL 组成，解析和校验都在浏览器本地完成。',
    unknownAlg: '未知',
    header: 'Header',
    payload: 'Payload',
    signature: 'Signature',
    verify: '签名校验',
    secretPlaceholder: 'HS256 密钥（仅在本地计算）',
    verifyButton: '校验',
    valid: '签名有效',
    invalid: '签名不匹配',
    hs256Only: '当前仅支持校验 HS256 签名',
    empty: '（空）',
    claims: {
      exp: '过期时间 (exp)',
      nbf: '生效时间 (nbf)',
      iat: '签发时间 (iat)',
    },
  },
  errors: {
    base64InvalidChar: 'Base64 内容不合法：包含无效字符',
    base64InvalidLength: 'Base64 内容不合法：长度错误',
    base64DecodeFailed: 'Base64 解码失败：内容不是有效的 Base64 或 UTF-8 文本',
    urlEncodeFailed: 'URL 编码失败：文本包含无效的 Unicode 字符',
    urlDecodeFailed: 'URL 解码失败：包含无效的百分号转义序列',
    hexOddLength: 'Hex 长度必须为偶数：每个字节由两个十六进制字符组成',
    hexInvalid: 'Hex 内容不合法：只能包含 0-9 和 a-f',
    hexDecodeFailed: 'Hex 解码失败：字节序列不是有效的 UTF-8 文本',
    radixRange: '进制必须在 2 到 36 之间',
    numberRequired: '请输入需要转换的数值',
    digitInvalid: '字符「{{char}}」不是 {{radix}} 进制的有效数字',
    jwtSegmentEmpty: '{{label}} 为空',
    jwtSegmentInvalidJson: '{{label}} 不是有效的 Base64URL 编码 JSON',
    jwtSegmentNotObject: '{{label}} 必须是 JSON 对象',
    jwtFormat: 'JWT 格式错误：应由「.」分隔的 3 段组成',
    jwtSecretRequired: '请输入用于校验的密钥',
    jwtHs256Only: '仅支持校验 HS256 签名的 JWT',
  },
};

const encryption = {
  tabs: {
    md5: 'MD5签名',
    sha256: 'SHA256签名',
    base64: 'Base64编码/解码',
    rsa: 'RSA加密/解密',
  },
  outputPlaceholder: '输出文本',
  md5: {
    required: '请输入需要进行MD5的文本！',
    placeholder: '请输入需要进行MD5的文本',
    lower: 'MD5 32位小写',
    upper: 'MD5 32位大写',
  },
  sha256: {
    required: '请输入需要进行SHA256的文本！',
    placeholder: '请输入需要进行SHA256的文本',
    lower: 'SHA256 64位小写',
    upper: 'SHA256 64位大写',
  },
  base64: {
    required: '请输入需要进行编码或解码的文本！',
    placeholder: '请输入需要进行编码或解码的文本',
    encodeFailed: '编码失败！',
    decodeFailed: '解码失败！',
  },
  rsa: {
    required: '请输入需要进行加密或解密的文本！',
    placeholder: '请输入需要进行加密或解密的文本',
    keyBits: '秘钥位数',
    keyFormat: '秘钥格式',
    generateKey: '生成秘钥对',
    generateFailed: '生成失败！',
    publicKey: '公钥',
    privateKey: '私钥',
    publicKeyPlaceholder: '请输入公钥',
    privateKeyPlaceholder: '请输入私钥',
    publicKeyRequired: '请输入公钥',
    privateKeyRequired: '请输入私钥',
    encrypt: '加密',
    decrypt: '解密',
    encryptFailed: '加密失败！',
    encryptDetail: '加密失败，请检查公钥或文本长度',
    decryptFailed: '解密失败！',
    decryptDetail: '解密失败，请检查私钥或密文',
  },
};

const json = {
  tab: 'JSON解析',
  themePrefix: '主题 {{theme}}',
  validate: '校验',
  format: '{{width}}空格美化',
  compress: '压缩',
  parse: '解析',
  stringify: '反解析',
  indent: '{{width}}个空格缩进',
  expandAll: '展开全部',
  collapseAll: '折叠全部',
  collapseTo: '折叠到 {{depth}} 层',
  sort: '排序',
  cancelSort: '取消排序',
  edit: '编辑',
  exportFile: '导出文件',
  placeholder: '请输入JSON文本',
  parseFailed: 'JSON解析失败: {{message}}',
  valid: 'JSON格式正确！',
  objectOnly: '右侧 JSON 视图仅支持对象或数组',
  exportFailed: 'JSON 导出失败: {{message}}',
};

const qrcode = {
  title: '二维码生成',
  required: '请输入文本！',
  placeholder: '请输入文本',
  imageType: '图片类型',
  image: '图片',
  bgColor: '背景颜色',
  color: '颜色',
  size: '图片大小',
  logo: 'LOGO',
  generate: '生成二维码',
  previewTitle: '二维码',
  save: '保存图片',
  noCanvas: '未找到二维码画布',
  saveFailed: '保存二维码失败',
  noSvg: '未找到二维码 SVG',
};

const ip = {
  columns: {
    ip: 'IP地址',
    country: '国家',
    countryCode: '国家码',
    region: '地区',
    regionName: '地区名',
    city: '城市',
    timezone: '时区',
    latitude: '纬度',
    longitude: '经度',
    isp: 'ISP',
    org: '组织',
    as: 'AS',
  },
  invalid: 'IP地址格式错误',
  queryFailed: 'IP地址查询失败',
  title: 'IP地址信息',
  placeholder: '请输入IPv4或IPv6地址',
  query: '查询',
  attribute: '属性',
  attributeValue: '属性值',
  sourcePrefix: '以上IP信息来源于',
  sourceSuffix: '网站。',
  curl: 'CURL命令',
  jsonResult: 'JSON格式结果',
};

const cron = {
  title: 'Cron表达式解析器',
  expression: 'Cron表达式',
  required: '请输入Cron表达式',
  placeholder: '例如: 0 9 * * 1 (每周一上午9点)',
  parse: '解析',
  parseFailed: '解析失败',
  result: '解析结果',
  fields: {
    minute: '分钟',
    hour: '小时',
    dayOfMonth: '日期',
    month: '月份',
    dayOfWeek: '星期',
  },
  description: '描述',
  nextRuns: '预测未来调度时间',
  syntax: {
    title: 'Cron表达式语法说明',
    intro: 'Cron表达式由5个字段组成，用空格分隔：',
    fields: [
      '分钟 (0-59)',
      '小时 (0-23)',
      '日期 (1-31)',
      '月份 (1-12)',
      '星期 (0-7, 0和7都表示周日)',
    ],
    special: '特殊字符说明：',
    specials: [
      '* 表示匹配该字段的所有值',
      '- 表示范围，如1-5表示1到5',
      ', 表示列表，如1,3,5表示1、3、5',
      '/ 表示步长，如*/5表示每隔5个单位',
    ],
    examples: '示例：',
    exampleList: [
      '* * * * * - 每分钟执行',
      '0 9 * * * - 每天上午9点执行',
      '0 9 * * 1 - 每周一上午9点执行',
      '0 */2 * * * - 每隔2小时执行',
    ],
  },
  weekdays: ['日', '一', '二', '三', '四', '五', '六', '日'],
  describe: {
    template: '在{{minute}}{{hour}}，{{day}}{{month}}',
    everyMinute: '每分钟',
    everyNMinutes: '每隔{{count}}分钟',
    atMinute: '{{minute}}分钟',
    everyHour: '的每小时',
    everyNHours: '的每隔{{count}}小时',
    atHour: '的{{hour}}点',
    everyDay: '每天',
    dayOfMonth: '每月{{day}}日',
    andWeekday: '每月{{day}}日或{{weekday}}',
    weekdayName: '周{{name}}',
    weekdayRange: '周{{range}}',
    everyNDays: '每隔{{count}}天',
    month: '，{{month}}月',
  },
  errors: {
    fieldCount: 'Cron 表达式必须包含 5 个字段（分 时 日 月 周）',
    fieldEmpty: 'Cron 表达式的{{label}}字段为空',
    listItemEmpty: 'Cron 表达式的{{label}}字段包含空的列表项',
    format: 'Cron 表达式的{{label}}字段格式错误：{{part}}',
    step: 'Cron 表达式的{{label}}字段步长必须为正整数：{{part}}',
    question: 'Cron 表达式的{{label}}字段暂不支持 ?',
    rangeFormat: 'Cron 表达式的{{label}}字段范围格式错误：{{part}}',
    rangeOrder: 'Cron 表达式的{{label}}字段范围起始值不能大于结束值：{{part}}',
    valueRange:
      'Cron 表达式的{{label}}字段值必须在 {{min}}-{{max}} 之间：{{value}}',
  },
};

const regex = {
  title: '正则表达式工具',
  syntaxLink: '语法参考',
  pattern: '正则表达式:',
  patternPlaceholder: '输入正则表达式，如: \\d+',
  flags: {
    label: '修饰符',
    g: '全局匹配 (g)',
    i: '忽略大小写 (i)',
    m: '多行匹配 (m)',
    s: '单行匹配 (s)',
  },
  commonExpressions: '常用表达式',
  replacement: '替换为:',
  replacementPlaceholder: '输入替换文本',
  match: '查找匹配',
  replace: '文本替换',
  textTitle: '待匹配文本',
  textPlaceholder: '在此输入待匹配的文本',
  tabs: {
    matches: '匹配结果',
    replacement: '替换结果',
  },
  modifiedText: '替换后的文本',
  emptyMatches: '暂无匹配结果',
  emptyGroup: '(空)',
  columns: {
    index: '序号',
    position: '位置',
    content: '匹配内容',
    groups: '捕获组',
  },
  modalTitle: '正则表达式语法参考',
  close: '关闭',
  invalidPattern: '无效的正则表达式',
  syntax: {
    characters: {
      title: '字符匹配',
      items: [
        { code: '.', text: '匹配除换行符以外的任意字符' },
        { code: '[abc]', text: '匹配a, b或c的一个字符' },
        { code: '[a-z]', text: '匹配a到z的一个字符' },
        { code: '[^abc]', text: '匹配除a, b, c以外的一个字符' },
        { code: 'aa|bb', text: '匹配aa或bb的两个字符' },
        { code: '\\w', text: '匹配字母、数字、下划线' },
        { code: '\\d', text: '匹配数字' },
        { code: '\\s', text: '匹配空白字符' },
        { code: '\\W, \\D, \\S', text: '分别是上面的反义' },
      ],
    },
    positions: {
      title: '位置匹配',
      items: [
        { code: '^', text: '匹配字符串开始' },
        { code: '$', text: '匹配字符串结束' },
        { code: '\\b', text: '匹配单词边界' },
        { code: '\\B', text: '匹配非单词边界' },
      ],
    },
    quantifiers: {
      title: '量词',
      items: [
        { code: '*', text: '匹配0次或多次' },
        { code: '+', text: '匹配1次或多次' },
        { code: '?', text: '匹配0次或1次' },
        { code: '{n}', text: '匹配n次' },
        { code: '{n,}', text: '匹配n次及以上' },
        { code: '{m,n}', text: '匹配m到n次' },
      ],
    },
    groups: {
      title: '分组和引用',
      items: [
        { code: '(...)', text: '分组' },
        { code: '(?:...)', text: '非捕获分组' },
        { code: '(?=...)', text: '正向先行断言' },
        { code: '(?!...)', text: '负向先行断言' },
      ],
    },
  },
  patterns: {
    alphanumeric: {
      name: '英文和数字',
      description: '匹配英文字符和数字的组合',
    },
    letters: {
      name: '26个英文字母',
      description: '匹配英文字母',
    },
    lettersAndDigits: {
      name: '数字和26个英文字母',
      description: '匹配数字和英文字母的组合',
    },
    wordCharacters: {
      name: '数字、字母或下划线',
      description: '匹配数字、字母或下划线',
    },
    chinese: {
      name: '汉字',
      description: '匹配一个或多个汉字',
    },
    email: {
      name: 'Email地址',
      description: '匹配标准的Email地址格式',
    },
    domain: {
      name: '域名',
      description: '匹配域名格式',
    },
    url: {
      name: 'Internet URL',
      description: '匹配Internet URL地址',
    },
    date: {
      name: '日期格式',
      description: '匹配YYYY-MM-DD日期格式',
    },
    phoneWithArea: {
      name: '电话号码（区号-号码）',
      description: '匹配带区号的电话号码',
    },
    chinaPhone: {
      name: '国内电话号码',
      description: '匹配国内固定电话号码',
    },
    idCard: {
      name: '身份证号',
      description: '匹配15位或18位身份证号码',
    },
    postalCode: {
      name: '中国邮政编码',
      description: '匹配中国邮政编码',
    },
    webUrl: {
      name: 'URL链接',
      description: '匹配HTTP/HTTPS链接',
    },
    ipv4Strict: {
      name: 'IPv4地址',
      description: '匹配IPv4地址格式',
    },
    ip: {
      name: 'IP地址',
      description: '匹配IPv4地址',
    },
  },
};

const password = {
  title: '密码生成器',
  generateFailed: '生成失败，请调整密码长度或字符选项',
  generateFirst: '请先生成密码',
  memoryPassword: '记忆密码',
  memoryPasswordRequired: '请输入记忆密码!',
  memoryPasswordPlaceholder: '请输入你的记忆密码',
  code: '区分代码',
  codeRequired: '请输入区分代码',
  codeTooShort: '区分代码过短!',
  codePlaceholder: '建议使用网站名，比如 weixin、taobao、zhihu',
  length: '密码长度',
  lengthRequired: '请输入密码长度',
  case: '大小写',
  uppercase: '大写',
  lowercase: '小写',
  punctuation: '标点符号',
  include: '包含',
  exclude: '不包含',
  generate: '生成密码',
  resultPlaceholder: '请点击生成密码按钮',
  copyPassword: '复制密码',
};

const zhCN = {
  translation: {
    common,
    language,
    layout,
    toolsIndex,
    notFound,
    homepage,
    tool,
    timestamp,
    timer,
    textdiff,
    markdown,
    encoder,
    encryption,
    json,
    qrcode,
    ip,
    cron,
    regex,
    password,
  },
};

export default zhCN;
