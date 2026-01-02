// Search functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.phone-guide-card');

        cards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const brand = card.querySelector('.brand-badge')?.textContent.toLowerCase() || '';
            const features = card.querySelector('.phone-features')?.textContent.toLowerCase() || '';

            if (title.includes(query) || brand.includes(query) || features.includes(query)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Dynamic phone list and filter loader
(async function () {
    try {
        const response = await fetch('data/index.json');
        const index = await response.json();

        const grid = document.querySelector('.products-grid');
        const filterBar = document.querySelector('.filter-bar');
        const existingPhones = new Set();

        // Track existing phones to avoid duplicates
        document.querySelectorAll('[data-brand]').forEach(card => {
            const href = card.getAttribute('href');
            if (href) existingPhones.add(href);
        });

        // Track which brands have phones
        const activeBrands = new Set();

        // Add phones from index
        for (const [brand, brandData] of Object.entries(index.brands)) {
            if (Object.keys(brandData.phones).length === 0) continue; // Skip empty brands

            activeBrands.add(brand);

            for (const [phone, phoneData] of Object.entries(brandData.phones)) {
                const phonePath = `phones/${brand}/${phone}.html`;

                // Skip if already exists
                if (existingPhones.has(phonePath)) continue;

                // Create card
                const card = document.createElement('a');
                card.href = phonePath;
                card.className = 'phone-guide-card';
                card.setAttribute('data-brand', brand);

                // Format phone name (iphone-16-pro-max → iPhone 16 Pro Max)
                const displayName = phone
                    .split('-')
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');

                card.innerHTML = `
                    <div class="phone-card-header">
                        <span class="brand-badge">${brand.charAt(0).toUpperCase() + brand.slice(1)}</span>
                        <h3>${displayName}</h3>
                    </div>
                    <div class="phone-features">
                        <span>New</span><span>${Object.keys(phoneData.case_types).length} case types</span>
                    </div>
                    <div class="phone-stats">
                        <span>📱 ${phoneData.total_products} products</span>
                    </div>
                `;

                grid.appendChild(card);
            }
        }

        // Rebuild filter bar dynamically
        const totalPhones = document.querySelectorAll('.phone-guide-card').length;

        // Clear filter bar
        filterBar.innerHTML = '';

        // Add "All" button
        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.setAttribute('data-brand', 'all');
        allButton.textContent = `All (${totalPhones})`;
        filterBar.appendChild(allButton);

        // Add brand buttons (sorted alphabetically)
        const sortedBrands = Array.from(activeBrands).sort();
        sortedBrands.forEach(brand => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-brand', brand);
            btn.textContent = brand.charAt(0).toUpperCase() + brand.slice(1);
            filterBar.appendChild(btn);
        });

        // Add filter functionality to new buttons
        const filterButtons = filterBar.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll('.phone-guide-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', function () {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));

                // Add active class to clicked button
                this.classList.add('active');

                const brand = this.getAttribute('data-brand');

                // Filter cards
                cards.forEach(card => {
                    if (brand === 'all' || card.getAttribute('data-brand') === brand) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

    } catch (error) {
        console.error('Failed to load data index:', error);
    }
})();
