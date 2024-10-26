import CryptoJS from 'crypto-js';

export function hashPassword(password: string, code: string) {
  const encrypted1 = CryptoJS.HmacSHA256(code, password);
  const encrypted2 = CryptoJS.HmacSHA256('hello', encrypted1);
  const encrypted3 = CryptoJS.HmacSHA256('world', encrypted1);
  const source = CryptoJS.enc.Hex.stringify(encrypted2).split('');
  const rule = CryptoJS.enc.Hex.stringify(encrypted3).split('');
  // 字母大小写转换
  const str = 'whenthecatisawaythemicewillplay666';
  for (let i = 0; i < source.length; ++i) {
    if (isNaN(source[i])) {
      if (str.search(rule[i]) > -1) {
        source[i] = source[i].toUpperCase();
      }
    }
  }
  return source.join('');
}

export function generatePassword(
  hash: string,
  length: number,
  punctuation: boolean,
  capital: boolean
) {
  // 生成字符表
  const lower = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const number = '0123456789'.split('');
  const punctuations = '~*-+()!@#$^&'.split('');
  let alphabet = lower.concat(number);
  if (punctuation === true) {
    alphabet = alphabet.concat(punctuations);
  }
  if (capital === true) {
    alphabet = alphabet.concat(upper);
  }

  // 生成密码
  // 从0开始截取长度为length的字符串，直到满足密码复杂度为止
  for (let i = 0; i <= hash.length - length; ++i) {
    const sub_hash = hash.slice(i, i + length).split('');
    let count = 0;
    const map_index = sub_hash.map(function (c) {
      count = (count + c.charCodeAt(0)) % alphabet.length;
      return count;
    });
    const sk_pwd = map_index.map(function (k) {
      return alphabet[k];
    });

    // 验证密码
    const matched = [false, false, false, false];
    sk_pwd.forEach(function (e) {
      matched[0] = matched[0] || lower.includes(e);
      matched[1] = matched[1] || upper.includes(e);
      matched[2] = matched[2] || number.includes(e);
      matched[3] = matched[3] || punctuations.includes(e);
    });
    if (capital !== true) {
      matched[1] = true;
    }
    if (punctuation !== true) {
      matched[3] = true;
    }
    if (!matched.includes(false)) {
      return sk_pwd.join('');
    }
  }
  return '';
}
