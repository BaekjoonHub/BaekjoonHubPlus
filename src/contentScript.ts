import 'reflect-metadata';
import IFactory from './interface/pattern/IFactory';
import IService from './interface/IService';
import DispatcherService from './dispatcher/DispatcherService';
import { autoInjectable } from 'tsyringe';

@autoInjectable()
class ContentScript {
  factory?: IFactory;
  service?: IService;
  constructor(private dispatcherService?: DispatcherService) {
    this.factory = dispatcherService;
  }
  init(url: string) {
    (this.service = this.factory?.create(url))?.run([url, 'GET']);
  }
}

// run the script
new ContentScript().init(window.location.href);
