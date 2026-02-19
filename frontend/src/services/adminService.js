const API_URL = "http://localhost:5000/api/admin";

export async function fetchAllUsers() {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch users");
    }

    return res.json();
}

export async function fetchUserDetails(id) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to fetch user details");
    }

    return res.json();
}
