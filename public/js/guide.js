// Guide page - loads sections with preview and copy button
// Page can override 'sections' and 'basePath' before loading this script

// Default config (Pixel 10 Pro XL) - pages can override before this script loads
if (typeof sections === 'undefined') {
  var sections = [
    { id: 'intro', title: 'Introduction', file: 'post-01-intro.bbcode' },
    { id: 'cases-hardened', title: 'Cases - Hardened', file: 'post-02-cases-hardened.bbcode' },
    { id: 'cases-tough', title: 'Cases - Tough', file: 'post-03-cases-tough.bbcode' },
    { id: 'cases-basic', title: 'Cases - Basic', file: 'post-04-cases-basic.bbcode' },
    { id: 'case-stores', title: 'Case Stores', file: 'post-05-case-stores.bbcode' },
    { id: 'screen-protectors', title: 'Screen Protectors', file: 'post-06-screen-protectors.bbcode' },
    { id: 'skins', title: 'Skins', file: 'post-07-skins.bbcode' },
    { id: 'chargers', title: 'Chargers', file: 'post-08-chargers.bbcode' },
    { id: 'miscellaneous', title: 'Miscellaneous', file: 'post-09-miscellaneous.bbcode' }
  ];
}

if (typeof basePath === 'undefined') {
  var basePath = '/_data/Google/Pixel 10 Pro XL/output/';
}

document.addEventListener('DOMContentLoaded', loadSections);

async function loadSections() {
  const container = document.getElementById('guide-content');
  container.innerHTML = '';

  for (const section of sections) {
    try {
      const response = await fetch(basePath + section.file);
      const bbcode = await response.text();
      container.insertAdjacentHTML('beforeend', renderSection(section, bbcode));
    } catch (err) {
      console.error('Failed to load', section.file, err);
    }
  }

  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => copySection(btn));
  });
}

function renderSection(section, bbcode) {
  // Use bbcodeToHtml for all sections now
  let preview = bbcodeToHtml(bbcode);

  return `
    <div class="guide-section" id="${section.id}" data-bbcode="${encodeURIComponent(bbcode.trim())}">
      <div class="section-header">${section.title}</div>
      <div class="section-preview">${preview}</div>
      <div class="copy-section">
        <button class="copy-btn">📋 Copy BBCode</button>
      </div>
    </div>
  `;
}

function bbcodeToHtml(bb) {
  let html = bb.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Remove formatting tags
  html = html.replace(/\[FONT=verdana\]/gi, '');
  html = html.replace(/\[\/FONT\]/gi, '');
  html = html.replace(/\[CENTER\]/gi, '');
  html = html.replace(/\[\/CENTER\]/gi, '');
  html = html.replace(/\[SIZE=\d+\]/gi, '');
  html = html.replace(/\[\/SIZE\]/gi, '');

  // Headings
  html = html.replace(/\[HEADING=1\](.+?)\[\/HEADING\]/gis, '<h2>$1</h2>');
  html = html.replace(/\[HEADING=2\](.+?)\[\/HEADING\]/gis, '<h3>$1</h3>');

  // Basic formatting
  html = html.replace(/\[B\](.+?)\[\/B\]/gi, '<strong>$1</strong>');
  html = html.replace(/\[I\](.+?)\[\/I\]/gi, '<em>$1</em>');
  html = html.replace(/\[U\](.+?)\[\/U\]/gi, '<u>$1</u>');

  // Links
  html = html.replace(/\[URL='([^']+)'\](.+?)\[\/URL\]/gi, '<a href="$1" target="_blank">$2</a>');
  html = html.replace(/\[URL=([^\]]+)\](.+?)\[\/URL\]/gi, '<a href="$1" target="_blank">$2</a>');

  // Images - divider lines become hr
  html = html.replace(/\[IMG\]https:\/\/xdaforums\.com\/attachments\/600x100_line[^\[]*\[\/IMG\]/gi, '<hr>');
  html = html.replace(/\[IMG\][^\[]*\[\/IMG\]/gi, '');

  // HR
  html = html.replace(/\[HR\]\[\/HR\]/gi, '<hr>');

  // Spoilers -> HTML details/summary (collapsible)
  html = html.replace(/\[SPOILER=([^\]]+)\]([\s\S]*?)\[\/SPOILER\]/gi, '<details class="spoiler"><summary>$1</summary><div class="spoiler-content">$2</div></details>');
  html = html.replace(/\[SPOILER\]([\s\S]*?)\[\/SPOILER\]/gi, '<details class="spoiler"><summary>Details</summary><div class="spoiler-content">$1</div></details>');

  // Lists
  html = html.replace(/\[LIST=1\]\n?([\s\S]*?)\[\/LIST\]/gi, (m, content) => {
    const items = content.split(/\[\*\]/).filter(i => i.trim()).map(i => `<li>${i.trim()}</li>`).join('');
    return `<ol>${items}</ol>`;
  });
  html = html.replace(/\[LIST\]\n?([\s\S]*?)\[\/LIST\]/gi, (m, content) => {
    const items = content.split(/\[\*\]/).filter(i => i.trim()).map(i => `<li>${i.trim()}</li>`).join('');
    return `<ul>${items}</ul>`;
  });

  // Tables
  html = html.replace(/\[TABLE\]/gi, '<table>');
  html = html.replace(/\[\/TABLE\]/gi, '</table>');
  html = html.replace(/\[TR\]\s*/gi, '<tr>');
  html = html.replace(/\s*\[\/TR\]/gi, '</tr>');
  html = html.replace(/\[TH\](.+?)\[\/TH\]/gi, '<th>$1</th>');
  html = html.replace(/\[TD\](.+?)\[\/TD\]/gi, '<td>$1</td>');

  // Cleanup
  html = html.replace(/\n{3,}/g, '\n\n');
  html = html.replace(/<h[23][^>]*>\s*<\/h[23]>/gi, '');

  return html;
}

async function copySection(btn) {
  const section = btn.closest('.guide-section');
  const bbcode = decodeURIComponent(section.dataset.bbcode);

  try {
    await navigator.clipboard.writeText(bbcode);
    btn.classList.add('copied');
    btn.textContent = '✓ Copied!';
    showToast('BBCode copied to clipboard');
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.textContent = '📋 Copy BBCode';
    }, 2000);
  } catch (err) {
    showToast('Failed to copy');
  }
}

function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}
