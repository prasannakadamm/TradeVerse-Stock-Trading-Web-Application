const API_URL = "http://localhost:5000/api/auth";

export async function registerUser(data) {
    const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

export async function loginUser(data) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
}

export async function googleLogin(token) {
    const res = await fetch(`${API_URL}/google`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
    });

    if (!res.ok) {
        const text = await res.text();
        try {
            const json = JSON.parse(text);
            throw new Error(json.message || `Server error: ${res.status}`);
        } catch (e) {
            // If parsing fails, throw the text or generic error
            throw new Error(text || `Request failed with status ${res.status}`);
        }
    }

    return res.json();
}
