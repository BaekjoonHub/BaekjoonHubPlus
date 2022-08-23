import { Lifecycle, scoped, singleton } from 'tsyringe';
import IController from '../interface/IController';

@scoped(Lifecycle.ContainerScoped)
export default class GithubController implements IController {}
