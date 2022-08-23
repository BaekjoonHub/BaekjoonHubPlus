export const CONSTANT = {
  HOSTS: {
    BAEKJOON: 'acmicpc.net',
    SWEXPERTACADEMY: 'swexpertacademy.com',
    PROGRAMMERS: 'programmers.co.kr',
    AUTHORIZE: 'oauth.github.com',
  },
  GITHUB_AUTH_APP: {
    CLIENT_ID: '83f0292e820a287c4b3e',
    CLIENT_SECRET: '20b8910d953df00b137e3b30ac32a94fe16d1161',
    REDIRECT_URL: 'https://oauth.github.com',
    ACCESS_TOKEN_URL: 'https://github.com/login/oauth/access_token',
    AUTHORIZATION_URL: 'https://github.com/login/oauth/authorize',
    SCOPE: 'repo',
    get AUTH_URL() {
      return `${this.AUTHORIZATION_URL}?client_id=${this.CLIENT_ID}&redirect_uri=${this.REDIRECT_URL}&scope=${this.SCOPE}`;
    },
  },
  EXTENSION_URL: chrome.runtime.getURL(''),
  EXTENSION_SETTINGS_URL: chrome.runtime.getURL('settings.html'),
  GITHUB_API_URL: 'https://api.github.com',
} as const;
