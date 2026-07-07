const API = "http://127.0.0.1:8000";

export async function getMemory() {
  const res = await fetch(`${API}/memory`);
  return await res.json();
}

export async function deleteMemory(key: string) {
  await fetch(`${API}/memory/${key}`, {
    method: "DELETE",
  });
}

export async function clearMemory() {
  await fetch(`${API}/memory`, {
    method: "DELETE",
  });
}