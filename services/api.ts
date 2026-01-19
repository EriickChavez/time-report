import { BASE_URL } from "./services";

const api = {
    post: async (url: string, data: Record<string, any>) => {
        console.log("URL", BASE_URL, url);
        console.log("DATA", data);
        const response = await fetch(BASE_URL + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        return response.json();
    },
    get: async (url: string) => {
        const response = await fetch(BASE_URL + url);
        return response.json();
    },
    delete: async (url: string, id: string) => {
        const response = await fetch(BASE_URL + url + `?id=${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    },
};

export default api;
