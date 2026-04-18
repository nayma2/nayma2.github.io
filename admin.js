// Admin Panel JavaScript - Handles all admin functionality
let currentEditingId = null;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
    loadExperiences();
    loadSkills();
    loadProjects();
    loadProfile();
    loadMessages();
    setupMessageListener();
});

// ===== HELPER FUNCTION TO NOTIFY PORTFOLIO =====
function notifyPortfolioUpdate(sections) {
    // Dispatch custom event for same-window updates (from admin to portfolio in same tab)
    const event = new CustomEvent('portfolioDataUpdated', {
        detail: { sections: sections }
    });
    window.dispatchEvent(event);
    
    // If portfolio is open in another tab, the storage event will handle it automatically
    // since DataManager uses localStorage
}

// ===== TAB SWITCHING =====
function switchTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all menu links
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => link.classList.remove('active'));
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked menu link
    event.target.closest('.menu-link').classList.add('active');
    
    // Reload data for the selected tab
    if (tabName === 'experience') loadExperiences();
    if (tabName === 'skills') loadSkills();
    if (tabName === 'projects') loadProjects();
    if (tabName === 'messages') loadMessages();
}

// ===== DASHBOARD =====
function loadDashboard() {
    const data = DataManager.getAllData();
    document.getElementById('statExperience').textContent = data.experiences.length;
    document.getElementById('statSkills').textContent = data.skills.testing.length + data.skills.tools.length;
    document.getElementById('statProjects').textContent = data.projects.length;
    const unreadMessages = data.messages ? data.messages.filter(m => !m.read).length : 0;
    document.getElementById('statMessages').textContent = unreadMessages;
}

// ===== EXPERIENCE MANAGEMENT =====
function loadExperiences() {
    const experiences = DataManager.getExperiences();
    const container = document.getElementById('experienceList');
    
    if (experiences.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 40px;">No experiences added yet.</p>';
        return;
    }
    
    container.innerHTML = experiences.map(exp => `
        <div class="item-card">
            <div class="item-info">
                <h3><i class="fas fa-${exp.icon}"></i> ${exp.title}</h3>
                <p>${exp.description}</p>
                <p><strong>Features:</strong> ${exp.features.join(', ')}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editExperience('${exp.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteExperience('${exp.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openAddExperienceModal() {
    currentEditingId = null;
    document.getElementById('exTitle').value = '';
    document.getElementById('exDescription').value = '';
    document.getElementById('exFeatures').value = '';
    document.getElementById('exIcon').value = '';
    document.getElementById('experienceModal').classList.add('active');
}

function editExperience(id) {
    const experience = DataManager.getExperiences().find(e => e.id === id);
    if (!experience) return;
    
    currentEditingId = id;
    document.getElementById('exTitle').value = experience.title;
    document.getElementById('exDescription').value = experience.description;
    document.getElementById('exFeatures').value = experience.features.join(', ');
    document.getElementById('exIcon').value = experience.icon;
    document.getElementById('experienceModal').classList.add('active');
}

function saveExperience() {
    const title = document.getElementById('exTitle').value.trim();
    const description = document.getElementById('exDescription').value.trim();
    const featuresStr = document.getElementById('exFeatures').value.trim();
    const icon = document.getElementById('exIcon').value.trim();
    
    if (!title || !description || !featuresStr || !icon) {
        alert('Please fill all fields');
        return;
    }
    
    const features = featuresStr.split(',').map(f => f.trim());
    
    if (currentEditingId) {
        // Update existing
        DataManager.updateExperience(currentEditingId, {
            title, description, features, icon
        });
        showMessage('Experience updated successfully!');
    } else {
        // Add new
        DataManager.addExperience({
            title, description, features, icon
        });
        showMessage('Experience added successfully!');
    }
    
    closeModal('experienceModal');
    loadExperiences();
    loadDashboard();
    notifyPortfolioUpdate(['experiences']); // Notify portfolio to re-render experiences
}

function deleteExperience(id) {
    if (confirm('Are you sure you want to delete this experience?')) {
        DataManager.deleteExperience(id);
        showMessage('Experience deleted successfully!');
        loadExperiences();
        loadDashboard();
        notifyPortfolioUpdate(['experiences']); // Notify portfolio to re-render experiences
    }
}

// ===== SKILLS MANAGEMENT =====
function loadSkills() {
    const skills = DataManager.getSkills();
    
    // Load Testing Skills
    const testingContainer = document.getElementById('testingSkillsList');
    if (skills.testing.length === 0) {
        testingContainer.innerHTML = '<p style="color: #94a3b8;">No testing skills added.</p>';
    } else {
        testingContainer.innerHTML = skills.testing.map((skill, index) => `
            <div class="item-card">
                <div class="item-info">
                    <h3>${skill.name}</h3>
                    <p>Proficiency: ${skill.level}%</p>
                </div>
                <div class="item-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteTestingSkill(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Load Tools
    const toolsContainer = document.getElementById('toolsList');
    if (skills.tools.length === 0) {
        toolsContainer.innerHTML = '<p style="color: #94a3b8;">No tools added.</p>';
    } else {
        toolsContainer.innerHTML = skills.tools.map((tool, index) => `
            <div style="display: inline-flex; align-items: center; gap: 8px; background: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.3); padding: 8px 12px; border-radius: 6px;">
                <span>${tool}</span>
                <button onclick="deleteToolSkill(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
}

function openAddTestingSkillModal() {
    document.getElementById('skillName').value = '';
    document.getElementById('skillLevel').value = '';
    document.getElementById('testingSkillModal').classList.add('active');
}

function saveTestingSkill() {
    const name = document.getElementById('skillName').value.trim();
    const level = parseInt(document.getElementById('skillLevel').value);
    
    if (!name || isNaN(level) || level < 0 || level > 100) {
        alert('Please enter a valid skill name and proficiency level (0-100)');
        return;
    }
    
    DataManager.addTestingSkill({ name, level });
    showMessage('Skill added successfully!');
    closeModal('testingSkillModal');
    loadSkills();
    loadDashboard();
    notifyPortfolioUpdate(['skills']); // Notify portfolio to re-render skills
}

function deleteTestingSkill(index) {
    if (confirm('Delete this skill?')) {
        const skills = DataManager.getSkills();
        DataManager.removeTestingSkill(index);
        showMessage('Skill deleted successfully!');
        loadSkills();
        loadDashboard();
        notifyPortfolioUpdate(['skills']); // Notify portfolio to re-render skills
    }
}

function addToolSkill() {
    const input = document.getElementById('toolInput');
    const tool = input.value.trim();
    
    if (!tool) {
        alert('Please enter a tool name');
        return;
    }
    
    DataManager.addToolSkill(tool);
    showMessage('Tool added successfully!');
    input.value = '';
    loadSkills();
    loadDashboard();
    notifyPortfolioUpdate(['skills']); // Notify portfolio to re-render skills
}

function deleteToolSkill(index) {
    if (confirm('Delete this tool?')) {
        DataManager.removeToolSkill(index);
        showMessage('Tool deleted successfully!');
        loadSkills();
        loadDashboard();
        notifyPortfolioUpdate(['skills']); // Notify portfolio to re-render skills
    }
}

// ===== PROJECTS MANAGEMENT =====
function loadProjects() {
    const projects = DataManager.getProjects();
    const container = document.getElementById('projectsList');
    
    if (projects.length === 0) {
        container.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 40px;">No projects added yet.</p>';
        return;
    }
    
    container.innerHTML = projects.map(proj => `
        <div class="item-card">
            <div class="item-info">
                <h3>${proj.title} ${proj.featured ? '<span style="color: #00d2ff;">★ Featured</span>' : ''}</h3>
                <p>${proj.description}</p>
                <p><strong>Category:</strong> ${proj.category}</p>
                <p><strong>Technologies:</strong> ${proj.technologies.join(', ')}</p>
            </div>
            <div class="item-actions">
                <button class="btn btn-secondary btn-sm" onclick="editProject('${proj.id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm" onclick="deleteProject('${proj.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function openAddProjectModal() {
    currentEditingId = null;
    document.getElementById('projTitle').value = '';
    document.getElementById('projCategory').value = '';
    document.getElementById('projImage').value = '';
    document.getElementById('projDescription').value = '';
    document.getElementById('projTech').value = '';
    document.getElementById('projFeatured').checked = false;
    document.getElementById('projectModal').classList.add('active');
}

function editProject(id) {
    const project = DataManager.getProjects().find(p => p.id === id);
    if (!project) return;
    
    currentEditingId = id;
    document.getElementById('projTitle').value = project.title;
    document.getElementById('projCategory').value = project.category;
    document.getElementById('projImage').value = project.image;
    document.getElementById('projDescription').value = project.description;
    document.getElementById('projTech').value = project.technologies.join(', ');
    document.getElementById('projFeatured').checked = project.featured;
    document.getElementById('projectModal').classList.add('active');
}

function saveProject() {
    const title = document.getElementById('projTitle').value.trim();
    const category = document.getElementById('projCategory').value;
    const image = document.getElementById('projImage').value.trim();
    const description = document.getElementById('projDescription').value.trim();
    const techStr = document.getElementById('projTech').value.trim();
    const featured = document.getElementById('projFeatured').checked;
    
    if (!title || !category || !image || !description || !techStr) {
        alert('Please fill all fields');
        return;
    }
    
    const technologies = techStr.split(',').map(t => t.trim());
    
    const projectData = {
        title, category, image, description, technologies, featured
    };
    
    if (currentEditingId) {
        DataManager.updateProject(currentEditingId, projectData);
        showMessage('Project updated successfully!');
    } else {
        DataManager.addProject(projectData);
        showMessage('Project added successfully!');
    }
    
    closeModal('projectModal');
    loadProjects();
    loadDashboard();
    notifyPortfolioUpdate(['projects']); // Notify portfolio to re-render projects
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        DataManager.deleteProject(id);
        showMessage('Project deleted successfully!');
        loadProjects();
        loadDashboard();
        notifyPortfolioUpdate(['projects']); // Notify portfolio to re-render projects
    }
}

// ===== PROFILE MANAGEMENT =====
function loadProfile() {
    const profile = DataManager.getProfile();
    document.getElementById('profileName').value = profile.name;
    document.getElementById('profileTitle').value = profile.title;
    document.getElementById('profileEmail').value = profile.email;
    document.getElementById('profileDescription').value = profile.description;
}

function updateProfile() {
    const name = document.getElementById('profileName').value.trim();
    const title = document.getElementById('profileTitle').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const description = document.getElementById('profileDescription').value.trim();
    
    if (!name || !title || !email || !description) {
        alert('Please fill all fields');
        return;
    }
    
    DataManager.updateProfile({ name, title, email, description });
    showMessage('Profile updated successfully!');
    notifyPortfolioUpdate(['profile']); // Notify portfolio to update about section
}

// ===== MODAL FUNCTIONS =====
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    currentEditingId = null;
}

function showMessage(message) {
    const msg = document.createElement('div');
    msg.className = 'success-message';
    msg.textContent = message;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(msg, mainContent.firstChild);
    
    setTimeout(() => msg.remove(), 3000);
}

// ===== MESSAGES MANAGEMENT =====
function loadMessages() {
    const messages = DataManager.getMessages();
    const container = document.getElementById('messagesList');
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No messages yet. Visitors can send you inquiries through the contact form on your portfolio.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = messages.map(msg => {
        const date = new Date(msg.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const serviceLabel = {
            'automation': 'Test Automation',
            'manual': 'Manual Testing',
            'api': 'API Testing',
            'consultation': 'QA Consultation',
            'training': 'Team Training'
        }[msg.serviceType] || msg.serviceType;
        
        return `
            <div class="message-card ${msg.read ? '' : 'unread'}">
                <div class="message-header">
                    <div class="message-sender">
                        <div class="message-sender-name">${msg.name}</div>
                        <div class="message-sender-email">${msg.email}</div>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
                        ${msg.read ? '' : '<div class="message-badge"><i class="fas fa-envelope-open"></i> Unread</div>'}
                        ${msg.responded ? '<div class="message-badge responded"><i class="fas fa-check-double"></i> Responded</div>' : ''}
                    </div>
                </div>
                <div class="message-type">📋 ${serviceLabel}</div>
                <div class="message-content">${escapeHtml(msg.message)}</div>
                <div class="message-footer">
                    <div class="message-timestamp">
                        <i class="fas fa-clock"></i> ${date}
                    </div>
                    <div class="message-actions">
                        ${msg.read ? '' : `<button class="message-action-btn" onclick="markAsRead(${msg.id})"><i class="fas fa-check"></i> Mark Read</button>`}
                        ${msg.responded ? '' : `<button class="message-action-btn" onclick="markAsResponded(${msg.id})"><i class="fas fa-reply"></i> Responded</button>`}
                        <button class="message-action-btn delete" onclick="deleteMessage(${msg.id})"><i class="fas fa-trash"></i> Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function markAsRead(id) {
    DataManager.markMessageAsRead(id);
    loadMessages();
    loadDashboard();
    showMessage('Message marked as read');
}

function markAsResponded(id) {
    DataManager.markMessageAsResponded(id);
    loadMessages();
    loadDashboard();
    showMessage('Message marked as responded');
}

function deleteMessage(id) {
    if (confirm('Are you sure you want to delete this message?')) {
        DataManager.deleteMessage(id);
        loadMessages();
        loadDashboard();
        showMessage('Message deleted');
    }
}

function deleteAllMessages() {
    if (confirm('Delete all messages? This cannot be undone!')) {
        const messages = DataManager.getMessages();
        messages.forEach(msg => DataManager.deleteMessage(msg.id));
        loadMessages();
        loadDashboard();
        showMessage('All messages cleared');
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== UTILITY FUNCTIONS =====
function goToPortfolio() {
    window.location.href = 'index.html';
}

function resetData() {
    if (confirm('Reset all data to default? This cannot be undone!')) {
        DataManager.resetData();
        showMessage('Data reset to default!');
        loadDashboard();
        loadExperiences();
        loadSkills();
        loadProjects();
        loadProfile();
        notifyPortfolioUpdate(['profile', 'experiences', 'skills', 'projects']); // Notify portfolio of full reset
    }
}

function exportData() {
    const data = DataManager.getAllData();
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Data exported successfully!');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}
