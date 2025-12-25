// --- CONFIGURATION ---
const tenantId = "119b39b3-3572-4fbb-b434-1dd0e649dcaf";
const clientId = "dd47f4ca-42cf-4664-a139-2d179b2bf48a";
const clientSecret = "XfF8Q~g~2hIlLIi2Sq0FPYigMMS8zeNDhOR.laC7"; 
const scope = "api://dd47f4ca-42cf-4664-a139-2d179b2bf48a/.default"; // Use .default for Client Credentials
const orderEndpoint = "https://foodorder-function-app-bweycfeqf8guevcj.southeastasia-01.azurewebsites.net/api/OrderTrigger";

async function getAccessToken() {
    const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);
    params.append('scope', scope);
    params.append('grant_type', 'client_credentials');

    const response = await fetch(url, { method: 'POST', body: params });
    const data = await response.json();
    return data.access_token;
}

// WRAP EVERYTHING IN AN ASYNC FUNCTION
async function placeOrder(orderData) {
    try {
        const statusElement = document.getElementById('orderStatus');
        statusElement.innerText = "Processing order...";

        // 1. Get the "Identity Card" (Token)
        const token = await getAccessToken();

        // 2. Send the order with the Token in the header
        const response = await fetch(orderEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });

        if (response.ok) {
            statusElement.innerText = "Order Success!";
        } else {
            statusElement.innerText = "Order failed. Check console.";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('orderStatus').innerText = "Communication Error.";
    }
}
