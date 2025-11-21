/**
 * Safe localStorage utility with SSR compatibility and error handling
 */

interface StorageOptions {
  fallback?: any;
  serialize?: boolean;
}

class SafeStorage {
  private isClient = typeof window !== 'undefined';
  private isStorageAvailable = this.checkStorageAvailability();

  private checkStorageAvailability(): boolean {
    if (!this.isClient) return false;
    
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely get item from localStorage
   */
  get<T = any>(key: string, options: StorageOptions = {}): T | null {
    const { fallback = null, serialize = true } = options;

    if (!this.isStorageAvailable) {
      console.warn(`localStorage not available, returning fallback for key: ${key}`);
      return fallback;
    }

    try {
      const value = localStorage.getItem(key);
      if (value === null) return fallback;
      
      return serialize ? JSON.parse(value) as T : value as T;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return fallback;
    }
  }

  /**
   * Safely set item to localStorage
   */
  set<T = any>(key: string, value: T, options: StorageOptions = {}): boolean {
    const { serialize = true } = options;

    if (!this.isStorageAvailable) {
      console.warn(`localStorage not available, cannot set key: ${key}`);
      return false;
    }

    try {
      const serializedValue = serialize ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Safely remove item from localStorage
   */
  remove(key: string): boolean {
    if (!this.isStorageAvailable) {
      console.warn(`localStorage not available, cannot remove key: ${key}`);
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
      return false;
    }
  }

  /**
   * Safely clear localStorage
   */
  clear(): boolean {
    if (!this.isStorageAvailable) {
      console.warn('localStorage not available, cannot clear');
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    return this.isStorageAvailable;
  }
}

// Export singleton instance
export const safeStorage = new SafeStorage();

// Convenience functions for common patterns
export const getUserFromStorage = () => 
  safeStorage.get('user', { fallback: null });

export const setUserToStorage = (user: any) => 
  safeStorage.set('user', user);

export const removeUserFromStorage = () => 
  safeStorage.remove('user');