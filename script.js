// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Form submission
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const formInputs = this.querySelectorAll('input, textarea, select');
        
        // Simple form validation
        let isValid = true;
        formInputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Email validation
        const emailInput = this.querySelector('input[type="email"]');
        if (emailInput) {
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailInput.style.borderColor = '#ef4444';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
        }
        
        // Phone validation
        const phoneInput = this.querySelector('input[type="tel"]');
        if (phoneInput) {
            const phone = phoneInput.value;
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
                phoneInput.style.borderColor = '#ef4444';
                showNotification('Please enter a valid phone number.', 'error');
                return;
            }
        }
        
        // Get form data for WhatsApp
        const firstName = this.querySelector('input[placeholder*="First name"]').value.trim();
        const lastName = this.querySelector('input[placeholder*="Last name"]').value.trim();
        const email = this.querySelector('input[type="email"]').value.trim();
        const phone = this.querySelector('input[type="tel"]').value.trim();
        const message = this.querySelector('textarea').value.trim();
        const serviceSelect = this.querySelector('#service-select');
        const selectedService = serviceSelect ? serviceSelect.options[serviceSelect.selectedIndex].text : null;
        
        // Create WhatsApp message
        let whatsappMessage = `Hello! I would like to book an appointment.

*Patient Details:*
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}`;

        if (selectedService && serviceSelect.value) {
            whatsappMessage += `\nService: ${selectedService}`;
        }

        if (message) {
            whatsappMessage += `\nMessage: ${message}`;
        }

        whatsappMessage += `\n\nPlease confirm my appointment and let me know the available times.

Thank you!`;
        
        // WhatsApp business number (Sri Lankan format)
        const whatsappNumber = '94778540201'; // 077 854 0201 in international format
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Update button text and open WhatsApp
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Opening WhatsApp...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Reset form and button
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            showNotification('Redirecting to WhatsApp! Please send the message to complete your booking.', 'success');
        }, 1000);
    });
}

// Join Now Enhanced Functionality with Choice Dialog
const joinModal = document.getElementById('joinModal');
const openJoinModalBtn = document.querySelector('.community-btn');
const closeJoinModalBtn = document.getElementById('closeJoinModal');
const joinForm = document.getElementById('joinForm');

// Direct navigation to join page when join now is clicked
if (openJoinModalBtn) {
    openJoinModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToBooking();
    });
}

// Also connect Get Started button to book appointment
const getStartedBtn = document.querySelector('.cta-button');
if (getStartedBtn) {
    getStartedBtn.addEventListener('click', function(e) {
        e.preventDefault();
        scrollToBooking();
    });
}

// Original modal functionality
if (joinModal && closeJoinModalBtn) {
    closeJoinModalBtn.addEventListener('click', function() {
        joinModal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === joinModal) {
            joinModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

if (joinForm) {
    joinForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = this.querySelector('input[name="name"]');
        const email = this.querySelector('input[name="email"]');
        const phone = this.querySelector('input[name="phone"]');
        let isValid = true;
        
        if (name && email && phone) {
            [name, email, phone].forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = 'var(--error)';
                    isValid = false;
                } else {
                    input.style.borderColor = 'var(--primary-purple)';
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                email.style.borderColor = 'var(--error)';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Phone validation
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone.value) || phone.value.replace(/\D/g, '').length < 10) {
                phone.style.borderColor = 'var(--error)';
                showNotification('Please enter a valid phone number.', 'error');
                return;
            }
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Joining...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                joinModal.classList.remove('show');
                document.body.style.overflow = '';
                showNotification('Thank you for joining our community! We will contact you soon.', 'success');
            }, 1800);
        }
    });
}

// Dynamic form fields handling for join page
const interestTypeSelect = document.getElementById('interestType');
if (interestTypeSelect) {
    interestTypeSelect.addEventListener('change', function() {
        const value = this.value;
        const experienceGroup = document.getElementById('experienceGroup');
        const specializationGroup = document.getElementById('specializationGroup');
        const availabilityGroup = document.getElementById('availabilityGroup');
        
        // Hide all conditional groups first
        if (experienceGroup) experienceGroup.style.display = 'none';
        if (specializationGroup) specializationGroup.style.display = 'none';
        if (availabilityGroup) availabilityGroup.style.display = 'none';
        
        // Show relevant groups based on selection
        if (value === 'healthcare-professional' || value === 'caregiver') {
            if (experienceGroup) experienceGroup.style.display = 'block';
            if (specializationGroup) specializationGroup.style.display = 'block';
            if (availabilityGroup) availabilityGroup.style.display = 'block';
        } else if (value === 'volunteer') {
            if (availabilityGroup) availabilityGroup.style.display = 'block';
        }
    });
}

// Detailed Join Form WhatsApp Integration
const detailedJoinForm = document.getElementById('detailedJoinForm');
console.log('detailedJoinForm found:', detailedJoinForm);
if (detailedJoinForm) {
    detailedJoinForm.addEventListener('submit', function(e) {
        console.log('Form submit event triggered');
        e.preventDefault();
        
        // Get form data
        const firstName = document.getElementById('firstName')?.value?.trim() || '';
        const lastName = document.getElementById('lastName')?.value?.trim() || '';
        const email = document.getElementById('email')?.value?.trim() || '';
        const phone = document.getElementById('phone')?.value?.trim() || '';
        const dateOfBirth = document.getElementById('dateOfBirth')?.value || '';
        const gender = document.getElementById('gender')?.value || '';
        const address = document.getElementById('address')?.value?.trim() || '';
        const interestType = document.getElementById('interestType')?.value || '';
        const experience = document.getElementById('experience')?.value || '';
        const specialization = document.getElementById('specialization')?.value?.trim() || '';
        const message = document.getElementById('message')?.value?.trim() || '';
        const hearAboutUs = document.getElementById('hearAboutUs')?.value || '';
        const consent = document.getElementById('consent')?.checked || false;
        const newsletter = document.getElementById('newsletter')?.checked || false;
        
        // Get availability checkboxes (optional)
        const availabilityCheckboxes = document.querySelectorAll('input[name="availability[]"]:checked');
        const availability = availabilityCheckboxes.length > 0 ? 
            Array.from(availabilityCheckboxes).map(cb => cb.value).join(', ') : 
            'Not specified';
        
        console.log('Form data collected:', { firstName, lastName, email, phone, interestType, consent });
        
        // Form validation (excluding availability checkboxes)
        const formInputs = this.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        console.log('Required inputs found:', formInputs.length);
        
        formInputs.forEach(input => {
            // Skip availability checkboxes from validation (they are optional)
            if (input.name && input.name.includes('availability')) {
                return;
            }
            
            if (input.type === 'checkbox') {
                if (!input.checked) {
                    input.parentElement.style.color = '#ef4444';
                    isValid = false;
                    console.log('Required checkbox not checked:', input.id);
                } else {
                    input.parentElement.style.color = '';
                }
            } else if (!input.value.trim()) {
                input.style.borderColor = '#ef4444';
                isValid = false;
                console.log('Required field empty:', input.id);
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });
        
        console.log('Form validation result:', isValid);
        
        if (!isValid) {
            console.log('Form validation failed');
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        console.log('Basic validation passed, checking email...');
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log('Email validation failed:', email);
            document.getElementById('email').style.borderColor = '#ef4444';
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        console.log('Email validation passed, checking phone...');
        
        // Phone validation
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
            console.log('Phone validation failed:', phone);
            document.getElementById('phone').style.borderColor = '#ef4444';
            showNotification('Please enter a valid phone number.', 'error');
            return;
        }
        
        console.log('All validations passed, creating WhatsApp message...');
        
        // Test alert to confirm form is working
        alert('Form validation passed! About to create WhatsApp message...');
        
        // Create simple WhatsApp message with just the data
        let whatsappMessage = `Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}`;

        if (dateOfBirth) {
            whatsappMessage += `\nDate of Birth: ${dateOfBirth}`;
        }
        
        if (gender) {
            whatsappMessage += `\nGender: ${gender}`;
        }
        
        if (address) {
            whatsappMessage += `\nAddress: ${address}`;
        }

        whatsappMessage += `\nInterest Type: ${interestType}`;

        if (experience) {
            whatsappMessage += `\nExperience: ${experience}`;
        }
        
        if (specialization) {
            whatsappMessage += `\nSpecialization: ${specialization}`;
        }
        
        if (availability && availability !== 'Not specified') {
            whatsappMessage += `\nAvailability: ${availability}`;
        }
        
        if (message) {
            whatsappMessage += `\nMessage: ${message}`;
        }
        
        if (hearAboutUs) {
            whatsappMessage += `\nHow heard about us: ${hearAboutUs}`;
        }
        
        console.log('WhatsApp message created:', whatsappMessage);
        
        // WhatsApp business number (Sri Lankan format)
        const whatsappNumber = '94778540201'; // 077 854 0201 in international format
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        console.log('WhatsApp URL:', whatsappURL);
        
        // Simple alert to show URL
        alert(`WhatsApp URL created: ${whatsappURL.substring(0, 100)}...`);
        
        // Update button text and open WhatsApp
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Opening WhatsApp...';
        submitButton.disabled = true;
        
        console.log('About to open WhatsApp...');
        
        // Simple window.open
        const opened = window.open(whatsappURL, '_blank');
        
        if (opened) {
            console.log('WhatsApp opened successfully');
            alert('WhatsApp should have opened! Check for a new tab/window.');
        } else {
            console.log('Failed to open WhatsApp');
            alert('Could not open WhatsApp automatically. Please copy the URL from console.');
        }
        
        // Reset form and button after 2 seconds
        setTimeout(() => {
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 2000);
    });
}

// Show notification function
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    // Set background color based on type
    switch(type) {
        case 'success':
            notification.style.backgroundColor = '#22c55e';
            break;
        case 'error':
            notification.style.backgroundColor = '#ef4444';
            break;
        default:
            notification.style.backgroundColor = '#2563eb';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
window.addEventListener('load', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .team-member, .stat-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000, suffix = '') {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.dataset.target);
                const suffix = stat.dataset.suffix || '';
                animateCounter(stat, target, 2000, suffix);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

window.addEventListener('load', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});

// Book appointment button functionality
document.querySelectorAll('.book-appointment-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToBooking();
    });
});

// About page "Read more" button functionality
const aboutReadMoreBtn = document.querySelector('.about-btn');
if (aboutReadMoreBtn) {
    aboutReadMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'about.html';
    });
}

// Add loading animation to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.classList.contains('loading')) {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Parallax effect for hero section (if hero image exists)
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage && scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// Image lazy loading fallback for older browsers
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add hover effects to interactive elements
document.querySelectorAll('.service-card, .team-member').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any open modals/notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => notification.remove());
    }
});

// Add focus indicators for accessibility
document.querySelectorAll('button, a, input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary-teal)';
        this.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', function() {
        this.style.outline = 'none';
    });
});

// Print styles optimization
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});

// Scroll to booking section function
function scrollToBooking() {
    const bookingSection = document.querySelector('.booking') || document.getElementById('booking-section');
    if (bookingSection) {
        const offsetTop = bookingSection.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

console.log('Loyal Home Nursing Care website loaded successfully! 🏥💜');

// Service Detail Page Functionality (only loads when service detail elements exist)
if (document.getElementById('service-title')) {
    // Service data for service detail pages
    const serviceData = {
        'skilled-nursing': {
            title: 'Skilled Nursing Care',
            subtitle: 'Professional nursing care in the comfort of your home',
            image: 'images/services/SkilledNursing Care.jpg',
            icon: 'fas fa-user-nurse',
            description: 'Our registered nurses provide comprehensive medical care including wound care, medication administration, and health monitoring.',
            overview: 'Our skilled nursing services bring hospital-quality care directly to your home. Our licensed registered nurses are trained to handle complex medical needs while ensuring patient comfort and family peace of mind.',
            benefits: [
                {
                    icon: 'fas fa-home',
                    title: 'Home Comfort',
                    description: 'Receive professional medical care in the comfort of your own home.'
                },
                {
                    icon: 'fas fa-graduation-cap',
                    title: 'Qualified Nurses',
                    description: 'All our nurses are licensed and experienced professionals.'
                },
                {
                    icon: 'fas fa-heartbeat',
                    title: 'Comprehensive Care',
                    description: 'Full range of medical services including wound care and monitoring.'
                },
                {
                    icon: 'fas fa-phone',
                    title: '24/7 Support',
                    description: 'Round-the-clock availability for emergencies and questions.'
                }
            ],
            process: [
                {
                    title: 'Initial Assessment',
                    description: 'Comprehensive evaluation of your medical needs and condition.'
                },
                {
                    title: 'Care Planning',
                    description: 'Development of a detailed nursing care plan.'
                },
                {
                    title: 'Service Delivery',
                    description: 'Professional nursing care according to your schedule.'
                },
                {
                    title: 'Ongoing Monitoring',
                    description: 'Regular assessment and care plan updates.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-syringe',
                    title: 'Injection Services',
                    description: 'Safe administration of various types of injections and IV medications.'
                },
                {
                    icon: 'fas fa-thermometer-half',
                    title: 'Vital Signs Monitoring',
                    description: 'Regular monitoring of blood pressure, temperature, pulse, and respiratory rate.'
                },
                {
                    icon: 'fas fa-band-aid',
                    title: 'Wound Care',
                    description: 'Professional wound assessment, cleaning, dressing changes, and healing monitoring.'
                }
            ],
            faqs: [
                {
                    question: 'What services are included in skilled nursing care?',
                    answer: 'Our skilled nursing includes wound care, medication administration, vital sign monitoring, injections, catheter care, and health assessments.'
                },
                {
                    question: 'Are your nurses licensed?',
                    answer: 'Yes, all our nurses are licensed registered nurses with extensive experience in home healthcare and continuing education.'
                },
                {
                    question: 'How quickly can you start services?',
                    answer: 'We can typically begin services within 24-48 hours of your initial consultation, depending on your specific needs.'
                },
                {
                    question: 'Do you work with insurance?',
                    answer: 'We work with most insurance providers and can help you understand your coverage options for home nursing services.'
                }
            ],
            reviews: [
                {
                    name: 'John Davis',
                    rating: '★★★★★',
                    text: 'The skilled nursing team provided excellent care during my recovery. Their professionalism gave us great peace of mind.'
                },
                {
                    name: 'Susan Miller',
                    rating: '★★★★★',
                    text: 'Outstanding care! The nurses are knowledgeable, gentle, and always professional. Highly recommend their services.'
                },
                {
                    name: 'Robert Wilson',
                    rating: '★★★★★',
                    text: 'Excellent nursing care. They helped me avoid readmission to the hospital and recover much faster at home.'
                }
            ]
        },
        'medication-management': {
            title: 'Medication Management',
            subtitle: 'Safe and accurate medication administration',
            image: 'images/services/MedicationManagement.jpg',
            icon: 'fas fa-pills',
            description: 'We offer expert medication management services to ensure safe and effective medication administration for optimal health outcomes.',
            overview: 'Our medication management service is designed to help patients safely manage their medications at home. Our qualified nurses ensure proper dosing, timing, and monitoring of medications to prevent adverse reactions and optimize therapeutic outcomes.',
            benefits: [
                {
                    icon: 'fas fa-shield-alt',
                    title: 'Safe Administration',
                    description: 'Proper medication dosing and timing to prevent errors and adverse reactions.'
                },
                {
                    icon: 'fas fa-clock',
                    title: 'Timely Reminders',
                    description: 'Regular medication schedules and reminders to ensure consistency.'
                },
                {
                    icon: 'fas fa-chart-line',
                    title: 'Progress Monitoring',
                    description: 'Continuous monitoring of medication effectiveness and side effects.'
                },
                {
                    icon: 'fas fa-user-md',
                    title: 'Expert Supervision',
                    description: 'Professional oversight by qualified healthcare professionals.'
                }
            ],
            process: [
                {
                    title: 'Initial Assessment',
                    description: 'Comprehensive evaluation of current medications and health status.'
                },
                {
                    title: 'Plan Development',
                    description: 'Creating a personalized medication management plan.'
                },
                {
                    title: 'Implementation',
                    description: 'Regular medication administration and monitoring.'
                },
                {
                    title: 'Review & Adjust',
                    description: 'Ongoing assessment and plan adjustments as needed.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-prescription-bottle-alt',
                    title: 'Prescription Management',
                    description: 'Complete oversight of all prescribed medications including refills and renewals.'
                },
                {
                    icon: 'fas fa-calendar-alt',
                    title: 'Scheduling',
                    description: 'Organized medication schedules tailored to your daily routine.'
                },
                {
                    icon: 'fas fa-file-medical',
                    title: 'Documentation',
                    description: 'Detailed records of all medication administration and patient responses.'
                }
            ],
            faqs: [
                {
                    question: 'How often will nurses visit for medication management?',
                    answer: 'Visit frequency depends on your specific needs and medication requirements. We can arrange daily, weekly, or as-needed visits based on your prescription schedule and complexity.'
                },
                {
                    question: 'What types of medications can you manage?',
                    answer: 'We can manage most oral medications, injections, topical treatments, and specialized medications as prescribed by your physician.'
                },
                {
                    question: 'Do you coordinate with my doctor?',
                    answer: 'Yes, we maintain regular communication with your healthcare provider to ensure coordinated care and report any concerns.'
                },
                {
                    question: 'What if I miss a dose?',
                    answer: 'Our nurses will provide you with clear instructions on what to do if doses are missed, and we maintain detailed protocols for various scenarios.'
                }
            ],
            reviews: [
                {
                    name: 'Maria Thompson',
                    rating: '★★★★★',
                    text: 'The medication management service has been a lifesaver for our family. The nurses are so careful and professional.'
                },
                {
                    name: 'David Chen',
                    rating: '★★★★★',
                    text: 'Excellent service! They helped me organize all my medications and now I feel confident about my treatment plan.'
                },
                {
                    name: 'Eleanor Rodriguez',
                    rating: '★★★★★',
                    text: 'Professional and caring service. The nurse explains everything clearly and makes sure I understand each medication.'
                }
            ]
        },
        'chronic-disease': {
            title: 'Chronic Disease Management',
            subtitle: 'Comprehensive care for long-term conditions',
            image: 'images/services/ChronicDiseaseManagement.jpg',
            icon: 'fas fa-heartbeat',
            description: 'Our chronic disease management programs help patients manage conditions like diabetes, heart disease, COPD, and hypertension with personalized care plans and ongoing support.',
            overview: 'Our chronic disease management program provides specialized care for patients with long-term health conditions. We focus on education, monitoring, and support to help you manage your condition effectively and maintain the best possible quality of life.',
            benefits: [
                {
                    icon: 'fas fa-clipboard-list',
                    title: 'Personalized Plans',
                    description: 'Customized care plans tailored to your specific condition and needs.'
                },
                {
                    icon: 'fas fa-chart-bar',
                    title: 'Regular Monitoring',
                    description: 'Consistent tracking of your health metrics and symptoms.'
                },
                {
                    icon: 'fas fa-graduation-cap',
                    title: 'Patient Education',
                    description: 'Comprehensive education about your condition and self-care techniques.'
                },
                {
                    icon: 'fas fa-users',
                    title: 'Family Support',
                    description: 'Support and education for family members and caregivers.'
                }
            ],
            process: [
                {
                    title: 'Condition Assessment',
                    description: 'Thorough evaluation of your chronic condition and current management.'
                },
                {
                    title: 'Goal Setting',
                    description: 'Establishing realistic health goals and milestones.'
                },
                {
                    title: 'Care Implementation',
                    description: 'Regular monitoring, education, and support services.'
                },
                {
                    title: 'Progress Review',
                    description: 'Regular evaluation and adjustment of your care plan.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-tint',
                    title: 'Blood Sugar Management',
                    description: 'Specialized diabetes care including glucose monitoring and insulin management.'
                },
                {
                    icon: 'fas fa-lungs',
                    title: 'Respiratory Care',
                    description: 'COPD and asthma management including breathing exercises and oxygen therapy.'
                },
                {
                    icon: 'fas fa-heart',
                    title: 'Cardiac Care',
                    description: 'Heart disease management including blood pressure monitoring and lifestyle counseling.'
                }
            ],
            faqs: [
                {
                    question: 'What chronic conditions do you manage?',
                    answer: 'We manage diabetes, heart disease, COPD, hypertension, arthritis, kidney disease, and many other chronic conditions.'
                },
                {
                    question: 'How often will I receive care?',
                    answer: 'Visit frequency is customized based on your condition and needs, ranging from daily to monthly visits.'
                },
                {
                    question: 'Do you provide education materials?',
                    answer: 'Yes, we provide comprehensive educational materials, one-on-one teaching sessions, and family education programs.'
                },
                {
                    question: 'Can you help with lifestyle changes?',
                    answer: 'Absolutely! We provide guidance on diet, exercise, stress management, and other lifestyle modifications specific to your condition.'
                }
            ],
            reviews: [
                {
                    name: 'Sarah Williams',
                    rating: '★★★★★',
                    text: 'The chronic disease management program helped me understand my diabetes better and improved my quality of life significantly.'
                },
                {
                    name: 'James Peterson',
                    rating: '★★★★★',
                    text: 'Excellent support for my heart condition. The nurses are very knowledgeable and helped me manage my medications better.'
                },
                {
                    name: 'Mary Johnson',
                    rating: '★★★★★',
                    text: 'Great program! They taught me so much about managing my COPD. I feel more confident about my health now.'
                }
            ]
        },
        'rehabilitation': {
            title: 'Rehabilitation Support',
            subtitle: 'Recovery assistance and mobility support',
            image: 'images/services/RehabilitationSupport.jpg',
            icon: 'fas fa-wheelchair',
            description: 'We provide comprehensive rehabilitation support to help patients recover and regain independence after illness, injury, surgery, or stroke through personalized therapy programs.',
            overview: 'Our rehabilitation support services are designed to help you regain strength, mobility, and independence following an illness, injury, or surgery. Our team works closely with you to develop a personalized rehabilitation plan that meets your specific goals and needs.',
            benefits: [
                {
                    icon: 'fas fa-running',
                    title: 'Mobility Improvement',
                    description: 'Focused exercises and therapy to improve movement and function.'
                },
                {
                    icon: 'fas fa-bullseye',
                    title: 'Goal-Oriented',
                    description: 'Personalized goals to help you achieve maximum independence.'
                },
                {
                    icon: 'fas fa-hands-helping',
                    title: 'Adaptive Training',
                    description: 'Training on adaptive equipment and techniques for daily living.'
                },
                {
                    icon: 'fas fa-chart-line',
                    title: 'Progress Tracking',
                    description: 'Regular assessment of your progress and plan adjustments.'
                }
            ],
            process: [
                {
                    title: 'Initial Evaluation',
                    description: 'Assessment of your current abilities and rehabilitation needs.'
                },
                {
                    title: 'Goal Setting',
                    description: 'Establishing specific, measurable rehabilitation goals.'
                },
                {
                    title: 'Therapy Sessions',
                    description: 'Regular rehabilitation sessions and exercises.'
                },
                {
                    title: 'Independence Training',
                    description: 'Training for activities of daily living and equipment use.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-walking',
                    title: 'Mobility Training',
                    description: 'Gait training, balance exercises, and mobility equipment instruction.'
                },
                {
                    icon: 'fas fa-brain',
                    title: 'Cognitive Rehabilitation',
                    description: 'Memory exercises, problem-solving activities, and cognitive skill building.'
                },
                {
                    icon: 'fas fa-utensils',
                    title: 'Daily Living Skills',
                    description: 'Training in activities of daily living including bathing, dressing, and cooking.'
                }
            ],
            faqs: [
                {
                    question: 'What types of rehabilitation do you provide?',
                    answer: 'We provide post-surgical rehabilitation, stroke recovery, injury rehabilitation, and general mobility improvement programs.'
                },
                {
                    question: 'How long does rehabilitation typically take?',
                    answer: 'Duration varies based on your condition and goals, typically ranging from weeks to several months.'
                },
                {
                    question: 'Do you work with my doctor?',
                    answer: 'Yes, we coordinate closely with your physician, physical therapists, and other healthcare providers.'
                },
                {
                    question: 'What equipment do you provide?',
                    answer: 'We can provide or recommend various rehabilitation equipment and adaptive devices to support your recovery.'
                }
            ],
            reviews: [
                {
                    name: 'Robert Johnson',
                    rating: '★★★★★',
                    text: 'The rehabilitation support helped me regain my independence after my stroke. The team was incredibly patient and encouraging.'
                },
                {
                    name: 'Linda Martinez',
                    rating: '★★★★★',
                    text: 'Excellent rehabilitation program. They helped me get back on my feet after surgery. Very professional and caring staff.'
                },
                {
                    name: 'Thomas Anderson',
                    rating: '★★★★★',
                    text: 'Great support during my recovery. The therapists are skilled and really understand how to motivate patients.'
                }
            ]
        },
        'wound-care': {
            title: 'Wound Care Management',
            subtitle: 'Professional wound assessment and treatment',
            image: 'images/services/WoundCareManagement.jpg',
            icon: 'fas fa-band-aid',
            description: 'Expert wound assessment, treatment, and monitoring services to promote healing and prevent complications for all types of wounds including surgical, diabetic, and pressure ulcers.',
            overview: 'Our wound care management service provides specialized care for all types of wounds, from surgical incisions to chronic ulcers. Our certified wound care nurses use evidence-based practices to promote healing and prevent complications.',
            benefits: [
                {
                    icon: 'fas fa-microscope',
                    title: 'Expert Assessment',
                    description: 'Thorough wound evaluation and documentation of healing progress.'
                },
                {
                    icon: 'fas fa-shield-virus',
                    title: 'Infection Prevention',
                    description: 'Sterile techniques and proper wound care to prevent infections.'
                },
                {
                    icon: 'fas fa-pills',
                    title: 'Advanced Treatments',
                    description: 'Modern wound care products and treatment techniques.'
                },
                {
                    icon: 'fas fa-calendar-check',
                    title: 'Regular Monitoring',
                    description: 'Scheduled visits to monitor healing and adjust treatment.'
                }
            ],
            process: [
                {
                    title: 'Wound Assessment',
                    description: 'Comprehensive evaluation of wound type, size, and condition.'
                },
                {
                    title: 'Treatment Plan',
                    description: 'Development of a specific wound care protocol.'
                },
                {
                    title: 'Care Delivery',
                    description: 'Regular wound cleaning, dressing changes, and monitoring.'
                },
                {
                    title: 'Healing Progress',
                    description: 'Ongoing assessment and treatment adjustments.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-cut',
                    title: 'Surgical Wound Care',
                    description: 'Post-operative wound care including suture and staple removal.'
                },
                {
                    icon: 'fas fa-procedures',
                    title: 'Chronic Wound Management',
                    description: 'Specialized care for diabetic ulcers, pressure sores, and venous ulcers.'
                },
                {
                    icon: 'fas fa-camera',
                    title: 'Wound Documentation',
                    description: 'Digital photography and detailed documentation of wound progression.'
                }
            ],
            faqs: [
                {
                    question: 'What types of wounds do you treat?',
                    answer: 'We treat surgical wounds, pressure ulcers, diabetic ulcers, burns, and various acute and chronic wounds.'
                },
                {
                    question: 'How often are dressing changes needed?',
                    answer: 'Frequency depends on the wound type and healing stage, typically ranging from daily to weekly.'
                },
                {
                    question: 'Do you provide supplies?',
                    answer: 'Yes, we provide all necessary wound care supplies and dressings as part of our service.'
                },
                {
                    question: 'How do you prevent infection?',
                    answer: 'We use strict sterile techniques, appropriate antimicrobial dressings, and monitor for signs of infection.'
                }
            ],
            reviews: [
                {
                    name: 'Linda Martinez',
                    rating: '★★★★★',
                    text: 'The wound care team was amazing. My surgical wound healed perfectly with their expert care and attention.'
                },
                {
                    name: 'George Thompson',
                    rating: '★★★★★',
                    text: 'Excellent wound care service. They healed my diabetic ulcer that had been problematic for months.'
                },
                {
                    name: 'Patricia Davis',
                    rating: '★★★★★',
                    text: 'Professional and gentle care. The nurses explained everything and my wound healed faster than expected.'
                }
            ]
        },
        'physiotherapy': {
            title: 'Physiotherapy',
            subtitle: 'Movement therapy and physical rehabilitation',
            image: 'images/services/PhysiotherapyServices.jpg',
            icon: 'fas fa-dumbbell',
            description: 'Professional physiotherapy services to improve mobility, strength, and function through personalized treatment plans, therapeutic exercises, and manual therapy techniques.',
            overview: 'Our physiotherapy services focus on restoring movement and function through exercise, manual therapy, and education. Our licensed physiotherapists create personalized treatment plans to help you achieve your mobility and strength goals.',
            benefits: [
                {
                    icon: 'fas fa-walking',
                    title: 'Improved Mobility',
                    description: 'Targeted exercises to enhance movement and flexibility.'
                },
                {
                    icon: 'fas fa-weight-hanging',
                    title: 'Strength Building',
                    description: 'Progressive strengthening exercises for muscle development.'
                },
                {
                    icon: 'fas fa-heartbeat',
                    title: 'Pain Relief',
                    description: 'Techniques to reduce pain and improve comfort.'
                },
                {
                    icon: 'fas fa-home',
                    title: 'Home-Based Care',
                    description: 'Convenient therapy sessions in your home environment.'
                }
            ],
            process: [
                {
                    title: 'Physical Assessment',
                    description: 'Comprehensive evaluation of your physical condition and needs.'
                },
                {
                    title: 'Treatment Planning',
                    description: 'Development of a personalized physiotherapy program.'
                },
                {
                    title: 'Therapy Sessions',
                    description: 'Regular one-on-one physiotherapy sessions.'
                },
                {
                    title: 'Progress Evaluation',
                    description: 'Ongoing assessment and program modifications.'
                }
            ],
            features: [
                {
                    icon: 'fas fa-hands',
                    title: 'Manual Therapy',
                    description: 'Hands-on techniques including massage, joint mobilization, and soft tissue work.'
                },
                {
                    icon: 'fas fa-dumbbell',
                    title: 'Exercise Therapy',
                    description: 'Customized exercise programs for strength, flexibility, and endurance.'
                },
                {
                    icon: 'fas fa-balance-scale',
                    title: 'Balance Training',
                    description: 'Specialized exercises to improve balance and prevent falls.'
                }
            ],
            faqs: [
                {
                    question: 'What conditions can physiotherapy help with?',
                    answer: 'We treat musculoskeletal injuries, post-surgical recovery, arthritis, back pain, sports injuries, and various mobility issues.'
                },
                {
                    question: 'How long are therapy sessions?',
                    answer: 'Sessions typically last 45-60 minutes, depending on your treatment plan and specific needs.'
                },
                {
                    question: 'Do you provide exercise equipment?',
                    answer: 'We bring necessary equipment for sessions and can recommend home exercise tools for continued progress.'
                },
                {
                    question: 'How many sessions will I need?',
                    answer: 'The number of sessions varies based on your condition and goals, typically ranging from several weeks to a few months.'
                }
            ],
            reviews: [
                {
                    name: 'Michael Brown',
                    rating: '★★★★★',
                    text: 'The physiotherapy sessions at home were so convenient and effective. I regained my strength much faster than expected.'
                },
                {
                    name: 'Jennifer Wilson',
                    rating: '★★★★★',
                    text: 'Excellent physiotherapy service. The therapist was knowledgeable and helped me recover from my knee surgery completely.'
                },
                {
                    name: 'Carlos Rodriguez',
                    rating: '★★★★★',
                    text: 'Great home physiotherapy service. They helped me with my back pain and taught me exercises to prevent future problems.'
                }
            ]
        }
    };

    // Get service ID from URL parameters
    function getServiceId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('service') || 'medication-management';
    }

    // Load service data
    function loadServiceData() {
        const serviceId = getServiceId();
        const service = serviceData[serviceId];
        
        if (!service) {
            window.location.href = 'index.html#services';
            return;
        }
        
        // Update page content
        const elements = {
            'service-breadcrumb': service.title,
            'service-title': service.title,
            'service-subtitle': service.subtitle,
            'service-description': service.description,
            'service-overview': service.overview
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = elements[id];
        });

        const iconElement = document.getElementById('service-icon');
        if (iconElement && service.icon) {
            iconElement.className = service.icon;
        }

        // Load service image
        loadServiceImage(service);
        
        document.title = `${service.title} - Loyal Home Nursing Care`;
        
        // Load sections
        if (service.benefits) loadBenefits(service.benefits);
        if (service.process) loadProcess(service.process);
        if (service.features) loadFeatures(service.features);
        if (service.faqs) loadFAQs(service.faqs);
        if (service.reviews) loadReviews(service.reviews);
        
        // Set default service in booking form
        const serviceSelect = document.getElementById('service-select');
        if (serviceSelect) {
            serviceSelect.value = serviceId;
        }
    }

    // Load service image
    function loadServiceImage(service) {
        const serviceImage = document.getElementById('service-main-image');
        const placeholder = document.querySelector('.placeholder-content');
        
        if (service.image && serviceImage) {
            serviceImage.src = service.image;
            serviceImage.alt = service.title;
            serviceImage.style.display = 'block';
            if (placeholder) {
                placeholder.style.display = 'none';
            }
            
            // Handle image load error
            serviceImage.onerror = function() {
                this.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'flex';
                }
            };
        } else {
            if (serviceImage) serviceImage.style.display = 'none';
            if (placeholder) {
                placeholder.style.display = 'flex';
            }
        }
    }

    // Load benefits section
    function loadBenefits(benefits) {
        const benefitsGrid = document.getElementById('benefits-grid');
        if (!benefitsGrid) return;
        
        benefitsGrid.innerHTML = '';
        benefits.forEach((benefit, index) => {
            const benefitItem = document.createElement('div');
            benefitItem.className = 'benefit-item';
            benefitItem.innerHTML = `
                <div class="benefit-icon"><i class="${benefit.icon}"></i></div>
                <h4>${benefit.title}</h4>
                <p>${benefit.description}</p>
            `;
            benefitsGrid.appendChild(benefitItem);
        });
    }

    // Load process section
    function loadProcess(process) {
        const processGrid = document.getElementById('process-grid');
        if (!processGrid) return;
        
        processGrid.innerHTML = '';
        process.forEach((step, index) => {
            const processStep = document.createElement('div');
            processStep.className = 'process-step';
            processStep.innerHTML = `
                <div class="process-number">${index + 1}</div>
                <h4>${step.title}</h4>
                <p>${step.description}</p>
            `;
            processGrid.appendChild(processStep);
        });
    }

    // Load features section
    function loadFeatures(features) {
        const featuresGrid = document.getElementById('features-grid');
        if (!featuresGrid) return;
        
        featuresGrid.innerHTML = '';
        features.forEach((feature) => {
            const featureItem = document.createElement('div');
            featureItem.className = 'feature-item';
            featureItem.innerHTML = `
                <div class="feature-header">
                    <div class="feature-icon"><i class="${feature.icon}"></i></div>
                    <h4>${feature.title}</h4>
                </div>
                <p>${feature.description}</p>
            `;
            featuresGrid.appendChild(featureItem);
        });
    }

    // Load FAQs section
    function loadFAQs(faqs) {
        const faqGrid = document.getElementById('faq-grid');
        if (!faqGrid) return;
        
        faqGrid.innerHTML = '';
        faqs.forEach((faq) => {
            const faqItem = document.createElement('div');
            faqItem.className = 'faq-item';
            faqItem.innerHTML = `
                <div class="faq-question">
                    <i class="fas fa-question-circle"></i>
                    ${faq.question}
                </div>
                <div class="faq-answer">${faq.answer}</div>
            `;
            faqGrid.appendChild(faqItem);
        });
    }

    // Load reviews section
    function loadReviews(reviews) {
        const reviewsGrid = document.getElementById('reviews-grid');
        if (!reviewsGrid) return;
        
        reviewsGrid.innerHTML = '';
        reviews.forEach((review) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            const initials = review.name.split(' ').map(n => n[0]).join('');
            reviewItem.innerHTML = `
                <div class="review-header">
                    <div class="review-avatar">${initials}</div>
                    <div class="review-info">
                        <h4>${review.name}</h4>
                        <div class="review-rating">${review.rating}</div>
                    </div>
                </div>
                <p class="review-text">"${review.text}"</p>
            `;
            reviewsGrid.appendChild(reviewItem);
        });
    }

    // Initialize service detail page
    document.addEventListener('DOMContentLoaded', loadServiceData);
}



