"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocs() {
  const [spec, setSpec] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchSpec() {
      const response = await fetch("/api/docs");
      const data = await response.json();
      setSpec(data);
    }
    fetchSpec();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Documentação da API</h1>
      <div className="border rounded-lg overflow-hidden">
        <SwaggerUI spec={spec} />
      </div>
    </div>
  );
}
