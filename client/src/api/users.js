// client/src/api/users.js
import { api } from "./base";

export function listUsers({ q = "", page = 1, limit = 20 } = {}) {
  const params = new URLSearchParams({ q, page, limit });
  return api(`/api/users?${params.toString()}`);
}

export function getUser(id) {
  return api(`/api/users/${id}`);
}

export function createUser(payload) {
  return api("/api/users", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateUser(id, payload) {
  return api(`/api/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteUser(id) {
  return api(`/api/users/${id}`, {
    method: "DELETE",
  });
}
