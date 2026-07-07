const API = "http://127.0.0.1:8000";

export async function getAutomation() {
  const res = await fetch(`${API}/automation`);
  return await res.json();
}

export async function addAutomation(
  title: string,
  remind_at: string
) {
  const res = await fetch(`${API}/automation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      remind_at,
    }),
  });

  return await res.json();
}

export async function deleteAutomation(id: number) {
  await fetch(`${API}/automation/${id}`, {
    method: "DELETE",
  });
}