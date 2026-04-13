/**
 * PDF Export Utility
 * Generate and download PDF reports
 */

export const generatePDFContent = (data) => {
  const { title, content, date, author } = data;
  
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .header { 
          border-bottom: 3px solid #5f7df0; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        h1 { color: #5f7df0; margin: 0 0 10px 0; }
        .meta { color: #888; font-size: 12px; }
        .content { line-height: 1.8; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
        td { padding: 10px; border-bottom: 1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="meta">
          Generated on ${new Date(date).toLocaleDateString()}
          ${author ? `| By ${author}` : ''}
        </div>
      </div>
      <div class="content">
        ${content}
      </div>
    </body>
    </html>
  `;
  
  return htmlContent;
};

export const downloadPDF = (htmlContent, filename) => {
  const element = document.createElement('a');
  const file = new Blob([htmlContent], { type: 'text/html' });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}_${Date.now()}.pdf`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const exportProjecttoCSV = (projects) => {
  const headers = ['Title', 'Student', 'Status', 'Progress', 'Deadline', 'Supervisor'];
  const rows = projects.map(p => [
    p.title,
    p.studentName,
    p.status,
    p.progress || '0%',
    p.deadline,
    p.supervisor
  ]);

  let csv = headers.join(',') + '\n';
  rows.forEach(row => {
    csv += row.map(cell => `"${cell}"`).join(',') + '\n';
  });

  const element = document.createElement('a');
  const file = new Blob([csv], { type: 'text/csv' });
  element.href = URL.createObjectURL(file);
  element.download = `projects_${Date.now()}.csv`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const generateReport = (data) => {
  const html = generatePDFContent({
    title: data.title || 'Report',
    content: `
      <table>
        <tr>
          <th>Metric</th>
          <th>Value</th>
        </tr>
        ${Object.entries(data).map(([key, value]) => 
          `<tr><td>${key}</td><td>${value}</td></tr>`
        ).join('')}
      </table>
    `,
    date: new Date(),
    author: localStorage.getItem('userName')
  });
  
  return html;
};
