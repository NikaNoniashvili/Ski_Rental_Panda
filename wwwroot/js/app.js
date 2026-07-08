// ============================================
// გლობალური მდგომარეობა
// ============================================
let currentLang = localStorage.getItem('lang') || 'ka';
let siteTexts = {};

// მოკლე დამხმარე — ტექსტის წამოსაღებად KeyName-ით
function t(key) {
    return siteTexts[key] || key;
}

// ============================================
// მთავარი ჩატვირთვის ფუნქცია
// ============================================
async function loadAndRenderAll() {
    siteTexts = await API.get('SiteText', currentLang) || {};

    renderHeader();
    renderFooter();
    await renderHeroSection();
    await renderGallerySection();
    await renderRentalSection();
    renderAboutSection();
    await renderContactSection();
}

// ============================================
// HEADER (ნავიგაცია + ენის გადამრთველი)
// ============================================
function renderHeader() {
    const container = document.getElementById('site-header');

    container.innerHTML = `
        <header class="site-header">
            <div class="container header-inner">
                <a class="logo" href="/">
                    <span class="logo-text">GUDAURI<br><small>SKI RENTAL</small></span>
                </a>
                <nav class="main-nav">
                    <a href="#hero-section">${t('NavHome')}</a>
                    <a href="#about-section">${t('NavAbout')}</a>
                    <a href="#gallery-section">${t('NavGallery')}</a>
                    <a href="#contact-section">${t('NavContact')}</a>
                </nav>
                <div class="lang-switch">
                    <button data-lang="ka" class="${currentLang === 'ka' ? 'active' : ''}">KA</button>
                    <button data-lang="en" class="${currentLang === 'en' ? 'active' : ''}">EN</button>
                </div>
            </div>
        </header>
    `;

    // ენის ღილაკებზე event listener-ები
    container.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            localStorage.setItem('lang', currentLang);
            loadAndRenderAll(); // ყველაფერი ხელახლა იტვირთება ახალ ენაზე
        });
    });
}

// ============================================
// FOOTER
// ============================================
async function renderFooter() {
    const container = document.getElementById('site-footer');
    const info = await API.get('ContactInfo', currentLang);

    if (!info) return;

    container.innerHTML = `
        <footer class="site-footer">
            <div class="container footer-inner">
                <span class="logo-text light">GUDAURI SKI RENTAL</span>
                <div class="footer-info">
                    <span>📍 ${info.address}</span>
                    <span>📞 ${info.phone}</span>
                </div>
                <div class="footer-social">
                    <a href="${info.facebookUrl}" target="_blank">Facebook</a>
                    <a href="${info.instagramUrl}" target="_blank">Instagram</a>
                </div>
            </div>
            <div class="footer-bottom">
                &copy; ${new Date().getFullYear()} GUDAURI SKI RENTAL. ${t('FooterRights')}.
            </div>
        </footer>
    `;
}

// ============================================
// HERO სექცია (მთავარი გვერდის თავი)
// ============================================
async function renderHeroSection() {
    const container = document.getElementById('hero-section');

    container.innerHTML = `
        <div class="hero">
            <div class="container hero-content">
                <h1>${t('HeroTitle')}</h1>
                <p class="hero-sub">${t('HeroSubtitle')}</p>
                <div class="hero-features">
                    <div class="hero-feature">🎿 ${t('FeatureQuality')}</div>
                    <div class="hero-feature">✅ ${t('FeatureSafety')}</div>
                    <div class="hero-feature">❄️ ${t('FeatureWinter')}</div>
                </div>
            </div>
        </div>
    `;
}

// ============================================
// გალერეის სექცია
// ============================================
async function renderGallerySection() {
    const container = document.getElementById('gallery-section');
    const photos = await API.get('GalleryPhoto', currentLang);

    if (!photos) return;

    const photosHtml = photos.map(p => `
        <div class="photo-card">
            <img src="${p.imageUrl}" alt="${p.title}" />
            <span class="photo-caption">${p.title}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${t('SectionGalleryTitle')}</h2>
            <div class="photo-grid">
                ${photosHtml}
            </div>
        </div>
    `;
}

// ============================================
// გასაქირავებელი ინვენტარის სექცია
// ============================================
async function renderRentalSection() {
    const container = document.getElementById('rental-section');
    const items = await API.get('RentalItem', currentLang);

    if (!items) return;

    const itemsHtml = items.map(item => `
        <div class="rental-card">
            <img src="${item.imageUrl}" alt="${item.name}" />
            <div class="rental-card-body">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="rental-price">${item.pricePerDay} ₾ / ${t('LabelPricePerDay')}</div>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${t('SectionRentalTitle')}</h2>
            <div class="rental-grid">
                ${itemsHtml}
            </div>
        </div>
    `;
}

// ============================================
// "ჩვენ შესახებ" სექცია
// ============================================
function renderAboutSection() {
    const container = document.getElementById('about-section');

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${t('SectionAboutTitle')}</h2>
            <p class="about-text">${t('AboutText')}</p>
        </div>
    `;
}

// ============================================
// კონტაქტის სექცია
// ============================================
async function renderContactSection() {
    const container = document.getElementById('contact-section');
    const info = await API.get('ContactInfo', currentLang);

    if (!info) return;

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${t('ContactTitle')}</h2>
            <p>${t('ContactText')}</p>
            <ul class="contact-list">
                <li><strong>${t('LabelAddress')}:</strong> ${info.address}</li>
                <li><strong>${t('LabelPhone')}:</strong> ${info.phone}</li>
                <li><strong>${t('LabelHours')}:</strong> ${info.workingHours}</li>
                <li><strong>Email:</strong> ${info.email}</li>
            </ul>
            <iframe src="${info.mapEmbedUrl}" width="100%" height="300" style="border:0;"></iframe>
        </div>
    `;
}

// ============================================
// გაშვება — გვერდის ჩატვირთვისთანავე
// ============================================
document.addEventListener('DOMContentLoaded', loadAndRenderAll);