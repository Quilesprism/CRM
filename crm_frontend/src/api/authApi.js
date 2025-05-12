const API_URL = "https://1cc3rjkx-8000.use2.devtunnels.ms/user";



function getToken() {
    return localStorage.getItem("token");
  }

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al iniciar sesión");
  }
  return await response.json();
}

export async function registerUser(data) {
  const response = await fetch(`${API_URL}/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al registrarse");
  }
  return await response.json();
}
