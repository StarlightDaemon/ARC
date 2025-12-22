/**
 * YAML Data Loader for Web Display
 * Loads device YAML data and renders HTML tables
 * Works client-side with js-yaml library
 */

// Load js-yaml from CDN if not available
if (typeof jsyaml === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js';
    script.onload = initGuide;
    document.head.appendChild(script);
} else {
    document.addEventListener('DOMContentLoaded', initGuide);
}

let deviceData = null;

async function initGuide() {
    const container = document.getElementById('guide-content');
    if (!container) return;

    // Get device slug from page config or URL
    const deviceSlug = window.deviceSlug || getDeviceSlugFromPath();

    try {
        container.innerHTML = '<p>Loading accessories data...</p>';

        // Fetch YAML file
        const response = await fetch(`/_data/devices/${deviceSlug}.yml`);
        if (!response.ok) throw new Error(`Failed to load ${deviceSlug}.yml`);

        const yamlText = await response.text();
        deviceData = jsyaml.load(yamlText);

        // Render all sections
        renderGuide(container, deviceData);

        // Setup copy buttons
        setupCopyButtons();

    } catch (error) {
        container.innerHTML = `<p class="error">Error loading guide: ${error.message}</p>`;
        console.error(error);
    }
}

function getDeviceSlugFromPath() {
    // Extract device slug from URL path like /google/pixel-10-pro-xl.html
    const path = window.location.pathname;
    const match = path.match(/\/([^/]+)\.html$/);
    return match ? match[1] : 'pixel-10-pro-xl';
}

function renderGuide(container, data) {
    let html = '';

    // Device Header
    html += renderDeviceHeader(data.device, data.meta);

    // Chargers Section
    if (data.chargers) {
        html += renderSection('chargers', 'Chargers', [
            renderChargerTier(data.chargers.wired_tier1, 'wired'),
            renderChargerTier(data.chargers.wired_tier2, 'wired-slow'),
            renderWirelessChargers(data.chargers.wireless),
            renderPowerBanks(data.chargers.power_banks)
        ].join(''));
    }

    // Cases Section
    if (data.cases) {
        html += renderSection('cases', 'Cases', [
            renderCasesTable(data.cases.rugged, 'rugged'),
            renderCasesTable(data.cases.aramid, 'aramid'),
            renderEverydayCases(data.cases.everyday)
        ].join(''));
    }

    // Screen Protectors
    if (data.screen_protectors) {
        html += renderSection('screen-protectors', 'Screen Protectors',
            renderScreenProtectors(data.screen_protectors));
    }

    // Cooling
    if (data.cooling) {
        html += renderSection('cooling', data.cooling.title,
            renderCooling(data.cooling));
    }

    // Gaming
    if (data.gaming) {
        html += renderSection('gaming', data.gaming.title,
            renderGaming(data.gaming));
    }

    // Mounts
    if (data.mounts) {
        html += renderSection('mounts', data.mounts.title,
            renderMounts(data.mounts));
    }

    container.innerHTML = html;
}

function renderDeviceHeader(device, meta) {
    const notes = device.notes ? device.notes.map(n => `<li>⚠️ ${n}</li>`).join('') : '';

    return `
    <div class="device-header">
        <h2>${device.name}</h2>
        <div class="device-specs">
            <ul>
                <li><strong>Wired:</strong> ${device.specs.wired_charging}</li>
                <li><strong>Wireless:</strong> ${device.specs.wireless_charging}</li>
                <li><strong>Display:</strong> ${device.specs.display}</li>
                <li><strong>Fingerprint:</strong> ${device.specs.fingerprint}</li>
                ${device.specs.has_magnets ? '<li>✅ Built-in Qi2 magnets</li>' : ''}
            </ul>
        </div>
        ${notes ? `<div class="device-notes"><ul>${notes}</ul></div>` : ''}
        <p class="meta">Last updated: ${meta.last_updated} | Maintained by: ${meta.maintained_by}</p>
    </div>
    `;
}

function renderSection(id, title, content) {
    return `
    <div class="guide-section" id="${id}">
        <div class="section-header">${title}</div>
        <div class="section-preview">${content}</div>
        <div class="copy-section">
            <button class="copy-btn" data-section="${id}">📋 Copy BBCode</button>
        </div>
    </div>
    `;
}

function renderChargerTier(tier, type) {
    if (!tier || !tier.items) return '';

    const rows = tier.items.map(item => `
        <tr class="${item.avoid ? 'avoid' : ''} ${item.highlight ? 'highlight' : ''}">
            <td>${item.brand}</td>
            <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
            <td>${item.watts ? item.watts + 'W' : '-'}</td>
            <td>${item.pps_range || '-'}</td>
            <td>${item.avoid ? '⚠️' : '✅'} ${item.pixel_speed || '-'}</td>
            <td>${item.url ? `<a href="${item.url}" target="_blank">$${item.price_usd || 'Link'}</a>` : item.notes || '-'}</td>
        </tr>
    `).join('');

    return `
    <h3>${tier.title}</h3>
    <p><em>${tier.description || ''}</em></p>
    <table>
        <thead>
            <tr>
                <th>Brand</th>
                <th>Model</th>
                <th>Watts</th>
                <th>PPS Range</th>
                <th>Pixel Speed</th>
                <th>Links</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderWirelessChargers(wireless) {
    if (!wireless || !wireless.items) return '';

    const rows = wireless.items.map(item => `
        <tr class="${item.highlight ? 'highlight' : ''}">
            <td>${item.brand}</td>
            <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
            <td>${item.speed}</td>
            <td>${item.has_cooling ? '✅ Fan' : '❌'}</td>
            <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
        </tr>
    `).join('');

    return `
    <h3>${wireless.title}</h3>
    <p><em>${wireless.description || ''}</em></p>
    <table>
        <thead>
            <tr><th>Brand</th><th>Model</th><th>Speed</th><th>Cooling</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderPowerBanks(banks) {
    if (!banks || !banks.items) return '';

    const rows = banks.items.map(item => `
        <tr>
            <td>${item.brand}</td>
            <td>${item.model}</td>
            <td>${item.capacity}</td>
            <td>${item.magnetic ? '✅' : '❌'}</td>
            <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
        </tr>
    `).join('');

    return `
    <h3>${banks.title}</h3>
    <table>
        <thead>
            <tr><th>Brand</th><th>Model</th><th>Capacity</th><th>Magnetic</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderCasesTable(category, type) {
    if (!category || !category.items) return '';

    let headers, rowRenderer;

    if (type === 'rugged') {
        headers = '<tr><th>Brand</th><th>Case</th><th>Qi2/Mag</th><th>Port Cover</th><th>Kickstand</th><th>Drop Rating</th><th>Links</th></tr>';
        rowRenderer = item => `
            <tr class="${item.highlight ? 'highlight' : ''}">
                <td>${item.brand}</td>
                <td>${item.model}</td>
                <td>${item.magnetic ? '✅' : '❌'}</td>
                <td>${item.port_cover ? '✅' : '❌'}</td>
                <td>${item.kickstand ? '✅' : '❌'}</td>
                <td>${item.drop_rating || '-'}</td>
                <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
            </tr>
        `;
    } else if (type === 'aramid') {
        headers = '<tr><th>Brand</th><th>Case</th><th>Magnets</th><th>Material</th><th>Thickness</th><th>Links</th></tr>';
        rowRenderer = item => `
            <tr class="${item.highlight ? 'highlight' : ''}">
                <td>${item.brand}</td>
                <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
                <td>${item.magnetic ? '✅ Embedded' : '⚠️ Weak'}</td>
                <td>${item.material}</td>
                <td>${item.thickness}</td>
                <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
            </tr>
        `;
    }

    const rows = category.items.map(rowRenderer).join('');

    return `
    <h3>${category.title}</h3>
    <p><em>${category.description || ''}</em></p>
    <table>
        <thead>${headers}</thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderEverydayCases(everyday) {
    if (!everyday || !everyday.items) return '';

    const rows = everyday.items.map(item => `
        <tr class="${item.highlight ? 'highlight' : ''}">
            <td>${item.brand}</td>
            <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
            <td>${item.magnetic ? '✅' : '❌'}</td>
            <td>${item.feature || '-'}</td>
            <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
        </tr>
    `).join('');

    return `
    <h3>${everyday.title || 'Everyday Cases'}</h3>
    <table>
        <thead>
            <tr><th>Brand</th><th>Case</th><th>Magnetic</th><th>Feature</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderScreenProtectors(sp) {
    let html = '';

    // Glass
    if (sp.glass && sp.glass.items) {
        const rows = sp.glass.items.map(item => `
            <tr class="${item.highlight ? 'highlight' : ''}">
                <td>${item.brand}</td>
                <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
                <td>${item.install_type}</td>
                <td>${item.fingerprint ? '✅ Works' : '❌'}</td>
                <td>${item.difficulty}</td>
                <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
            </tr>
        `).join('');

        html += `
        <h3>${sp.glass.title}</h3>
        <p><em>${sp.glass.description || ''}</em></p>
        <table>
            <thead>
                <tr><th>Brand</th><th>Product</th><th>Install Type</th><th>Fingerprint</th><th>Difficulty</th><th>Links</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
        `;
    }

    // Avoid list
    if (sp.avoid && sp.avoid.items) {
        const avoidRows = sp.avoid.items.map(item => `
            <tr class="avoid">
                <td>${item.brand}</td>
                <td>${item.issue}</td>
            </tr>
        `).join('');

        html += `
        <h3>⚠️ Avoid</h3>
        <table>
            <thead><tr><th>Brand/Type</th><th>Issue</th></tr></thead>
            <tbody>${avoidRows}</tbody>
        </table>
        `;
    }

    return html;
}

function renderCooling(cooling) {
    if (!cooling.items) return '';

    const rows = cooling.items.map(item => `
        <tr>
            <td>${item.brand}</td>
            <td>${item.model}</td>
            <td>${item.type}</td>
            <td>${item.temp_drop}</td>
            <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
        </tr>
    `).join('');

    return `
    <p><em>${cooling.description || ''}</em></p>
    <table>
        <thead>
            <tr><th>Brand</th><th>Model</th><th>Type</th><th>Temp Drop</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    `;
}

function renderGaming(gaming) {
    if (!gaming.items) return '';

    const rows = gaming.items.map(item => `
        <tr class="${item.highlight ? 'highlight' : ''}">
            <td>${item.brand}</td>
            <td>${item.highlight ? `<strong>${item.model}</strong>` : item.model}</td>
            <td>${item.connection}</td>
            <td>${item.sensor}</td>
            <td><a href="${item.url}" target="_blank">$${item.price_usd}</a></td>
        </tr>
    `).join('');

    return `
    <table>
        <thead>
            <tr><th>Brand</th><th>Model</th><th>Connection</th><th>Sensor</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    <p><em>Hall Effect sensors = No stick drift. Worth the premium!</em></p>
    `;
}

function renderMounts(mounts) {
    if (!mounts.items) return '';

    const rows = mounts.items.map(item => `
        <tr>
            <td>${item.brand}</td>
            <td>${item.model}</td>
            <td>${item.type}</td>
            <td>${item.charging}</td>
            <td><a href="${item.url}" target="_blank">${item.price_usd ? '$' + item.price_usd : 'Varies'}</a></td>
        </tr>
    `).join('');

    return `
    <table>
        <thead>
            <tr><th>Brand</th><th>Model</th><th>Type</th><th>Charging</th><th>Links</th></tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    <p><strong>⚠️ Motorcycle/Bike Warning:</strong> Magnetic-only mounts are NOT safe for high vibration!</p>
    `;
}

function setupCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const section = btn.dataset.section;

            // Fetch generated BBCode
            try {
                const response = await fetch(`/assets/bbcode/${window.deviceSlug || 'pixel-10-pro-xl'}.txt`);
                const bbcode = await response.text();

                await navigator.clipboard.writeText(bbcode);
                btn.textContent = '✅ Copied!';
                setTimeout(() => btn.textContent = '📋 Copy BBCode', 2000);
            } catch (err) {
                btn.textContent = '❌ Error';
                console.error(err);
            }
        });
    });
}
