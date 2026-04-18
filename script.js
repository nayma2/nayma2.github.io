// Initialize page with dynamic content from DataManager
document.addEventListener('DOMContentLoaded', function() {
    renderPortfolioContent();
    setupMobileMenu();
    setupScrollReveal();
    setupStorageListener();
});

// ===== STORAGE LISTENER FOR ADMIN UPDATES =====
function setupStorageListener() {
    // Listen for storage changes from other tabs/windows
    window.addEventListener('storage', function(e) {
        if (e.key === 'portfolioData' || e.key === null) {
            console.log('Portfolio data updated from another tab, refreshing...');
            renderPortfolioContent();
        }
    });
    
    // Listen for custom event from same-window admin updates
    window.addEventListener('portfolioDataUpdated', function(e) {
        console.log('Portfolio data updated:', e.detail);
        if (e.detail && e.detail.sections) {
            // Selectively re-render only updated sections
            const sections = e.detail.sections;
            if (sections.includes('profile') || sections.includes('about')) {
                renderAboutSection(DataManager.getProfile());
            }
            if (sections.includes('experiences')) {
                renderExperienceSection(DataManager.getExperiences());
            }
            if (sections.includes('skills')) {
                renderSkillsSection(DataManager.getSkills());
            }
            if (sections.includes('projects')) {
                renderProjectsSection(DataManager.getProjects());
            }
        } else {
            // Full re-render if no specific sections provided
            renderPortfolioContent();
        }
    });
}

// ===== DYNAMIC CONTENT RENDERING =====
function renderPortfolioContent() {
    const data = DataManager.getAllData();
    
    // Render Hero/About Section
    renderAboutSection(data.profile);
    
    // Render Experience Section
    renderExperienceSection(data.experiences);
    
    // Render Skills Section
    renderSkillsSection(data.skills);
    
    // Render Projects Section
    renderProjectsSection(data.projects);
}

function renderAboutSection(profile) {
    const heading = document.querySelector('.hero h1');
    const description = document.querySelector('.hero-text > p');
    
    if (heading) {
        heading.innerHTML = `Ensuring <span class="highlight">Quality</span> Through Testing`;
    }
    if (description) {
        description.innerHTML = `Hi, I'm <strong>${profile.name}</strong>. ${profile.description}`;
    }
}

function renderExperienceSection(experiences) {
    const container = document.querySelector('.cards-grid');
    if (!container) return;
    
    container.innerHTML = experiences.map(exp => {
        const featuresList = exp.features.map(feature => 
            `<li><i class="fa-solid fa-check-circle"></i> ${feature}</li>`
        ).join('');
        
        return `
            <div class="card experience-card" style="opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out;">
                <div class="card-border"></div>
                <div class="icon-box"><i class="fa-solid fa-${exp.icon}"></i></div>
                <h3>${exp.title}</h3>
                <p>${exp.description}</p>
                <ul class="feature-list">
                    ${featuresList}
                </ul>
            </div>
        `;
    }).join('');
    
    // Re-apply scroll observer to new elements
    observeElements(container.querySelectorAll('.experience-card'));
}

function renderSkillsSection(skills) {
    // Render Testing Skills
    const testingContainer = document.querySelector('.skill-list');
    if (testingContainer) {
        testingContainer.innerHTML = skills.testing.map(skill => {
            const widthClass = `skill-${skill.level}`;
            return `
                <div class="skill-item" data-skill="${skill.level}" style="opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out;">
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-level">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress ${widthClass}"></div>
                    </div>
                </div>
            `;
        }).join('');
        observeElements(testingContainer.querySelectorAll('.skill-item'));
    }
    
    // Render Tools
    const toolsContainer = document.querySelector('.skill-tags-grid');
    if (toolsContainer) {
        toolsContainer.innerHTML = skills.tools.map(tool => `
            <div class="skill-tag" style="opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out;">${tool}</div>
        `).join('');
        observeElements(toolsContainer.querySelectorAll('.skill-tag'));
    }
}

function renderProjectsSection(projects) {
    const container = document.querySelector('.projects-grid');
    if (!container) return;
    
    container.innerHTML = projects.map((proj) => {
        const isFeatured = proj.featured;
        const featureClass = isFeatured ? 'premium' : '';
        const badge = isFeatured ? '<div class="project-badge">Featured</div>' : '';
        
        return `
            <div class="project-card ${featureClass}" style="opacity: 0; transform: translateY(30px); transition: all 0.8s ease-out;">
                ${badge}
                <div class="img-wrapper">
                    <img src="${proj.image}" alt="${proj.title}">
                    <div class="overlay-content">
                        <p>${proj.category}</p>
                    </div>
                </div>
                <div class="project-info">
                    <span class="category">${proj.category}</span>
                    <h3>${proj.title}</h3>
                    <p class="project-description">${proj.description}</p>
                    <div class="project-tech">
                        ${proj.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    observeElements(container.querySelectorAll('.project-card'));
}

// Helper function to observe elements
function observeElements(elements) {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    elements.forEach(el => observer.observe(el));
}

// ===== MOBILE MENU TOGGLE =====
function setupMobileMenu() {
    const menuIcon = document.getElementById('menu-icon');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuIcon || !navLinks) return;
    
    menuIcon.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// ===== SCROLL REVEAL ANIMATION =====
function setupScrollReveal() {
    const observerOptions = { threshold: 0.1 };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe initial static cards (fallback)
    document.querySelectorAll('.card, .project-card, .skill-tag').forEach(el => {
        if (!el.style.opacity) {
            el.style.opacity = "0";
            el.style.transform = "translateY(30px)";
            el.style.transition = "all 0.8s ease-out";
        }
        observer.observe(el);
    });
}

// ===== CONTACT FORM HANDLER =====
function handleContactSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const serviceType = document.getElementById('contactService').value;
    const message = document.getElementById('contactMessage').value.trim();
    
    if (!name || !email || !serviceType || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Save message using DataManager
    DataManager.addMessage({
        name: name,
        email: email,
        serviceType: serviceType,
        message: message
    });
    
    // Show success message
    const submitMsg = document.getElementById('submitMessage');
    submitMsg.style.display = 'block';
    
    // Reset form
    const form = document.getElementById('contactForm');
    form.reset();
    
    // Hide success message after 3 seconds and reset
    setTimeout(() => {
        submitMsg.style.display = 'none';
    }, 3000);
    
    // Notify admin
    notifyPortfolioUpdate(['messages']);
}