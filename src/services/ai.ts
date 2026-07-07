const API = "http://127.0.0.1:8000";

export async function askLuna(message: string) {
  const response = await fetch(`${API}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
    }),
  });

  return await response.json();
}

export async function uploadPDF(file: File) {
  const form = new FormData();

  form.append("file", file);

  const response = await fetch(`${API}/upload-pdf`, {
    method: "POST",
    body: form,
  });

  return await response.json();
}