// --- CONFIGURATION ---
const tenantId = "119b39b3-3572-4fbb-b434-1dd0e649dcaf";
const clientId = "dd47f4ca-42cf-4664-a139-2d179b2bf48a";
const clientSecret = " XfF8Q~g~2hIlLIi2Sq0FPYigMMS8zeNDhOR.laC7"; // Warning: Visible to public!
const scope = "api://<dd47f4ca-42cf-4664-a139-2d179b2bf48a>/.default"; 

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

// In your placeOrder function:
const token = await getAccessToken();
const response = await fetch(orderEndpoint, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`, // This is your "ID Card"
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(orderData)
});
