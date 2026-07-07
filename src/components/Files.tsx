import { useEffect, useState } from "react";

interface FileItem {
  name: string;
  path: string;
}

export default function Files() {
  const [keyword, setKeyword] = useState("");
  const [files, setFiles] = useState<FileItem[]>([]);

  async function search() {
    if (!keyword.trim()) return;

    const res = await fetch(
      `http://127.0.0.1:8000/files/${encodeURIComponent(keyword)}`
    );

    const data = await res.json();

    setFiles(data);
  }

  useEffect(() => {
    search();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>📂 File Search</h2>

      <br />

      <input
        type="text"
        placeholder="Search files..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          width: "70%",
          padding: 12,
          borderRadius: 8,
        }}
      />

      <button
        onClick={search}
        style={{
          marginLeft: 10,
          padding: "12px 20px",
        }}
      >
        Search
      </button>

      <br />
      <br />

      {files.map((file, index) => (
        <div
          key={index}
          style={{
            background: "#1d2638",
            padding: 15,
            borderRadius: 10,
            marginBottom: 10,
          }}
        >
          <strong>{file.name}</strong>

          <br />

          <small>{file.path}</small>
        </div>
      ))}
    </div>
  );
}