const API = "http://127.0.0.1:8000";

export async function analyzeImage(
  file: File,
  prompt: string
) {
  const form = new FormData();

  form.append("image", file);
  form.append("prompt", prompt);

  const res = await fetch(`${API}/vision`, {
    method: "POST",
    body: form,
  });

  return await res.json();
}