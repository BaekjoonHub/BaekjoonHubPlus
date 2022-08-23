import { Lifecycle, scoped, singleton } from 'tsyringe';
import IService from '../interface/IService';

@scoped(Lifecycle.ContainerScoped)
export default class BaekjoonService implements IService {
  run(args?: string[]): void {
    throw new Error('Method not implemented.');
  }
}
