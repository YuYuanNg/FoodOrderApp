const axios = require('axios');

module.exports = async function (context, req) {
    // 1. Define the CORS headers
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const orderData = req.body;
        // Ensure this is your actual Logic App URL
        const logicAppUrl = "https://prod-78.southeastasia.logic.azure.com:443/workflows/..."; 
        
        // 2. Trigger the notification
        await axios.post(logicAppUrl, orderData);

        // 3. Return a successful response with headers
        context.res = {
            status: 200,
            headers: headers, 
            body: "Order received and notification sent!"
        };
    } catch (error) {
        // 4. Return an error response with headers so the browser can read it
        context.res = {
            status: 500,
            headers: headers,
            body: "Error processing order"
        };
    }
};
