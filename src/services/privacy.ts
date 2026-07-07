const API = "http://127.0.0.1:8000";

export async function clearAllPrivacy() {

  const res = await fetch(`${API}/privacy/all`, {
    method: "DELETE",
  });

  return await res.json();
}