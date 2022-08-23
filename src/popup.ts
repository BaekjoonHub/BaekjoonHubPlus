import 'reflect-metadata';
import Config from './repository/config/Config';
import $ from 'jquery';

$(function () {
  // 설정 불러와서 #use 체크
  Config.loadSettings().then(function (settings) {
    if (settings.use) {
        (document.getElementById("use") as HTMLInputElement).checked = true;
    }
  });

  $('#use').on('click', function () {
    Config.setValue('use', $(this).is(':checked'));
  });
});