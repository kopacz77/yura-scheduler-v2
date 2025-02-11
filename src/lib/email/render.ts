import { type EmailTemplate } from './types';

export function renderEmailTemplate(template: EmailTemplate): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            padding: 20px;
          }
          h1 { color: #2563eb; }
          .content { max-width: 600px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="content">
          ${template.content}
        </div>
      </body>
    </html>
  `;
}