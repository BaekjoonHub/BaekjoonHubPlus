import { Lifecycle, scoped, singleton } from 'tsyringe';
import { CONSTANT } from '../constants/common';
import IController from '../interface/IController';
import { Storage } from '../repository/storage/Storage';

@scoped(Lifecycle.ContainerScoped)
export default class AuthController implements IController {
  constructor() {}
  public authorize(code: string): Promise<void> {
    return this.fetchToken(code)
      .then((token) => Storage.set('token', token))
      .then(() => console.log('token saved.'))
      .then(() => chrome.runtime.sendMessage({ type: 'closeCurrentTabAndOpenSettings' }));
  }

  private parseToken(text: string): string {
    return text.split('access_token=')[1]?.replace(/&.*/, '');
  }

  private fetchToken(code: string): Promise<string> {
    const data = new FormData();
    data.append('client_id', CONSTANT.GITHUB_AUTH_APP.CLIENT_ID);
    data.append('client_secret', CONSTANT.GITHUB_AUTH_APP.CLIENT_SECRET);
    data.append('code', code);

    return fetch(CONSTANT.GITHUB_AUTH_APP.ACCESS_TOKEN_URL, { method: 'POST', mode: 'no-cors', body: data })
      .then((res) => res.text())
      .then((text) => this.parseToken(text));
  }
}
