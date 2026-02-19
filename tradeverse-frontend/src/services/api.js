const BASE_URL = "http://localhost:5000/api";

export async function authFetch(endpoint) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}
