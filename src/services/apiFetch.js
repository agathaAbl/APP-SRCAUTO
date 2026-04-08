// src/services/apiFetch.js
export async function apiFetch(endpoint, options = {}) {
  const BASE_URL = 'https://srcauto-homolog.grupoabl.com.br/Api/SRC';
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": "Bearer 54e3c43014f1c35c0daeaec2a155b5b4", 
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers, 
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (err) {
    console.error("⚠️ API Error:", err);
    throw err;
  }
}