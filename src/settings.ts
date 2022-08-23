import 'reflect-metadata';
import $ from 'jquery';
import Config from './repository/config/Config';

// document ready
$(function () {
  // init the settings page on input value.
  (async () => {
    //get Config settings
    let settings = await Config.loadSettings();

    // set value of input
    Object.keys(settings).forEach(function (key) {
      const $input = $('input[name=' + key + ']');
      if ($input.length == 0) return;
      // check if the input is checkbox
      if ($input.is(':checkbox')) {
        $input.prop('checked', settings[key]);
      } else if ($input.is(':radio')) {
        $input.filter('[value=' + settings[key] + ']').prop('checked', true);
      } else {
        $input.val(settings[key]);
      }

      // add event listener to input
      $input.on('change', function () {
        const $this = $(this);
        if ($this.is(':checkbox')) settings[key] = (this as HTMLInputElement).checked;
        else if ($this.is('[type=number]')) settings[key] = Number($this.val());
        else settings[key] = $this.val();
        //save settings
        Config.setValue(key, settings[key]);
      });

      // if attribute 'toggle' name input is toggle self enable/disable input
      const toggle = $input.attr('toggle')?.split(':');
      if (toggle) {
        const [tkey, tvalue] = toggle;
        const $enable_input = $(`input[name=${tkey}]`);
        const fn = function (this: any) {
          const $this = $(this);
          if ($this.is(':checkbox')) $input.prop('disabled', !$this.prop('checked'));
          else $input.prop('disabled', !($this.val() == tvalue));
        };
        // add event listener
        $enable_input.on('change', fn);
        fn.call($enable_input);
      }
    });

    return;
  })();

  // number input type limit to min~max
  ($('input[type="number"]') as JQuery<HTMLInputElement>).on('change paste', function () {
    if (this.min) this.value = Math.max(Number(this.min), Number(this.value) || 0).toString();
    if (this.max) this.value = Math.min(Number(this.max), Number(this.value) || 0).toString();
  });

  // if click on reset button, reset settings
  $('#reset').on('click', function () {
    Config.reset().then((settings) => {
      // set value of input
      Object.keys(settings).forEach(function (key) {
        const $input = $('input[name=' + key + ']');
        if ($input.length == 0) return;
        // check if the input is checkbox
        if ($input.is(':checkbox')) {
          $input.prop('checked', settings[key]);
        } else if ($input.is(':radio')) {
          $input.filter('[value=' + settings[key] + ']').prop('checked', true);
        } else {
          $input.val(settings[key]);
        }
        const toggle = $input.attr('toggle')?.split(':');
        if (toggle) {
          const [tkey, tvalue] = toggle;
          const $enable_input = $(`input[name=${tkey}]`);
          const fn = function (this: any) {
            const $this = $(this);
            if ($this.is(':checkbox')) $input.prop('disabled', !$this.prop('checked'));
            else $input.prop('disabled', !($this.val() == tvalue));
          };
        }
      });
    });
  });
});
