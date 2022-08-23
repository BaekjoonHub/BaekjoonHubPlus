import IService from '../interface/IService';
import { autoInjectable, inject, Lifecycle, scoped, singleton } from 'tsyringe';
import AuthController from '../controller/AuthController';

@autoInjectable()
@scoped(Lifecycle.ContainerScoped)
export default class AuthService implements IService {
  private controller: AuthController;

  constructor(authController: AuthController) {
    this.controller = authController;
  }

  run(args?: string[]): void {
    if (!args) return;

    const url = args[0];
    const code = this.parseCode(url);
    if (code) {
      this.controller.authorize(code);
    }
  }

  private parseCode(url: string): string {
    return url.split('code=')[1];
  }
}
