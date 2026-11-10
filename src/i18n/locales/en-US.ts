// English resources. `satisfies typeof zhCN` makes missing or extra keys a
// type error, keeping this file in sync with `zh-CN.ts`.

import type zhCN from './zh-CN';

const common = {
  copy: 'Copy',
  copySuccess: 'Copied',
  copyFailed: 'Copy failed',
  copyEmpty: 'Nothing to copy',
  start: '▷ Start',
  pause: '□ Pause',
  clear: 'Clear',
  reset: 'Reset',
  swap: '↕ Swap',
  encode: 'Encode',
  decode: 'Decode',
  uppercase: 'Uppercase',
  input: 'Input',
  output: 'Output',
  outputPlaceholder: 'Result',
  seconds: 'seconds',
  milliseconds: 'milliseconds',
};

const language = {
  label: 'Language',
};

const layout = {
  allTools: 'All tools',
};

const toolsIndex = {
  title: 'Developer Toolbox',
  subtitle:
    'Browser-only utilities that never upload your data. Pick a card below to get started.',
  searchPlaceholder: 'Search tools, e.g. Base64, timestamp, JSON, regex',
  privacy: 'Everything runs locally; nothing is uploaded to a server',
  noResults: 'No tools match “{{keyword}}”',
  noResultsHint: 'Try keywords like “encode”, “time” or “JSON”',
  toolCount: '{{count}} tools',
};

const notFound = {
  subtitle: 'This page does not exist, or the link is broken.',
  backHome: 'Back to home',
  browseTools: 'Browse all tools',
};

const homepage = {
  menu: {
    home: 'Home',
    tools: 'Developer Tools',
  },
  hero: {
    eyebrow: 'DEVELOPER · BUILDER · EXPLORER',
    greeting: "Hello, I'm",
    name: 'Vyckey.',
    line1: 'I build things',
    line2: 'for the web.',
    description:
      'Full Stack Developer passionate about software engineering, system architecture and cybersecurity. I enjoy turning complex ideas into elegant solutions.',
    exploreWork: 'Explore my work',
    getInTouch: 'Get in touch',
    basedOn: 'Based on curiosity.',
    drivenBy: 'Driven by engineering.',
  },
  terminal: {
    window: 'about.me — zsh',
    language: 'EN',
    whoami: 'whoami',
    interests: 'cat interests.txt',
    mission: 'echo $MISSION',
    role: 'Full Stack Developer',
    interest1: 'Software Engineering',
    interest2: 'System Architecture',
    interest3: 'Application Security',
    missionOutput: 'Build something meaningful.',
    user: 'USER: VYCKEY',
    session: 'SESSION: ACTIVE',
  },
  about: {
    index: '01 / WHAT I DO',
    heading: 'Curiosity drives creation.',
    intro:
      'Exploring technologies, solving problems and building things that matter.',
  },
  expertise: {
    fullStack: {
      title: 'Full Stack Development',
      description:
        'Building modern web applications with clean architecture and thoughtful user experiences.',
    },
    architecture: {
      title: 'System Architecture',
      description:
        'Designing scalable backend systems, distributed services and reliable data architectures.',
    },
    security: {
      title: 'Cyber Security',
      description:
        'Exploring application security, authentication, privacy and secure software engineering.',
    },
  },
  tech: {
    index: '02 / TECHNOLOGIES',
    heading: 'Tools I work with.',
    intro: 'A collection of technologies I use to bring ideas to life.',
  },
  contact: {
    index: "03 / LET'S CONNECT",
    heading: 'Have an interesting idea?',
    description:
      "I'm always interested in exchanging ideas, exploring technology and building something new.",
    action: 'Say hello',
  },
  footer: {
    tagline: 'BUILDING THE FUTURE WITH CODE.',
  },
};

const tool = {
  categories: {
    time: 'Date & Time',
    text: 'Text',
    code: 'Encoding & Crypto',
    data: 'Data Formats',
    network: 'Network',
    generator: 'Generators',
  },
  registry: {
    timestamp: {
      label: 'Timestamp',
      description:
        'Convert between Unix timestamps and dates across time zones',
    },
    timer: {
      label: 'Timer',
      description: 'Countdown and stopwatch with pause and reset',
    },
    cron: {
      label: 'Cron Expression',
      description: 'Parse cron expressions and predict next run times',
    },
    textdiff: {
      label: 'Text Diff',
      description: 'Compare two texts line by line and highlight changes',
    },
    regex: {
      label: 'Regex',
      description: 'Match, highlight, replace and look up regex syntax',
    },
    markdown: {
      label: 'Markdown Preview',
      description: 'Live Markdown preview with GFM tables and HTML export',
    },
    encoder_decoder: {
      label: 'Encode / Decode',
      description:
        'Base64, URL, HTML entities, JWT, hashes and radix conversion',
    },
    encryption: {
      label: 'Encrypt / Decrypt',
      description: 'MD5, Base64 and RSA encryption and decryption',
    },
    json: {
      label: 'JSON',
      description: 'Format, validate, sort and visually edit JSON',
    },
    ipaddress: {
      label: 'IP Lookup',
      description: 'Validate IPv4/IPv6 and look up public IP locations',
    },
    qrcode: {
      label: 'QR Code',
      description: 'Generate colored QR codes with logos and download them',
    },
    password: {
      label: 'Password Generator',
      description: 'Generate strong random passwords and score their strength',
    },
  },
};

const timestamp = {
  currentTitle: 'Current timestamp',
  unitSecond: 's',
  unitMillisecond: 'ms',
  switchTo: '↺ Switch to {{unit}}',
  invalidTimestamp: 'Invalid timestamp',
  invalidDate: 'Invalid date/time, use the YYYY-MM-DD HH:mm:ss format',
  timestampToDate: 'Timestamp to date/time',
  dateToTimestamp: 'Date/time to timestamp',
  units: {
    millis: 'Milliseconds (ms)',
    seconds: 'Seconds (s)',
  },
  timestampRequired: 'Please enter a timestamp',
  dateRequired: 'Please enter a date in YYYY-MM-DD HH:mm:ss format',
  convert: 'Convert',
};

const timer = {
  countdownTitle: 'Countdown',
  stopwatchTitle: 'Stopwatch',
  targetTime: 'Target time',
  finished: "Time's up!",
  units: {
    year: 'y',
    month: 'mo',
    day: 'd',
    hour: 'h',
    minute: 'm',
    second: 's',
  },
};

const textdiff = {
  diff: 'Show diff',
  backToEdit: 'Back to edit',
  clear: 'Clear',
  sideBySide: 'Side by side',
  lineByLine: 'Line by line',
  originalPlaceholder: 'Enter the original text',
  currentPlaceholder: 'Enter the current text',
};

const markdown = {
  sample: [
    '# Markdown Preview',
    '',
    'Type Markdown on the left and it renders **live** on the right. Everything runs locally in your browser.',
    '',
    '## Common syntax',
    '',
    '- **Bold**, *italic*, ~~strikethrough~~, `inline code`',
    '- [Link](https://developer.mozilla.org/en-US/docs/Web/JavaScript)',
    '- Tables and task lists (GFM)',
    '',
    '| Feature | Supported | Notes |',
    '| --- | --- | --- |',
    '| Tables | Yes | GFM extension |',
    '| Code highlighting | Yes | highlight.js |',
    '| HTML export | Yes | Toolbar button |',
    '',
    '> Tip: the preview uses safe defaults and never executes raw HTML in your Markdown.',
    '',
    '```js',
    'function greet(name) {',
    '  return `Hello, ${name}!`;',
    '}',
    'console.log(greet("Vyckey"));',
    '```',
    '',
    '- [x] Task list support',
    '- [ ] HTML export',
  ],
  exportEmpty: 'Nothing to export',
  exportTitle: 'Markdown export',
  exported: 'HTML exported',
  previewPlaceholder: '(Preview appears here as you type)',
  editorPlaceholder: '# Type Markdown here',
  mode: {
    split: 'Split',
    edit: 'Edit',
    preview: 'Preview',
  },
  copyMarkdown: 'Copy Markdown',
  downloadMarkdown: 'Download .md',
  exportHtml: 'Export HTML',
  clear: 'Clear',
  stats: '{{characters}} chars · {{lines}} lines · ~{{words}} words',
};

const encoder = {
  tabs: {
    case: 'Case conversion',
    base64: 'Base64',
    url: 'URL encode/decode',
    html: 'HTML entities',
    hex: 'Hex / Unicode',
    radix: 'Radix conversion',
    jwt: 'JWT decoder',
    hash: 'Hashing',
  },
  panel: {
    swap: 'Swap (output → input)',
  },
  case: {
    inputPlaceholder: 'Enter text to convert case',
    outputPlaceholder: 'Converted text',
    upper: 'Uppercase',
    lower: 'Lowercase',
  },
  base64: {
    encodePlaceholder: 'Enter text to encode (Chinese and Emoji supported)',
    decodePlaceholder: 'Enter the Base64 string to decode',
    urlSafe: 'URL-safe (uses - _, no =)',
  },
  url: {
    encodePlaceholder: 'Enter text or a link to URL-encode',
    decodePlaceholder: 'Enter content to URL-decode, e.g. %E4%BD%A0%E5%A5%BD',
    formMode: 'Form mode (space ↔ +)',
  },
  html: {
    encodePlaceholder: 'Enter HTML to escape, e.g. <div class="box">',
    decodePlaceholder: 'Enter HTML entities to unescape, e.g. &lt;div&gt;',
    escape: 'Escape',
    unescape: 'Unescape',
  },
  hex: {
    unicodeEncodePlaceholder: 'Enter text to convert to Unicode escapes',
    unicodeDecodePlaceholder: 'Enter Unicode escapes, e.g. \\u4F60\\u597D',
    hexEncodePlaceholder: 'Enter text to convert to hex (UTF-8 bytes)',
    hexDecodePlaceholder: 'Enter hex content, e.g. E4 BD A0 E5 A5 BD',
    formatHex: 'Hexadecimal',
    formatUnicode: 'Unicode escapes',
    separatorSpace: 'Space separated',
    separatorNone: 'No separator',
    separatorComma: 'Comma separated',
  },
  radix: {
    inputPlaceholder:
      'Enter a base-{{radix}} number (supports 0x / 0b / 0o prefixes and negatives)',
    outputPlaceholder: 'Conversions in every radix',
    hint: 'Computed with BigInt, so the JavaScript safe-integer range does not apply',
    line: '{{label}}: {{value}}',
    binary: 'Binary (2)',
    octal: 'Octal (8)',
    decimal: 'Decimal (10)',
    hex: 'Hexadecimal (16)',
    base36: 'Base 36',
  },
  hash: {
    inputPlaceholder: 'Enter text to hash',
    outputPlaceholder: 'Hash (hexadecimal)',
  },
  jwt: {
    tokenPlaceholder:
      'Paste a JWT, optionally with a Bearer prefix, e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    hint: 'A JWT has three Base64URL segments: Header, Payload and Signature. Decoding and verification happen locally in your browser.',
    unknownAlg: 'unknown',
    header: 'Header',
    payload: 'Payload',
    signature: 'Signature',
    verify: 'Signature verification',
    secretPlaceholder: 'HS256 secret (computed locally)',
    verifyButton: 'Verify',
    valid: 'Signature valid',
    invalid: 'Signature mismatch',
    hs256Only: 'Only HS256 signatures can be verified',
    empty: '(empty)',
    claims: {
      exp: 'Expires (exp)',
      nbf: 'Not before (nbf)',
      iat: 'Issued at (iat)',
    },
  },
  errors: {
    base64InvalidChar: 'Invalid Base64: contains invalid characters',
    base64InvalidLength: 'Invalid Base64: wrong length',
    base64DecodeFailed:
      'Base64 decoding failed: not valid Base64 or UTF-8 text',
    urlEncodeFailed: 'URL encoding failed: text contains invalid Unicode',
    urlDecodeFailed: 'URL decoding failed: invalid percent-escape sequence',
    hexOddLength: 'Hex length must be even: two hex chars per byte',
    hexInvalid: 'Invalid hex: only 0-9 and a-f are allowed',
    hexDecodeFailed: 'Hex decoding failed: bytes are not valid UTF-8',
    radixRange: 'Radix must be between 2 and 36',
    numberRequired: 'Please enter a number to convert',
    digitInvalid: 'Character "{{char}}" is not a valid digit in base {{radix}}',
    jwtSegmentEmpty: '{{label}} is empty',
    jwtSegmentInvalidJson: '{{label}} is not valid Base64URL-encoded JSON',
    jwtSegmentNotObject: '{{label}} must be a JSON object',
    jwtFormat: 'Invalid JWT: expected 3 segments separated by "."',
    jwtSecretRequired: 'Please enter a secret to verify the signature',
    jwtHs256Only: 'Only HS256 JWTs can be verified',
  },
};

const encryption = {
  tabs: {
    md5: 'MD5 signature',
    base64: 'Base64 encode/decode',
    rsa: 'RSA encrypt/decrypt',
  },
  outputPlaceholder: 'Output text',
  md5: {
    required: 'Please enter text to hash with MD5',
    placeholder: 'Enter text to hash with MD5',
    lower: 'MD5 32-char lowercase',
    upper: 'MD5 32-char uppercase',
  },
  base64: {
    required: 'Please enter text to encode or decode',
    placeholder: 'Enter text to encode or decode',
    encodeFailed: 'Encoding failed',
    decodeFailed: 'Decoding failed',
  },
  rsa: {
    required: 'Please enter text to encrypt or decrypt',
    placeholder: 'Enter text to encrypt or decrypt',
    keyBits: 'Key size',
    keyFormat: 'Key format',
    generateKey: 'Generate key pair',
    generateFailed: 'Generation failed',
    publicKey: 'Public key',
    privateKey: 'Private key',
    publicKeyPlaceholder: 'Enter the public key',
    privateKeyPlaceholder: 'Enter the private key',
    publicKeyRequired: 'Please enter the public key',
    privateKeyRequired: 'Please enter the private key',
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
    encryptFailed: 'Encryption failed',
    encryptDetail: 'Encryption failed; check the public key or text length',
    decryptFailed: 'Decryption failed',
    decryptDetail: 'Decryption failed; check the private key or ciphertext',
  },
};

const json = {
  tab: 'JSON parser',
  themePrefix: 'Theme {{theme}}',
  validate: 'Validate',
  format: 'Beautify ({{width}} spaces)',
  compress: 'Minify',
  parse: 'Parse',
  stringify: 'Stringify',
  indent: '{{width}}-space indent',
  expandAll: 'Expand all',
  collapseAll: 'Collapse all',
  collapseTo: 'Collapse to level {{depth}}',
  sort: 'Sort keys',
  cancelSort: 'Cancel sort',
  edit: 'Edit',
  exportFile: 'Export file',
  placeholder: 'Enter JSON text',
  parseFailed: 'JSON parsing failed: {{message}}',
  valid: 'Valid JSON!',
  objectOnly: 'The JSON viewer only supports objects or arrays',
  exportFailed: 'JSON export failed: {{message}}',
};

const qrcode = {
  title: 'QR Code Generator',
  required: 'Please enter text!',
  placeholder: 'Enter text',
  imageType: 'Image type',
  image: 'Image',
  bgColor: 'Background color',
  color: 'Color',
  size: 'Image size',
  logo: 'LOGO',
  generate: 'Generate QR code',
  previewTitle: 'QR code',
  save: 'Save image',
  noCanvas: 'QR code canvas not found',
  saveFailed: 'Failed to save the QR code',
  noSvg: 'QR code SVG not found',
};

const ip = {
  columns: {
    ip: 'IP address',
    country: 'Country',
    countryCode: 'Country code',
    region: 'Region',
    regionName: 'Region name',
    city: 'City',
    timezone: 'Time zone',
    latitude: 'Latitude',
    longitude: 'Longitude',
    isp: 'ISP',
    org: 'Organization',
    as: 'AS',
  },
  invalid: 'Invalid IP address',
  queryFailed: 'IP lookup failed',
  title: 'IP information',
  placeholder: 'Enter an IPv4 or IPv6 address',
  query: 'Look up',
  attribute: 'Attribute',
  attributeValue: 'Value',
  sourcePrefix: 'IP information provided by ',
  sourceSuffix: '.',
  curl: 'CURL command',
  jsonResult: 'JSON result',
};

const cron = {
  title: 'Cron expression parser',
  expression: 'Cron expression',
  required: 'Please enter a cron expression',
  placeholder: 'e.g. 0 9 * * 1 (every Monday at 9am)',
  parse: 'Parse',
  parseFailed: 'Parsing failed',
  result: 'Parse result',
  fields: {
    minute: 'Minute',
    hour: 'Hour',
    dayOfMonth: 'Day of month',
    month: 'Month',
    dayOfWeek: 'Day of week',
  },
  description: 'Description',
  nextRuns: 'Predicted next runs',
  syntax: {
    title: 'Cron expression syntax',
    intro: 'A cron expression has five space-separated fields:',
    fields: [
      'Minute (0-59)',
      'Hour (0-23)',
      'Day of month (1-31)',
      'Month (1-12)',
      'Day of week (0-7, 0 and 7 both mean Sunday)',
    ],
    special: 'Special characters:',
    specials: [
      '* matches every value of the field',
      '- is a range, e.g. 1-5 means 1 through 5',
      ', is a list, e.g. 1,3,5 means 1, 3 and 5',
      '/ is a step, e.g. */5 means every 5 units',
    ],
    examples: 'Examples:',
    exampleList: [
      '* * * * * - every minute',
      '0 9 * * * - every day at 9am',
      '0 9 * * 1 - every Monday at 9am',
      '0 */2 * * * - every 2 hours',
    ],
  },
  weekdays: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  describe: {
    template: '{{minute}} of {{hour}}, {{day}}{{month}}',
    everyMinute: 'every minute',
    everyNMinutes: 'every {{count}} minutes',
    atMinute: 'minute {{minute}}',
    everyHour: 'every hour',
    everyNHours: 'every {{count}} hours',
    atHour: 'hour {{hour}}',
    everyDay: 'every day',
    dayOfMonth: 'day {{day}} of every month',
    andWeekday: 'day {{day}} of every month or {{weekday}}',
    weekdayName: 'every {{name}}',
    weekdayRange: 'weekdays {{range}}',
    everyNDays: 'every {{count}} days',
    month: ', month {{month}}',
  },
  errors: {
    fieldCount:
      'A cron expression must contain 5 fields (min hour day month weekday)',
    fieldEmpty: 'The {{label}} field of the cron expression is empty',
    listItemEmpty: 'The {{label}} field contains an empty list item',
    format: 'Invalid {{label}} field format: {{part}}',
    step: 'The {{label}} field step must be a positive integer: {{part}}',
    question: 'The {{label}} field does not support ?',
    rangeFormat: 'Invalid {{label}} field range: {{part}}',
    rangeOrder:
      'The {{label}} field range start must not be greater than its end: {{part}}',
    valueRange:
      'The {{label}} field value must be between {{min}} and {{max}}: {{value}}',
  },
};

const regex = {
  title: 'Regex tool',
  syntaxLink: 'Syntax reference',
  pattern: 'Pattern:',
  patternPlaceholder: 'Enter a regex, e.g. \\d+',
  flags: {
    label: 'Flags',
    g: 'Global (g)',
    i: 'Ignore case (i)',
    m: 'Multiline (m)',
    s: 'Dot matches newline (s)',
  },
  commonExpressions: 'Common patterns',
  replacement: 'Replace with:',
  replacementPlaceholder: 'Enter replacement text',
  match: 'Find matches',
  replace: 'Replace text',
  textTitle: 'Text to match',
  textPlaceholder: 'Enter the text to match',
  tabs: {
    matches: 'Matches',
    replacement: 'Replacement',
  },
  modifiedText: 'Replaced text',
  emptyMatches: 'No matches',
  emptyGroup: '(empty)',
  columns: {
    index: '#',
    position: 'Position',
    content: 'Match',
    groups: 'Groups',
  },
  modalTitle: 'Regex syntax reference',
  close: 'Close',
  invalidPattern: 'Invalid regular expression',
  syntax: {
    characters: {
      title: 'Character matching',
      items: [
        { code: '.', text: 'Matches any character except line breaks' },
        { code: '[abc]', text: 'Matches one of a, b or c' },
        { code: '[a-z]', text: 'Matches one character from a to z' },
        { code: '[^abc]', text: 'Matches one character other than a, b or c' },
        { code: 'aa|bb', text: 'Matches aa or bb' },
        { code: '\\w', text: 'Matches letters, digits and underscores' },
        { code: '\\d', text: 'Matches digits' },
        { code: '\\s', text: 'Matches whitespace' },
        { code: '\\W, \\D, \\S', text: 'Negations of the above' },
      ],
    },
    positions: {
      title: 'Position matching',
      items: [
        { code: '^', text: 'Matches the start of the string' },
        { code: '$', text: 'Matches the end of the string' },
        { code: '\\b', text: 'Matches a word boundary' },
        { code: '\\B', text: 'Matches a non-word boundary' },
      ],
    },
    quantifiers: {
      title: 'Quantifiers',
      items: [
        { code: '*', text: 'Zero or more times' },
        { code: '+', text: 'One or more times' },
        { code: '?', text: 'Zero or one time' },
        { code: '{n}', text: 'Exactly n times' },
        { code: '{n,}', text: 'n or more times' },
        { code: '{m,n}', text: 'Between m and n times' },
      ],
    },
    groups: {
      title: 'Groups and references',
      items: [
        { code: '(...)', text: 'Capturing group' },
        { code: '(?:...)', text: 'Non-capturing group' },
        { code: '(?=...)', text: 'Positive lookahead' },
        { code: '(?!...)', text: 'Negative lookahead' },
      ],
    },
  },
  patterns: {
    alphanumeric: {
      name: 'Letters and digits',
      description: 'Matches a combination of letters and digits',
    },
    letters: {
      name: '26 letters',
      description: 'Matches English letters',
    },
    lettersAndDigits: {
      name: 'Digits and 26 letters',
      description: 'Matches a combination of digits and letters',
    },
    wordCharacters: {
      name: 'Digits, letters or underscore',
      description: 'Matches digits, letters or underscores',
    },
    chinese: {
      name: 'Chinese characters',
      description: 'Matches one or more Chinese characters',
    },
    email: {
      name: 'Email address',
      description: 'Matches a standard email address',
    },
    domain: {
      name: 'Domain name',
      description: 'Matches a domain name',
    },
    url: {
      name: 'Internet URL',
      description: 'Matches an Internet URL',
    },
    date: {
      name: 'Date',
      description: 'Matches YYYY-MM-DD dates',
    },
    phoneWithArea: {
      name: 'Phone (area code-number)',
      description: 'Matches a phone number with an area code',
    },
    chinaPhone: {
      name: 'Chinese landline',
      description: 'Matches a Chinese landline number',
    },
    idCard: {
      name: 'Chinese ID card',
      description: 'Matches a 15- or 18-digit Chinese ID number',
    },
    postalCode: {
      name: 'Chinese postal code',
      description: 'Matches a Chinese postal code',
    },
    webUrl: {
      name: 'URL link',
      description: 'Matches HTTP/HTTPS links',
    },
    ipv4Strict: {
      name: 'IPv4 address',
      description: 'Matches an IPv4 address',
    },
    ip: {
      name: 'IP address',
      description: 'Matches an IPv4 address',
    },
  },
};

const password = {
  title: 'Password Generator',
  generateFailed:
    'Generation failed. Adjust the password length or character options.',
  generateFirst: 'Generate a password first',
  memoryPassword: 'Master password',
  memoryPasswordRequired: 'Please enter your master password',
  memoryPasswordPlaceholder: 'Enter your master password',
  code: 'Site code',
  codeRequired: 'Please enter the site code',
  codeTooShort: 'Site code is too short',
  codePlaceholder: 'Use the site name, e.g. weixin, taobao, zhihu',
  length: 'Password length',
  lengthRequired: 'Please enter a password length',
  case: 'Case',
  uppercase: 'Upper',
  lowercase: 'Lower',
  punctuation: 'Punctuation',
  include: 'Include',
  exclude: 'Exclude',
  generate: 'Generate password',
  resultPlaceholder: 'Click "Generate password" to create one',
  copyPassword: 'Copy password',
};

const enUS = {
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
} satisfies typeof zhCN;

export default enUS;
