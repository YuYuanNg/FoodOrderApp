// --- CONFIGURATION ---
// Principle D: The GitHub Action will replace this placeholder with your real secret
const API_KEY = "__AZURE_KEY_PLACEHOLDER__"; 
const orderEndpoint = "https://foodorder-app.azurewebsites.net/api/OrderTrigger";
const LOGIC_APP_URL = "https://prod-78.southeastasia.logic.azure.com:443/workflows/..."; // Ensure this is your full URL

// --- 1. LOGIN FUNCTION ---
// This matches the onclick="handleLogin()" in your index.html
function handleLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;

    if (email && pass) {
        // Principle B: Save email to track who is ordering
        localStorage.setItem('userEmail', email);
        
        // Principle A: Smooth transition from login to menu
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('app-section').style.display = 'block';
        console.log("User logged in:", email);
    } else {
        alert("Please enter both email and password.");
    }
}

// --- 2. MAIN ORDER FUNCTION ---
// Triggered when a user clicks a menu item button
async function placeOrder(itemName, price) {
    const statusDisplay = document.getElementById('status-display');
    statusDisplay.innerText = "Processing your order...";

    // Create the data object for Azure Cosmos DB
    const orderPayload = {
        orderId: "ORD-" + Date.now(),
        email: localStorage.getItem('userEmail'),
        item: itemName,
        amount: price,
        status: "Submitted",
        timestamp: new Date().toISOString()
    };

    try {
        // Principle D: Securely calling Azure Function using the injected API Key
        const response = await fetch(orderEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-functions-key': API_KEY 
            },
            body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
            console.log("Order saved to Cosmos DB successfully.");
            
            // Principle B: Trigger the Notification (Logic App) to send email
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
// Sends data to Azure Logic Apps to trigger the email workflow
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
