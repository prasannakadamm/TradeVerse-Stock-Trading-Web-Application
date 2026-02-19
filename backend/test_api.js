// Native fetch is available in Node 22

async function test() {
    console.log("Testing connection to http://localhost:5000/api/auth/google...");
    try {
        const response = await fetch('http://localhost:5000/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: 'dummy_token_from_test_script' })
        });

        const text = await response.text();
        console.log('Status:', response.status);
        console.log('Body:', text);
    } catch (error) {
        console.error('Fetch Failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

test();
