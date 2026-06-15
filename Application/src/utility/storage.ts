import { load } from '@tauri-apps/plugin-store';

type StorageKey = 'App.Language';

const storage = await load('application.bin');

/**
 * setValue - Stores a plaintext value in persistent storage
 * @param {StorageKey} key - The storage key name
 * @param {string} value - The plaintext string value to store
 * @returns {Promise<void>} Resolves after value is saved
 */
export const setValue = async(key: StorageKey, value: string) =>
{
    await storage.set(key, value);

    await storage.save();
};

/**
 * getValue - Retrieves a plaintext value from persistent storage
 * @param {StorageKey} key - The storage key name
 * @returns {Promise<string | undefined>} Stored string or undefined if not set
 */
export const getValue = async(key: StorageKey) =>
{
    return storage.get<string>(key);
};
