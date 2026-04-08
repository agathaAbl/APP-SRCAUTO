// src/api/apiFetch.js
export async function apiFetch(endpoint, options = {}) {
  const url = `http://172.19.10.49/ESP.NetEnvironment/API/AVA${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Basic 54e3c43014f1c35c0daeaec2a155b5b4",
    "Accept": "application/json"
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
      throw new Error(errorText);
    }

    return await response.json();
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}