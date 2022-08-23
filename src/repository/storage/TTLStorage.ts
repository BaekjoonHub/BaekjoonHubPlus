import { Storage } from './storage';

const prefix = 'boj-hp-ttl-' as const;
// save localstorage ttl 7 days expired.
export class TTLStorage extends Storage {
  public static async get(key: string): Promise<any> {
    key = prefix + key;
    const data = await Storage.get(key);
    if (this.isExpired(data)) {
      await Storage.remove(key);
      return null;
    }
    return data.value;
  }
  public static async set(key: string, value: any, ttl: number = 7): Promise<void> {
    const data = {
      value,
      expired: new Date().getTime() + ttl * 24 * 60 * 60 * 1000,
    };
    return Storage.set(prefix + key, data);
  }
  public static async remove(key: string): Promise<void> {
    return Storage.remove(prefix + key);
  }
  public static async getAll(): Promise<{ [key: string]: any }> {
    const data = await Storage.getAll();
    const result: { [key: string]: any } = {};
    for (const key in data) {
      if (key.startsWith(prefix)) {
        if (this.isExpired(data[key])) {
          Storage.remove(key);
          continue;
        }
        result[key.slice(prefix.length)] = data[key];
      }
    }
    return result;
  }
  public static async clear(): Promise<void> {
    await Storage.getAll().then((data) =>
      Promise.all(
        Object.keys(data)
          .filter((key) => key.startsWith(prefix))
          .map((key) => Storage.remove(key))
      )
    );
  }
  private static isExpired(data: any): boolean {
    return !!data?.expired && data.expired < new Date().getTime();
  }
}
