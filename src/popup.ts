import 'reflect-metadata';
import Config from './repository/config/Config';
import $ from 'jquery';

$(function () {
  const use_func = (settings: any) => {
    (document.getElementById('use') as HTMLInputElement).checked = settings.use;
  };

  Config.loadSettings().then(use_func);
  Config.bind(use_func);

  $('#use').on('click', function () {
    Config.setValue('use', $(this).is(':checked'));
  });
});
