let currentLang = localStorage.getItem('lang') || 'ka';
let siteTexts = {};

function t(key) {
    return siteTexts[key] || key;
}

function exists(id) {
    return document.getElementById(id) !== null;
}

async function loadAndRenderAll() {
    // ✅ დააკეტე dropdown rendering-დან წინ
    const langMenu = document.getElementById('langMenu');
    if (langMenu) {
        langMenu.classList.remove('show');
    }

    siteTexts = await API.get('SiteText', currentLang) || {};

    renderHeader();
    renderFooter();

    if (exists('page-hero-section')) renderPageHero();
    if (exists('hero-section')) renderHeroSection();
    if (exists('weather-section')) await renderWeatherSection(); 
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
                    <img src="/favicon.ico" alt="Logo" style="width:48px;height:48px;margin-right:10px;" />
                    <span class="logo-text">
                        <span class="panda">PANDA</span>
                        <span class="ski-rental">SKI RENTAL</span>
                    </span>
                </a>
                
                <nav class="main-nav" id="mainNav">
                    ${navLink('/', t('NavHome'), ['/', '/home', '/home/index'])}
                    ${navLink('/Home/About', t('NavAbout'), ['/home/about'])}
                    ${navLink('/Home/Gallery', t('NavGallery'), ['/home/gallery'])}
                    ${navLink('/Home/Location', t('NavLocation'), ['/home/location'])}
                    ${navLink('/Home/Contact', t('NavContact'), ['/home/contact'])}
                </nav>
                
                <button class="hamburger" id="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                
                <div class="lang-switch">
                    <button class="lang-btn" id="langBtn">
                        <span>🌐</span> Ka • En • Ru
                    </button>
                    <div class="lang-menu" id="langMenu">
                        <button class="lang-item" data-lang="ka">Ka - ქართული</button>
                        <button class="lang-item" data-lang="en">En - English</button>
                        <button class="lang-item" data-lang="ru">Ru - Русский</button>
                    </div>
                </div>
            </div>
        </header>
    `;

    // Language Menu
    const langBtn = container.querySelector('#langBtn');
    const langMenu = container.querySelector('#langMenu');

    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('show');
    });

    container.querySelectorAll('.lang-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            currentLang = item.dataset.lang;
            localStorage.setItem('lang', currentLang);
            langMenu.classList.remove('show');
            loadAndRenderAll();
        });
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.lang-switch')) {
            langMenu.classList.remove('show');
        }
    });

    // Hamburger Menu (ტელეფონზე)
    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('mobile-open');
            hamburger.classList.toggle('open');
        });

        // ბმულზე დაწკაპუნებისას დახურვა
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('mobile-open');
                hamburger.classList.remove('open');
            });
        });
    }

    // გარეთ დაწკაპუნებისას დახურვა
    document.addEventListener('click', (e) => {
        if (!e.target.closest('header') && mainNav.classList.contains('mobile-open')) {
            mainNav.classList.remove('mobile-open');
            hamburger.classList.remove('open');
        }
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
// HERO გვერდი
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

async function renderGalleryPreview() {
    const container = document.getElementById('gallery-preview-section');
    const photos = await API.get('GalleryPhoto', currentLang);
    if (!photos) return;

    const photosHtml = photos.slice(0, 4).map(p => `
        <div class="photo-card" ${p.title === 'ჩვენი ოფისი' || p.title === 'Our Office' || p.title === 'Наш офис' ? 'style="cursor: pointer;" onclick="window.location.href=\'/Home/Location\'"' : ''}>
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
// GALLERY
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
// RENTAL
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
// ABOUT
// ============================================
function renderAboutSection() {
    document.getElementById('about-section').innerHTML = `
        <div class="container section">
            <div class="about-intro">
                <p class="about-text">${t('AboutText')}</p>
            </div>
            
            <!-- OUR SERVICES -->
            <div class="about-block">
                <h3 class="about-heading">${t('ServicesTitle')}</h3>
                <ul class="about-list">
                    <li>${t('Service1')}</li>
                    <li>${t('Service2')}</li>
                    <li>${t('Service3')}</li>
                </ul>
            </div>
            
            <!-- SKI CLOTHING -->
            <div class="about-block">
                <h3 class="about-heading">${t('ClothingTitle')}</h3>
                <ul class="about-list">
                    <li>${t('Clothing1')}</li>
                    <li>${t('Clothing2')}</li>
                    <li>${t('Clothing3')}</li>
                </ul>
            </div>
            
            <!-- ACCESSORIES -->
            <div class="about-block">
                <h3 class="about-heading">${t('AccessoriesTitle')}</h3>
                <ul class="about-list">
                    <li>${t('Accessory1')}</li>
                    <li>${t('Accessory2')}</li>
                    <li>${t('Accessory3')}</li>
                    <li>${t('Accessory4')}</li>
                </ul>
            </div>
            
            <!-- CHILDREN'S SPACE -->
            <div class="about-block">
                <h3 class="about-heading">${t('ChildrenTitle')}</h3>
                <p class="about-block-text">${t('ChildrenText')}</p>
                <ul class="about-list">
                    <li>${t('Children1')}</li>
                </ul>
            </div>
        </div>
    `;
}

// ============================================
// LOCATION
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
// CONTACT
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

// ============================================
// WEATHER (ამინდი)
// ============================================
async function renderWeatherSection() {
    const container = document.getElementById('weather-section');
    const weather = await API.get('Weather', currentLang);
    if (!weather || !weather.forecast) return;

    const forecastHtml = weather.forecast.map(day => `
        <div class="weather-card">
            <div class="weather-day">${day.day}</div>
            <div class="weather-temp">
                <span class="temp-high">${day.tempMax}°</span>
                <span class="temp-low">${day.tempMin}°</span>
            </div>
            <div class="weather-icon">${day.icon}</div>
            <div class="weather-desc">${day.description}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="container section">
            <h2 class="section-title">${weather.title || 'ამინდი გუდაურში'}</h2>
            <div class="weather-grid">
                ${forecastHtml}
            </div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', loadAndRenderAll);