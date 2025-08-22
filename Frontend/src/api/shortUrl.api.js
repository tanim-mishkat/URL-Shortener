import { request } from "../utils/https.js";

export async function createShortUrl(url, slug) {
    const body = { url };
    if (slug && slug.trim()) body.slug = slug.trim();
    const data = await request("/api/create", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return data.shortUrl;
}

export async function updateLinkStatus(id, status) {
    return request(`/api/links/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });
}

export async function softDeleteLink(id) {
    return request(`/api/links/${id}`, { method: "DELETE" });
}

export async function hardDeleteLink(id) {
    return request(`/api/links/${id}/permanent`, { method: "DELETE" });
}

export async function updateLinkTags(id, tags = []) {
    return request(`/api/links/${id}/tags`, {
        method: "PATCH",
        body: JSON.stringify({ tags }),
    });
}

export async function moveLinkToFolder(id, folderId) {
    return request(`/api/links/${id}/folder`, {
        method: "PATCH",
        body: JSON.stringify({ folderId }),
    });
}

export async function listLinks({ limit = 50, cursor, folderId, q, status, tags } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (cursor) params.set("cursor", cursor);
  if (folderId === "unfiled") params.set("folderId", "null");
  else if (folderId) params.set("folderId", folderId);
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (tags?.length) params.set("tags", tags.join(","));
  return request(`/api/links?${params.toString()}`);
}

export async function batchLinks(op, ids, payload = {}) {
  return request(`/api/links/batch`, {
    method: "POST",
    body: JSON.stringify({ op, ids, payload }),
  });
}

export async function restoreLink(id) {
  return request(`/api/links/${id}/restore`, { method: "PATCH" });
}
