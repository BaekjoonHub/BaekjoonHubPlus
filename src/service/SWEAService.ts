import { Lifecycle, scoped, singleton } from 'tsyringe';
import IService from '../interface/IService';

@scoped(Lifecycle.ContainerScoped)
export default class SWEAService implements IService {
  run(args?: string[]): void {
    throw new Error('Abstract method not implemented');
  }
}
