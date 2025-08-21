import { request } from "../utils/https.js";

export function listFolders() {
    return request("/api/folders");
}
export function createFolder(name) {
    return request("/api/folders", {
        method: "POST",
        body: JSON.stringify({ name }),
    });
}
export function renameFolder(id, name) {
    return request(`/api/folders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
    });
}
export function deleteFolder(id) {
    return request(`/api/folders/${id}`, { method: "DELETE" });
}
