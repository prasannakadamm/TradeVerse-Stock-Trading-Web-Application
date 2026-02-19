import fs from 'fs';

const BASE_URL = 'http://localhost:5000';
const EMAIL = 'demo@tradeverse.com';
const PASSWORD = 'password123';

const log = (msg) => {
    console.log(msg);
    fs.appendFileSync('verify_result.txt', msg + '\n');
};

async function verify() {
    fs.writeFileSync('verify_result.txt', 'Starting Verification...\n');
    log('1. Testing Login...');
    try {
        const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            throw new Error(`Login failed: ${loginRes.status} ${err}`);
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        log('✅ Login Successful. Token received.');

        log('2. Testing Portfolio Endpoint...');
        const portfolioRes = await fetch(`${BASE_URL}/api/portfolio`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!portfolioRes.ok) {
            const err = await portfolioRes.text();
            throw new Error(`Portfolio fetch failed: ${portfolioRes.status} ${err}`);
        }

        const portfolioData = await portfolioRes.json();
        log('✅ Portfolio Data received.');

        if (portfolioData.orders && Array.isArray(portfolioData.orders)) {
            log(`✅ Orders array present with ${portfolioData.orders.length} items.`);
        } else {
            log('❌ Orders array missing or invalid.');
        }

        log('Verification Complete!');

    } catch (error) {
        log(`❌ Verification Failed: ${error.message}`);
    }
}

verify();
