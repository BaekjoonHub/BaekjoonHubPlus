import IService from '../IService';

export default interface IFactory {
  create(arg: string): IService | undefined;
}
