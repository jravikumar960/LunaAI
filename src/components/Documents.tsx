import { useEffect, useState } from "react";
import {
  getDocuments,
  deleteDocument,
} from "../services/document";

interface DocumentItem {
  id: number;
  filename: string;
}

export default function Documents() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDocuments() {
    try {
      const data = await getDocuments();

      if (Array.isArray(data)) {
        setDocuments(data);
      } else {
        setDocuments([]);
      }
    } catch (error) {
      console.error(error);
      setDocuments([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  async function handleDelete(id: number) {
    try {
      await deleteDocument(id);
      loadDocuments();
    } catch (error) {
      console.error(error);
      alert("Unable to delete document.");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>📄 Documents</h2>

      {loading && <p>Loading documents...</p>}

      {!loading && documents.length === 0 && (
        <p>No PDFs uploaded.</p>
      )}

      {documents.map((doc) => (
        <div
          key={doc.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#1d2638",
            padding: "15px",
            borderRadius: "10px",
            marginTop: "15px",
          }}
        >
          <span>📄 {doc.filename}</span>

          <button
            onClick={() => handleDelete(doc.id)}
            style={{
              background: "#ff4d4f",
              color: "white",
              border: "none",
              padding: "8px 15px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}