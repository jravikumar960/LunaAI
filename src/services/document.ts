const API = "http://127.0.0.1:8000";

export async function getDocuments() {
  const res = await fetch(`${API}/documents`);
  return await res.json();
}

export async function getDocument(id: number) {
  const res = await fetch(`${API}/documents/${id}`);
  return await res.json();
}

export async function deleteDocument(id: number) {
  await fetch(`${API}/documents/${id}`, {
    method: "DELETE",
  });
}