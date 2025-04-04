const API_URL = "http://localhost:8080"
const HEADERS = {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjZXNhci4xMjM0NSIsImlhdCI6MTc0MjkzMTEwOSwiZXhwIjoxNzQyOTY3MTA5fQ.WfC5WDIRi-OFERamn2DUVhUX9Vwte7akOYpGw-jaDC8",
    "Accept": "application/json"
};
export const httpCrudService = <T>(endpoint: string) => ({
    getAll: async (path: string): Promise<T[]> => {
        return fetch(`${API_URL}${endpoint}${path}`, {method: "GET", headers: HEADERS})
            .then(response => response.json())
            .catch(error => console.error(error));
    }
});