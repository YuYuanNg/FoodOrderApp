const axios = require('axios');

module.exports = async function (context, req) {
    // These headers fix the "failed" error in the browser
    const headers = {
        "Access-Control-Allow-Origin": "https://yuyuanng.github.io",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    };

    try {
        const orderData = req.body;
        // Ensure this matches your Logic App "HTTP POST URL"
        const logicAppUrl = "https://prod-78.southeastasia.logic.azure.com:443/workflows/..."; 
        
        await axios.post(logicAppUrl, orderData);

        context.res = {
            status: 200,
            headers: headers,
            body: "Order received!"
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: headers,
            body: "Error: " + error.message
        };
    }
};
