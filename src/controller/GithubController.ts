import { singleton } from 'tsyringe';
import IController from '../interface/IController';

@singleton()
export default class GithubController implements IController {}
