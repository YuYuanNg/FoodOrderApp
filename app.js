// --- CONFIGURATION ---
const API_KEY = "U0wJrkQNj_IDxMz-P9pU5DPMUP30BaJytMIXYGhP_x7hAzFuvtGXPw=="; 

// FIX: Added "-function" to the URL to match your actual Azure site name
const orderEndpoint = `https://foodorder-function-app.azurewebsites.net/api/OrderTrigger?code=${API_KEY}`;
const LOGIC_APP_URL = "https://prod-78.southeastasia.logic.azure.com:443/workflows/...";

// --- 1. LOGIN FUNCTION ---
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    if (email && pass) {
        localStorage.setItem('userEmail', email);
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        console.log("User logged in:", email);
    } else {
        alert("Please enter both email and password.");
    }
}

// --- 2. MAIN ORDER FUNCTION ---
async function placeOrder(itemName, price) {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.innerText = "Processing your order...";

    const orderPayload = {
        orderId: "ORD-" + Date.now(),
        email: localStorage.getItem('userEmail'),
        item: itemName,
        amount: price,
        status: "Submitted",
        timestamp: new Date().toISOString()
    };

    try {
        // BYPASS: Headers simplified to 'text/plain' to skip OPTIONS preflight
        const response = await fetch(orderEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain' 
            },
            body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
            console.log("Order saved to Cosmos DB successfully.");
            await sendNotification(orderPayload);
            statusDisplay.innerText = `Success! Order ${orderPayload.orderId} for ${itemName} confirmed.`;
        } else {
            throw new Error("Failed to reach Azure Function");
        }
    } catch (error) {
        console.error("Communication Error:", error);
        statusDisplay.innerText = "Order failed. Check console for details.";
    }
}

// --- 3. HELPER FUNCTION FOR NOTIFICATIONS ---
async function sendNotification(orderData) {
    try {
        await fetch(LOGIC_APP_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        console.log("Notification sent to Logic App.");
    } catch (err) {
        console.error("Notification failed:", err);
    }
}
