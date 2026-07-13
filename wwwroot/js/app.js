let currentLang = localStorage.getItem('lang') || 'ka';
let siteTexts = {};

function t(key) {
    return siteTexts[key] || key;
}

// "დაცვა" — თუ ეს კონტეინერი ამ გვერდზე არ არსებობს, უბრალოდ გამოტოვე
function exists(id) {
    return document.getElementById(id) !== null;
}

async function loadAndRenderAll() {
    siteTexts = await API.get('SiteText', currentLang) || {};

    renderHeader();
    renderFooter();

    if (exists('page-hero-section')) renderPageHero();
    if (exists('hero-section')) renderHeroSection();
    if (exists('gallery-preview-section')) await renderGalleryPreview();
    if (exists('gallery-section')) await renderGallerySection();
    if (exists('rental-section')) await renderRentalSection();
    if (exists('about-section')) renderAboutSection();
    if (exists('location-section')) await renderLocationSection();
    if (exists('contact-section')) await renderContactSection();
}

// ============================================
// HEADER
// ============================================
function renderHeader() {
    const container = document.getElementById('site-header');
    const path = window.location.pathname.toLowerCase();

    const navLink = (href, label, matchPaths) => {
        const isActive = matchPaths.some(p => path === p);
        return `<a href="${href}" class="${isActive ? 'active' : ''}">${label}</a>`;
    };

    container.innerHTML = `
        <header class="site-header">
            <div class="container header-inner">
                <a class="logo" href="/">
    <span class="logo-text">
        <span class="panda">PANDA</span>
        <span class="ski-rental">SKI RENTAL</span>
    </span>
</a>
                <nav class="main-nav">
                    ${navLink('/', t('NavHome'), ['/', '/home', '/home/index'])}
                    ${navLink('/Home/About', t('NavAbout'), ['/home/about'])}
                    ${navLink('/Home/Gallery', t('NavGallery'), ['/home/gallery'])}
                    ${navLink('/Home/Location', t('NavLocation'), ['/home/location'])}
                    ${navLink('/Home/Contact', t('NavContact'), ['/home/contact'])}
                </nav>
                <div class="lang-switch">
                    <button data-lang="ka" class="${currentLang === 'ka' ? 'active' : ''}">KA</button>
                    <button data-lang="en" class="${currentLang === 'en' ? 'active' : ''}">EN</button>
                </div>
            </div>
        </header>
    `;

    container.querySelectorAll('.lang-switch button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            localStorage.setItem('lang', currentLang);
            loadAndRenderAll();
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
                <span class="logo-text light">PANDA SKI RENTAL</span>
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
                &copy; ${new Date().getFullYear()} PANDA SKI RENTAL. ${t('FooterRights')}.
            </div>
        </footer>
    `;
}

// ============================================
// შიდა გვერდების პატარა "hero" ზოლი (About/Gallery/Location/Contact)
// ============================================
function renderPageHero() {
    const container = document.getElementById('page-hero-section');
    const titleKey = container.dataset.titleKey;

    container.innerHTML = `
        <div class="page-hero">
            <div class="container"><h1>${t(titleKey)}</h1></div>
        </div>
    `;
}

// ============================================
// HERO (მთავარი გვერდი)
// ============================================
function renderHeroSection() {
    document.getElementById('hero-section').innerHTML = `
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

// მთავარ გვერდზე მხოლოდ პირველი 4 ფოტო (გამეორება Gallery-გვერდისგან)
async function renderGalleryPreview() {
    const container = document.getElementById('gallery-preview-section');
    const photos = await API.get('GalleryPhoto', currentLang);
    if (!photos) return;

    const photosHtml = photos.slice(0, 4).map(p => `
        <div class="photo-card">
            <img src="${p.imageUrl}" alt="${p.title}" />
            <span class="photo-caption">${p.title}</span>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${t('SectionGalleryTitle')}</h2>
            <div class="photo-grid">${photosHtml}</div>
        </div>
    `;
}

// ============================================
// GALLERY გვერდი (სრული)
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
            <div class="photo-grid">${photosHtml}</div>
        </div>
    `;
}

// ============================================
// RENTAL სექცია
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
            <div class="rental-grid">${itemsHtml}</div>
        </div>
    `;
}

// ============================================
// ABOUT სექცია
// ============================================
function renderAboutSection() {
    document.getElementById('about-section').innerHTML = `
        <div class="container section">
            <p class="about-text">${t('AboutText')}</p>
        </div>
    `;
}

// ============================================
// LOCATION გვერდი (რუკა)
// ============================================
async function renderLocationSection() {
    const container = document.getElementById('location-section');
    const info = await API.get('ContactInfo', currentLang);
    if (!info) return;

    container.innerHTML = `
        <div class="container section">
            <p><strong>${t('LabelAddress')}:</strong> ${info.address}</p>
            <iframe src="${info.mapEmbedUrl}" width="100%" height="350" style="border:0;"></iframe>
        </div>
    `;
}

// ============================================
// CONTACT გვერდი
// ============================================
async function renderContactSection() {
    const container = document.getElementById('contact-section');
    const info = await API.get('ContactInfo', currentLang);
    if (!info) return;

    container.innerHTML = `
        <div class="container section">
            <p>${t('ContactText')}</p>
            <ul class="contact-list">
                <li><strong>${t('LabelAddress')}:</strong> ${info.address}</li>
                <li><strong>${t('LabelPhone')}:</strong> ${info.phone}</li>
                <li><strong>${t('LabelHours')}:</strong> ${info.workingHours}</li>
                <li><strong>Email:</strong> ${info.email}</li>
            </ul>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadAndRenderAll);