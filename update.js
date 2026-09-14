const fs = require('fs');

async function updateData() {
  const sheetUrl = 'https://docs.google.com/spreadsheets/d/1r6Apc6lB9HJTek6x_PDOxSgdC6KtoL9SZUXIUdnSQVw/export?format=csv&gid=0';
  const response = await fetch(sheetUrl);
  const csvText = await response.text();

  const rows = csvText.split('\n').map(row => row.trim()).filter(row => row);
  
  const parsedData = rows.slice(1).map(row => {
    const cols = row.split(',');
    const name = cols[0].replace(/^"|"$/g, '').trim();
    const entries = parseInt(cols[1], 10) || 0;
    const sum = parseFloat(cols[2]) || 0;
    return { name, entries, sum };
  });

  parsedData.sort((a, b) => b.sum - a.sum);

  const supportersList = parsedData.map(item => {
    return `    ["${item.name}", ${item.entries}]`;
  }).join(',\n');

  const dateOpts = { day: 'numeric', month: 'long', timeZone: 'Asia/Bangkok' };
  const dateStr = new Date().toLocaleDateString('th-TH', dateOpts);

  const dataJsContent = `const CONFIG = {
  openTime  : '2026-10-01T12:00:00+07:00',
  closeTime : '2026-11-12T12:00:00+07:00',
  resultDay : '2026-11-14T00:00:00+07:00',
  donationDisclaimer : '<span style="color: #22c55e;">●</span> อัปเดตล่าสุดเมื่อ ${dateStr} 23.59 น.',
  supportersList: [
${supportersList}
  ]
};`;

  fs.writeFileSync('data.js', dataJsContent);
}

updateData();
