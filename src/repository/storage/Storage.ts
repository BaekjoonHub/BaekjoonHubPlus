export class Storage {
  public static async get(key: string): Promise<any> {
    return getObjectFromLocalStorage(key);
  }
  public static async set(key: string, value: any): Promise<void> {
    return saveObjectInLocalStorage({ [key]: value });
  }
  public static async remove(key: string): Promise<void> {
    return removeObjectFromLocalStorage(key);
  }
  public static async getAll(): Promise<{ [key: string]: any }> {
    return getObjectFromLocalStorage(null);
  }
  /**
   * @deprecated
   */
  public static clear(): void {
    chrome.storage.local.clear();
  }
  public static addListener(callback: (key: string, newValue: any, oldValue: any) => void): void {
    chrome.storage.onChanged.addListener(function (changes: { [key: string]: chrome.storage.StorageChange }, areaName: 'sync' | 'local' | 'managed') {
      if (areaName !== 'local') return;
      for (const key in changes) {
        const storageChange = changes[key];
        callback(key, storageChange.newValue, storageChange.oldValue);
      }
    });
  }
}

/**
 * @author https://gist.github.com/sumitpore/47439fcd86696a71bf083ede8bbd5466
 * Chrome의 Local StorageArea에서 개체 가져오기
 */
export async function getObjectFromLocalStorage(key: string | null): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get(key, function (value: any) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(value[key!]);
        }
      });
    } catch (ex) {
      reject(ex);
    }
  });
}

/**
 * @author https://gist.github.com/sumitpore/47439fcd86696a71bf083ede8bbd5466
 * Chrome의 Local StorageArea에 개체 저장
 */
export async function saveObjectInLocalStorage(obj: { [x: string]: any }) {
  return new Promise<void>((resolve, reject) => {
    try {
      chrome.storage.local.set(obj, function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * @author https://gist.github.com/sumitpore/47439fcd86696a71bf083ede8bbd5466
 * Chrome Local StorageArea에서 개체 제거
 */
export async function removeObjectFromLocalStorage(keys: string | string[]): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    try {
      chrome.storage.local.remove(keys, function () {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve();
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
