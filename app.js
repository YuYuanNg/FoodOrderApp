// --- CONFIGURATION ---
const API_KEY = "__AZURE_KEY_PLACEHOLDER__";
const orderEndpoint = "https://foodorder-app.azurewebsites.net/api/OrderTrigger";
const LOGIC_APP_URL = "https://prod-78.southeastasia.logic.azure.com:443/workflows/...";

// --- MAIN ORDER FUNCTION ---
async function placeOrder(itemName, price) {
    
    // 1. Create the data object (Principle B)
    const orderPayload = {
        orderId: "ORD-" + Date.now(),
        email: localStorage.getItem('userEmail'),
        status: "Submitted",
        message: `New order for ${itemName}`
    };

    try {
        // 2. Call the Function App (To save to Cosmos DB)
        // Principle D: Securely using the x-functions-key
        const response = await fetch(orderEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-functions-key': API_KEY 
            },
            body: JSON.stringify(orderPayload)
        });

        if (response.ok) {
            console.log("Order saved to database.");
            
            // 3. Trigger the Notification (Logic App)
            // This ensures the user gets an email immediately
            await sendNotification(orderPayload);
            
            document.getElementById('status-display').innerText = `Success! Order ${orderPayload.orderId} is confirmed.`;
        }
    } catch (error) {
        console.error("Error during peak period:", error);
        document.getElementById('status-display').innerText = "Order failed. Please try again.";
    }
}

// --- HELPER FUNCTION FOR NOTIFICATIONS ---
async function sendNotification(orderData) {
    await fetch(LOGIC_APP_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
}
