// Phone Detail Page - Dynamic Case Loading

async function loadPhoneData() {
    // Get phone info from URL
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const brand = pathParts[pathParts.length - 2]; // e.g., 'google'
    const phoneFile = pathParts[pathParts.length - 1].replace('.html', ''); // e.g., 'google-pixel-9-pro-xl'

    try {
        // Load configuration
        let config;
        try {
            const configResponse = await fetch('../../data/config.json');
            config = await configResponse.json();
        } catch (error) {
            console.error('Failed to load config:', error);
            document.getElementById('casesContainer').innerHTML = '<p>Error loading configuration.</p>';
            return;
        }

        // Use category info from config
        const categoryInfo = config.categories;

        // Scan for series structure
        const indexResponse = await fetch('../../data/index.json');
        const index = await indexResponse.json();

        // Find the phone in the index
        let phonePath = null;
        let phoneDisplayName = null;
        if (index.brands[brand] && index.brands[brand].phones[phoneFile]) {
            phonePath = index.brands[brand].phones[phoneFile].path;
            phoneDisplayName = index.brands[brand].phones[phoneFile].display_name || phoneFile.replace(/-/g, ' ');
        }

        if (!phonePath) {
            document.getElementById('casesContainer').innerHTML = '<p>Phone data not found. Please check the data structure.</p>';
            return;
        }

        // Update page title and heading with phone name
        if (phoneDisplayName) {
            // Capitalize each word properly
            const formattedName = phoneDisplayName
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');

            // Update page title
            document.title = `${formattedName} - ARC`;

            // Update page heading if it exists
            const pageHeading = document.querySelector('.guide-header h1');
            if (pageHeading) {
                pageHeading.textContent = `${formattedName} Accessories Guide`;
            }
        }

        // Load all case categories
        let casesData = {};
        let totalProducts = 0;

        for (const category of ['hardened', 'rugged', 'basic', 'clear']) {
            try {
                const response = await fetch(`../../${phonePath}/cases/${category}.json`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.products && data.products.length > 0) {
                        casesData[category] = data.products;
                        totalProducts += data.products.length;
                    }
                }
            } catch (error) {
                console.error(`Error loading ${category}:`, error);
            }
        }

        if (totalProducts === 0) {
            document.getElementById('casesContainer').innerHTML = '<p>No cases found for this phone.</p>';
            return;
        }

        // Create filter bar
        const filterBar = document.getElementById('filterBar');
        filterBar.innerHTML = '';

        const allButton = document.createElement('button');
        allButton.className = 'filter-btn active';
        allButton.textContent = `All(${totalProducts})`;
        allButton.setAttribute('data-filter', 'all');
        filterBar.appendChild(allButton);

        // Add filter buttons for each category
        for (const [category, products] of Object.entries(casesData)) {
            const info = categoryInfo[category];
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.textContent = `${info.emoji} ${info.title} (${products.length})`;
            btn.setAttribute('data-filter', category);
            filterBar.appendChild(btn);
        }

        // Render case sections
        const container = document.getElementById('casesContainer');
        container.innerHTML = '';

        for (const [category, products] of Object.entries(casesData)) {
            const info = categoryInfo[category];

            const section = document.createElement('section');
            section.className = 'category-section';
            section.id = `category-${category}`;
            section.setAttribute('data-category', category);

            section.innerHTML = `
                <h2>${info.emoji} ${info.title}</h2>
                <p class="category-description">${info.description}</p>
                <div class="products-grid"></div>
            `;

            const grid = section.querySelector('.products-grid');

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.setAttribute('data-category', category);

                // Format features as bullet points
                let featuresHTML = '';
                if (product.features) {
                    const featuresList = product.features
                        .split(',')
                        .map(f => f.trim())
                        .filter(f => f)
                        .map(f => `<li>${f}</li>`)
                        .join('');
                    featuresHTML = `<ul class="features-list">${featuresList}</ul>`;
                }

                // Format materials with label
                const materialsHTML = product.materials ?
                    `<div class="material-text"><strong>Materials:</strong> ${product.materials}</div>` : '';

                card.innerHTML = `
                    <div class="product-header">
                        <h3>
                            <div class="brand-name">${product.product_brand}</div>
                            <div class="product-name">${product.product_model || product.title}</div>
                        </h3>
                        <span class="price">${product.price}</span>
                    </div>
                    <div class="specs">
                        ${materialsHTML}
                        ${featuresHTML}
                    </div>
                    <div class="purchase-links">
                        ${product.url ? `<a href="${product.url}" target="_blank" class="btn-primary">View Product</a>` : ''}
                    </div>
                `;

                grid.appendChild(card);
            });

            container.appendChild(section);
        }

        // Add filter functionality
        const filterButtons = filterBar.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                const sections = document.querySelectorAll('.category-section');

                if (filter === 'all') {
                    sections.forEach(section => section.style.display = 'block');
                } else {
                    sections.forEach(section => {
                        if (section.getAttribute('data-category') === filter) {
                            section.style.display = 'block';
                        } else {
                            section.style.display = 'none';
                        }
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error loading phone data:', error);
        document.getElementById('casesContainer').innerHTML = '<p>Error loading case data. Please try refreshing the page.</p>';
    }
}

// Load data when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPhoneData);
} else {
    loadPhoneData();
}
