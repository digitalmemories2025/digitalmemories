// ===========================
// Global Variables
// ===========================

let recruitmentOpen = true;

// ===========================
// Initialization
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    initializeRecruitmentToggle();
    initializeContactForms();
    initializeScrollToTop();
    setupFormValidation();
});

// ===========================
// Recruitment Toggle Functionality
// ===========================

function initializeRecruitmentToggle() {
    const toggle = document.getElementById('recruitmentToggle');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!toggle) return;

    // Set initial state
    toggle.checked = false;
    updateRecruitmentStatus();

    // Add change event listener
    toggle.addEventListener('change', function() {
        updateRecruitmentStatus();
    });
}

function updateRecruitmentStatus() {
    const toggle = document.getElementById('recruitmentToggle');
    const statusMessage = document.getElementById('statusMessage');
    
    if (!toggle || !statusMessage) return;

    recruitmentOpen = !toggle.checked;

    // Update status display
    statusMessage.innerHTML = recruitmentOpen ? 
        '<span class="status-badge open">RECRUITMENT OPEN</span>' :
        '<span class="status-badge closed">RECRUITMENT CLOSED</span>';

    // Update flyer status badges
    updateFlyerStatuses();

    // Show/hide contact form
    const contactForm = document.getElementById('flyer-contact');
    if (contactForm) {
        contactForm.style.display = recruitmentOpen ? 'block' : 'none';
    }

    // Disable/enable flyer buttons
    const flyerButtons = document.querySelectorAll('.flyer .btn');
    flyerButtons.forEach(button => {
        button.disabled = !recruitmentOpen;
        button.style.opacity = recruitmentOpen ? '1' : '0.5';
        button.style.cursor = recruitmentOpen ? 'pointer' : 'not-allowed';
    });
}

function updateFlyerStatuses() {
    const flyers = document.querySelectorAll('.flyer-container');
    
    flyers.forEach(flyer => {
        const statusBadge = flyer.querySelector('.flyer-status');
        if (statusBadge) {
            if (recruitmentOpen) {
                statusBadge.textContent = 'OPEN';
                statusBadge.classList.remove('closed');
                statusBadge.classList.add('open');
            } else {
                statusBadge.textContent = 'CLOSED';
                statusBadge.classList.remove('open');
                statusBadge.classList.add('closed');
            }
        }
    });
}

// ===========================
// Contact Form Handling
// ===========================

function initializeContactForms() {
    const contactForm = document.getElementById('contactForm');
    const flyerContactForm = document.getElementById('flyerContactForm');
    const subscribeForm = document.getElementById('subscribeForm');

    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    if (flyerContactForm) {
        flyerContactForm.addEventListener('submit', handleFlyerFormSubmit);
    }

    if (subscribeForm) {
        subscribeForm.addEventListener('submit', handleSubscribeFormSubmit);
    }
}

function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Validate form
    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Simulate form submission
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: new Date().toLocaleString()
    };

    console.log('Contact Form Submitted:', formData);
    
    // Show success message
    showNotification('Thank you! We received your message. We will get back to you soon.', 'success');
    
    // Reset form
    document.getElementById('contactForm').reset();
}

function handleFlyerFormSubmit(e) {
    e.preventDefault();

    if (!recruitmentOpen) {
        showNotification('Recruitment is currently closed. Thank you for your interest!', 'warning');
        return;
    }

    const name = document.getElementById('participant-name').value;
    const email = document.getElementById('participant-email').value;
    const phone = document.getElementById('participant-phone').value;
    const study = document.getElementById('interested-study').value;
    const consent = document.querySelector('input[name="consent"]').checked;

    // Validate form
    if (!name || !email || !study || !consent) {
        showNotification('Please fill in all required fields and provide consent', 'error');
        return;
    }

    // Simulate form submission
    const formData = {
        name: name,
        email: email,
        phone: phone,
        study: study,
        timestamp: new Date().toLocaleString()
    };

    console.log('Recruitment Form Submitted:', formData);
    
    // Show success message
    showNotification('Thank you for your interest! We will contact you within 3 business days.', 'success');
    
    // Reset form
    document.getElementById('flyerContactForm').reset();
}

function handleSubscribeFormSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('subscribe-email').value;

    // Validate email
    if (!email) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Simulate form submission
    const subscriptionData = {
        email: email,
        timestamp: new Date().toLocaleString()
    };

    console.log('Subscribe Form Submitted:', subscriptionData);
    
    // Show success message
    showNotification('Successfully subscribed! Check your email for confirmation.', 'success');
    
    // Reset form
    document.getElementById('subscribeForm').reset();
}

// ===========================
// Notification System
// ===========================

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background-color: ${getNotificationColor(type)};
        color: white;
        border-radius: 4px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;

    document.body.appendChild(notification);

    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || colors.info;
}

// ===========================
// Form Validation
// ===========================

function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const emailInputs = form.querySelectorAll('input[type="email"]');
        
        emailInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateEmail(this);
            });
            
            input.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        });
    });
}

function validateEmail(input) {
    const email = input.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        input.style.borderColor = '#e74c3c';
        showNotification('Please enter a valid email address', 'error');
    }
}

// ===========================
// Scroll to Form Function
// ===========================

function scrollToContactForm() {
    if (!recruitmentOpen) {
        showNotification('Recruitment is currently closed. Thank you for your interest!', 'warning');
        return;
    }

    const contactForm = document.getElementById('flyer-contact');
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
        // Focus on the first input in the form
        const firstInput = contactForm.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 600);
        }
    }
}

// ===========================
// Utility Functions
// ===========================

function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===========================
// Animation Styles (added to page dynamically)
// ===========================

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    .notification {
        font-weight: bold;
    }
`;

if (document.head) {
    document.head.appendChild(style);
}

// ===========================
// Smooth Scroll Behavior for Mobile
// ===========================

if (!CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// ===========================
// Log initialization
// ===========================

console.log('Digital Memory Project Website - Script Loaded Successfully');
