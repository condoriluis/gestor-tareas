import { NextResponse } from 'next/server';

export async function GET() {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <title>API Gestor de Tareas - Documentación Técnica</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="Documentación oficial de la API para el sistema de Gestión de Tareas">
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui.css" />
        <style>
          .swagger-ui .topbar {
            background-color: #2c3e50;
            padding: 10px 0;
          }
          .swagger-ui .information-container {
            background: #f8f9fa;
          }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://unpkg.com/swagger-ui-dist@4.15.5/swagger-ui-bundle.js"></script>
        <script>
          window.onload = () => {
            window.ui = SwaggerUIBundle({
              url: '/api/doc-swagger',
              dom_id: '#swagger-ui',
              deepLinking: true,
              presets: [
                SwaggerUIBundle.presets.apis,
              ],
              layout: "BaseLayout",
              displayRequestDuration: true,
              docExpansion: 'none',
              filter: false,
              tryItOutEnabled: false,
              requestSnippetsEnabled: true,
              requestSnippets: {
                generators: {
                  curl_bash: {
                    title: "cURL (bash)",
                    syntax: "bash"
                  },
                  curl_powershell: {
                    title: "cURL (PowerShell)",
                    syntax: "powershell"
                  }
                },
                defaultExpanded: true,
                languages: ['curl_bash', 'curl_powershell']
              },
              syntaxHighlight: {
                activate: true,
                theme: "agate"
              },
              validatorUrl: null
            });
          };
        </script>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}