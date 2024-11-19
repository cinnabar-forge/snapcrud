import { getProjectVersion } from "./version.js";

const copyrightMarkup = `<div class="center unselectable small-font"><p><code>SnapCRUD ${getProjectVersion()} by <a href="https://cinnabar.ru">Cinnabar Forge</a> &copy; 2024</code></p></div>`;

/**
 *
 * @param title
 * @param bodyMarkup
 */
export function getHtmlPageTemplate(title: string, bodyMarkup: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - SnapCRUD</title>
  <link rel="icon" href="data:,">
</head>
<body>
  <div><h1>${title}</h1></div>
  ${bodyMarkup}
${copyrightMarkup}
</body>
</html>
`;
}
