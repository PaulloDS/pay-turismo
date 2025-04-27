import { createSwaggerSpec } from "next-swagger-doc";

export const getApiDocs = () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // Pasta onde estão os endpoints da API
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API de Gestão de Agências de Turismo",
        version: "1.0.0",
        description:
          "Documentação da API para o sistema de gestão de agências de turismo",
        contact: {
          name: "PAYLINK Turismo",
          url: "https://paylinkturismo.com",
        },
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [
        {
          BearerAuth: [],
        },
      ],
      tags: [
        {
          name: "Agências",
          description: "Operações relacionadas a agências de turismo",
        },
        {
          name: "Autenticação",
          description: "Operações de autenticação e registro",
        },
      ],
    },
  });
  return spec;
};
