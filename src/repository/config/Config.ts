import { Storage } from '../storage/Storage';

export default class Config {
  static settings: { [key: string]: any };

  public static async reset(): Promise<{ [key: string]: any }> {
    this.settings = INIT_SETTINGS;
    await this.saveSettings();
    return this.settings;
  }

  public static async loadSettings(): Promise<{ [key: string]: any }> {
    this.settings = await Storage.get('settings');
    this.settings = { ...INIT_SETTINGS, ...this.settings };
    return this.settings;
  }

  public static async saveSettings(): Promise<void> {
    await Storage.set('settings', this.settings);
  }

  public static async setValue(key: string, value: any): Promise<void> {
    this.settings[key] = value;
    await this.saveSettings();
  }

  public static async getValue(key: string): Promise<any> {
    return this.settings[key];
  }

  // public static bind() {
  //   Storage.addListener((key, newValue, oldValue) => {
  //     if (key === 'settings') {
  //       this.settings = newValue;
  //     }
  //   });
  // }
}

const INIT_SETTINGS = {
  debug: false,
  token: null,
};
