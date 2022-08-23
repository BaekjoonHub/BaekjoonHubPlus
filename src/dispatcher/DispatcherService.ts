// constrant hostnames
import { CONSTANT } from '../constants/common';
// interface
import IFactory from '../interface/pattern/ifactory';
import IService from '../interface/IService';
// concrete services
import SWEAService from '../service/SWEAService';
import BaekjoonService from '../service/BaekjoonService';
import ProgrammersService from '../service/ProgrammersService';
import AuthService from '../service/AuthService';
import { autoInjectable, injectable } from 'tsyringe';

@autoInjectable()
@injectable()
export default class DispatcherService implements IFactory {
  mapping: { [key: string]: IService };

  constructor(private sweaService: SWEAService, private baekjoonService: BaekjoonService, private programmersService: ProgrammersService, private authService: AuthService) {
    this.mapping = {
      [CONSTANT.HOSTS.SWEXPERTACADEMY]: sweaService,
      [CONSTANT.HOSTS.BAEKJOON]: baekjoonService,
      [CONSTANT.HOSTS.PROGRAMMERS]: programmersService,
      [CONSTANT.HOSTS.AUTHORIZE]: authService,
    };
  }
  create(url: string): IService | undefined {
    for (let key in this.mapping) {
      if (url.includes(key)) {
        return this.mapping[key];
      }
    }
  }
}
