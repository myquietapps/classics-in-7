const STORAGE_PREFIX = 'c7_';

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(STORAGE_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  },

  // Konkretne ustawienia aplikacji
  getTheme() {
    return this.get('theme', 'nocturne'); // Domyślnie Nocturne
  },

  setTheme(themeName) {
    this.set('theme', themeName);
  },

  getLang() {
    return this.get('lang', 'en'); // Domyślnie angielski
  },

  setLang(langCode) {
    this.set('lang', langCode);
  }
};
