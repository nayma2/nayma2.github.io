// Data Management System with localStorage

const DataManager = {
    // Initialize default data
    initializeData() {
        if (!localStorage.getItem('portfolioData')) {
            const defaultData = {
                profile: {
                    name: 'Umma Habiba Nayma',
                    title: 'Professional QA Engineer',
                    email: 'nayma@example.com',
                    description: 'I specialize in finding bugs before your users do. Manual and Automation expert dedicated to software perfection.'
                },
                experiences: [
                    {
                        id: 1,
                        title: 'Manual Testing',
                        description: 'Regression, Exploratory & UI/UX Testing with detailed documentation and comprehensive test reports.',
                        features: ['Regression Testing', 'Exploratory Testing', 'UI/UX Testing'],
                        icon: 'fa-bug-slash'
                    },
                    {
                        id: 2,
                        title: 'Test Automation',
                        description: 'Selenium WebDriver with Python to speed up the testing lifecycle and improve test coverage effectively.',
                        features: ['Selenium WebDriver', 'Python Scripts', 'CI/CD Integration'],
                        icon: 'fa-terminal'
                    },
                    {
                        id: 3,
                        title: 'API & Database Testing',
                        description: 'Writing robust test cases and bug reports using JIRA and Bugzilla with SQL expertise.',
                        features: ['Postman API Testing', 'SQL Queries', 'Bug Tracking'],
                        icon: 'fa-vial'
                    }
                ],
                messages: [],
                skills: {
                    testing: [
                        { name: 'Manual Testing', level: 95 },
                        { name: 'Selenium Automation', level: 85 },
                        { name: 'API Testing', level: 88 }
                    ],
                    tools: [
                        'Python', 'Selenium', 'Postman', 'JIRA', 'SQL', 'Git', 'Agile/Scrum', 'Bugzilla'
                    ]
                },
                projects: [
                    {
                        id: 1,
                        title: 'E-Commerce Platform Testing',
                        category: 'Automation',
                        image: 'Gameplay.png',
                        description: 'Built and executed comprehensive test automation suite using Selenium WebDriver with Python. Achieved 85% test coverage with automated regression tests.',
                        technologies: ['Selenium', 'Python', 'CI/CD'],
                        featured: true,
                        links: {
                            report: '#',
                            code: '#'
                        }
                    },
                    {
                        id: 2,
                        title: 'Question Bank Analysis',
                        category: 'Manual Testing',
                        image: 'question_bank.jpg',
                        description: 'Executed thorough manual testing with detailed test cases and comprehensive bug reports. Identified and documented 50+ critical and major issues.',
                        technologies: ['JIRA', 'TestRail', 'SQL'],
                        featured: false,
                        links: {
                            testCases: '#',
                            bugReports: '#'
                        }
                    },
                    {
                        id: 3,
                        title: 'REST API Testing Suite',
                        category: 'API Testing',
                        image: 'Gameplay.png',
                        description: 'Designed comprehensive API test collections with Postman. Validated request/response contracts and performed database assertions using SQL queries.',
                        technologies: ['Postman', 'SQL', 'REST'],
                        featured: false,
                        links: {
                            collection: '#',
                            docs: '#'
                        }
                    }
                ]
            };
            localStorage.setItem('portfolioData', JSON.stringify(defaultData));
        }
    },

    // Get all data
    getAllData() {
        this.initializeData();
        return JSON.parse(localStorage.getItem('portfolioData'));
    },

    // Get profile
    getProfile() {
        return this.getAllData().profile;
    },

    // Update profile
    updateProfile(profile) {
        const data = this.getAllData();
        data.profile = { ...data.profile, ...profile };
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return data.profile;
    },

    // Get experiences
    getExperiences() {
        return this.getAllData().experiences;
    },

    // Add experience
    addExperience(experience) {
        const data = this.getAllData();
        const newId = Math.max(...data.experiences.map(e => e.id), 0) + 1;
        const newExperience = { id: newId, ...experience };
        data.experiences.push(newExperience);
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return newExperience;
    },

    // Update experience
    updateExperience(id, experience) {
        const data = this.getAllData();
        const index = data.experiences.findIndex(e => e.id === id);
        if (index !== -1) {
            data.experiences[index] = { ...data.experiences[index], ...experience };
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
        return data.experiences[index];
    },

    // Delete experience
    deleteExperience(id) {
        const data = this.getAllData();
        data.experiences = data.experiences.filter(e => e.id !== id);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    },

    // Get skills
    getSkills() {
        return this.getAllData().skills;
    },

    // Update skills
    updateSkills(skills) {
        const data = this.getAllData();
        data.skills = { ...data.skills, ...skills };
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return data.skills;
    },

    // Add testing skill
    addTestingSkill(skill) {
        const data = this.getAllData();
        data.skills.testing.push(skill);
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return skill;
    },

    // Update testing skill
    updateTestingSkill(index, skill) {
        const data = this.getAllData();
        if (data.skills.testing[index]) {
            data.skills.testing[index] = skill;
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
    },

    // Delete testing skill
    deleteTestingSkill(index) {
        const data = this.getAllData();
        data.skills.testing.splice(index, 1);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    },

    // Add tool skill
    addToolSkill(tool) {
        const data = this.getAllData();
        if (!data.skills.tools.includes(tool)) {
            data.skills.tools.push(tool);
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
    },

    // Remove tool skill
    removeToolSkill(tool) {
        const data = this.getAllData();
        data.skills.tools = data.skills.tools.filter(t => t !== tool);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    },

    // Get projects
    getProjects() {
        return this.getAllData().projects;
    },

    // Add project
    addProject(project) {
        const data = this.getAllData();
        const newId = Math.max(...data.projects.map(p => p.id), 0) + 1;
        const newProject = { id: newId, ...project };
        data.projects.push(newProject);
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return newProject;
    },

    // Update project
    updateProject(id, project) {
        const data = this.getAllData();
        const index = data.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            data.projects[index] = { ...data.projects[index], ...project };
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
        return data.projects[index];
    },

    // Delete project
    deleteProject(id) {
        const data = this.getAllData();
        data.projects = data.projects.filter(p => p.id !== id);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    },

    // ===== MESSAGE MANAGEMENT =====
    getMessages() {
        const data = this.getAllData();
        return data.messages || [];
    },

    addMessage(message) {
        const data = this.getAllData();
        if (!data.messages) {
            data.messages = [];
        }
        const newMessage = {
            id: Date.now(),
            name: message.name,
            email: message.email,
            serviceType: message.serviceType,
            message: message.message,
            timestamp: new Date().toISOString(),
            read: false,
            responded: false
        };
        data.messages.unshift(newMessage); // Add to beginning
        localStorage.setItem('portfolioData', JSON.stringify(data));
        return newMessage;
    },

    deleteMessage(id) {
        const data = this.getAllData();
        data.messages = data.messages.filter(msg => msg.id !== id);
        localStorage.setItem('portfolioData', JSON.stringify(data));
    },

    markMessageAsRead(id) {
        const data = this.getAllData();
        const message = data.messages.find(msg => msg.id === id);
        if (message) {
            message.read = true;
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
    },

    markMessageAsResponded(id) {
        const data = this.getAllData();
        const message = data.messages.find(msg => msg.id === id);
        if (message) {
            message.responded = true;
            localStorage.setItem('portfolioData', JSON.stringify(data));
        }
    },

    // Reset to default
    resetToDefault() {
        localStorage.removeItem('portfolioData');
        this.initializeData();
    }
};

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DataManager.initializeData();
    });
} else {
    DataManager.initializeData();
}
