import 'reflect-metadata';
import IFactory from './interface/pattern/IFactory';
import IService from './interface/IService';
import DispatcherService from './dispatcher/DispatcherService';
import { autoInjectable, container, Lifecycle, scoped } from 'tsyringe';
import Config from './repository/config/Config';

@scoped(Lifecycle.ContainerScoped)
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

Config.loadSettings().then((settings) => {
  if (settings.use) {
    // run the script
    container.resolve(ContentScript).init(document.location.href);
  }
});
