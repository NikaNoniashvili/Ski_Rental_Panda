// api.js — ერთადერთი ადგილი, საიდანაც ჩვენი საიტი backend-ს ესაუბრება

const API = {
    async get(endpoint, lang) {
        const response = await fetch(`/api/${endpoint}?lang=${lang}`);

        if (!response.ok) {
            console.error(`API შეცდომა: ${endpoint}`, response.status);
            return null;
        }

        return await response.json();
    }
};