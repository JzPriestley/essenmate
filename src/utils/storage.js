export const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getFromStorage = (key, fallback = []) => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return data ?? fallback;
  } catch {
    return fallback;
  }
};
