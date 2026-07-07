export function exportChat(messages: any[]) {
  const text = messages
    .map((m) => `${m.role.toUpperCase()}\n${m.content}\n`)
    .join("\n----------------------------\n\n");

  const blob = new Blob([text], {
    type: "text/plain",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "Luna-Chat.txt";

  a.click();

  URL.revokeObjectURL(url);
}