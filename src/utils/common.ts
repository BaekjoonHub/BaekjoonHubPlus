import asyncPool from 'tiny-async-pool';
import sha1 from 'sha1';

/**
 * 해당 값이 null 또는 undefined인지 체크합니다.
 * @param {any} value - 체크할 값
 * @returns {boolean} - null이면 true, null이 아니면 false
 */
function isNull(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * 해당 값이 비어있거나 빈 문자열인지 체크합니다.
 * @param {any} value - 체크할 값
 * @returns {boolean} - 비어있으면 true, 비어있지 않으면 false
 */
function isEmpty(value: any): boolean {
  return isNull(value) || (value.hasOwnProperty('length') && value.length === 0);
}

/** 객체 또는 배열의 모든 요소를 재귀적으로 순회하여 값이 비어있지 않은지 체크합니다.
 * 자기 자신의 null값이거나 빈 문자열, 빈 배열, 빈 객체인 경우이거나, 요소 중 하나라도 값이 비어있으면 false를 반환합니다.
 * @param {any} obj - 체크할 객체 또는 배열
 * @returns {boolean} - 비어있지 않으면 true, 비어있으면 false
 */
function isNotEmpty(obj: any): boolean {
  if (isEmpty(obj)) return false;
  if (typeof obj !== 'object') return true;
  if (obj.length === 0) return false;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!isNotEmpty(obj[key])) return false;
    }
  }
  return true;
}
/**
 * 문자열을 escape 하여 반환합니다.
 * @param {string} text - escape 할 문자열
 * @returns {string} - escape된 문자열
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  } as const;

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

/** 문자열을 escape 하여 반환합니다. */
// String.prototype.escapeHtml = function () {
//   return escapeHtml(this);
// };

/**
 * escape된 문자열을 unescape하여 반환합니다.
 * @param {string} text - unescape할 문자열
 * @returns {string} - unescape된 문자열
 */
function unescapeHtml(text: string): string {
  const unescaped: { [key: string]: string } = {
    '&amp;': '&',
    '&#38;': '&',
    '&lt;': '<',
    '&#60;': '<',
    '&gt;': '>',
    '&#62;': '>',
    '&apos;': "'",
    '&#39;': "'",
    '&quot;': '"',
    '&#34;': '"',
    '&nbsp;': ' ',
    '&#160;': ' ',
  } as const;
  return text.replace(/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160);/g, function (m) {
    return unescaped[m];
  });
}

/** 문자열을 unescape 하여 반환합니다. */
// String.prototype.unescapeHtml = function () {
//   return unescapeHtml(this);
// };

/** 일반 특수문자를 전각문자로 변환하는 함수
 * @param {string} text - 변환할 문자열
 * @returns {string} - 전각문자로 변환된 문자열
 */
function convertSingleCharToDoubleChar(text: string): string {
  // singleChar to doubleChar mapping
  const map: { [key: string]: string } = {
    '!': '！',
    '%': '％',
    '&': '＆',
    '(': '（',
    ')': '）',
    '*': '＊',
    '+': '＋',
    ',': '，',
    '-': '－',
    '.': '．',
    '/': '／',
    ':': '：',
    ';': '；',
    '<': '＜',
    '=': '＝',
    '>': '＞',
    '?': '？',
    '@': '＠',
    '[': '［',
    '\\': '＼',
    ']': '］',
    '^': '＾',
    _: '＿',
    '`': '｀',
    '{': '｛',
    '|': '｜',
    '}': '｝',
    '~': '～',
    ' ': ' ', // 공백만 전각문자가 아닌 FOUR-PER-EM SPACE로 변환
  } as const;
  return text.replace(/[!%&()*+,\-./:;<=>?@\[\\\]^_`{|}~ ]/g, function (m) {
    return map[m];
  });
}

/**
 * base64로 문자열을 base64로 인코딩하여 반환합니다.
 * @param {string} str - base64로 인코딩할 문자열
 * @returns {string} - base64로 인코딩된 문자열
 */
function b64EncodeUnicode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

/**
 * base64로 인코딩된 문자열을 base64로 디코딩하여 반환합니다.
 * @param {string} str - base64로 인코딩된 문자열
 * @returns {string} - base64로 디코딩된 문자열
 */
function b64DecodeUnicode(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
}

/** key 값을 기준으로 array를 그룹핑하여 map으로 반환합니다.
 * @param {object} array - array to be sorted
 * @param {string} key - key to sort
 * @returns {object} - key 기준으로 그룹핑된 객체들 배열을 value로 갖는 map
 */
function groupBy(array: any[], key: string): { [key: string]: any } {
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}

/**
 * arr에서 같은 key 그룹 내의 요소 중 최고의 값을 리스트화하여 반환합니다.
 * @param arr: 비교할 요소가 있는 배열
 * @param key: 같은 그룹으로 묶을 키 값
 * @param compare: 비교할 함수
 * @returns {array<object>} : 같은 key 그룹 내의 요소 중 최고의 값을 반환합니다.
 * */
function maxValuesGroupBykey(arr: any[], key: string, compare: (a: any, b: any) => number) {
  const map = groupBy(arr, key);
  const result = [];
  for (const [key, value] of Object.entries(map)) {
    const maxValue = value.reduce((max: any, current: any) => {
      return compare(max, current) > 0 ? max : current;
    });
    result.push(maxValue);
  }
  return result;
}

/** 배열 내의 key에 val 값을 포함하고 있는 요소만을 반환합니다.
 * @param {array} arr - array to be filtered
 * @param {string} key - key to filter
 * @param {string} val - value to filter
 * @returns {array} - filtered array
 */
function filter(arr: any[], key: string, val: any): any[] {
  return arr.filter(function (item) {
    return val.includes(item[key]);
  });
}

/** calculate github blob file SHA
 * @param {string} content - file content
 * @returns {string} - SHA hash
 */
function calculateBlobSHA(content: string): string {
  return sha1(`blob ${new Blob([content]).size}\0${content}`);
}

/**
 * combine two array<Object> same index.
 * @param {array<Object>} a
 * @param {array<Object>} b
 * @return {array<Object>}
 */
function combine(a: any[], b: any[]): any[] {
  return a.map((x, i) => Object.assign({}, x, b[i]));
}

function addStyle(css: string) {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  document.getElementsByTagName('head')[0].appendChild(style);
  return style;
}

function addStyleFromFile(css: string){
  const topCss = chrome.runtime.getURL(css);
  const topCssLink = document.createElement("link");
  topCssLink.setAttribute("rel", "stylesheet");
  topCssLink.setAttribute("href", topCss);
  return document.head.appendChild(topCssLink);
}

export { asyncPool, isNull, isEmpty, isNotEmpty, escapeHtml, unescapeHtml, calculateBlobSHA, combine, filter, maxValuesGroupBykey, b64EncodeUnicode, b64DecodeUnicode, addStyle, addStyleFromFile };
