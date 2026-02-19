
async function testLogin() {
    console.log("Testing Login...");
    try {
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@tradeverse.com', password: 'adminpassword123' })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (error) {
        console.error('Fetch Failed:', error.message);
    }
}

testLogin();
