// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Sound effects elements
    const clickSound = document.getElementById('clickSound');
    const switchSound = document.getElementById('switchSound');
    const successSound = document.getElementById('successSound');
    
    // Function to play sound with volume control
    function playSound(soundElement, volume = 0.3) {
        if (soundElement) {
            soundElement.volume = volume;
            soundElement.currentTime = 0; // Reset sound to start
            soundElement.play().catch(error => {
                console.log("Audio play failed:", error);
            });
        }
    }
    
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or use preferred color scheme
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'dark' || (!savedDarkMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-theme');
        themeIcon.classList.replace('fa-sun', 'fa-moon');
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        playSound(switchSound);
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
            localStorage.setItem('darkMode', 'dark');
        } else {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            localStorage.setItem('darkMode', 'light');
        }
    });
    
    // Color Theme Panel functionality
    const themePanel = document.getElementById('themePanel');
    const themePanelToggle = document.getElementById('themePanelToggle');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Toggle theme panel
    themePanelToggle.addEventListener('click', function() {
        themePanel.classList.toggle('open');
        playSound(clickSound);
    });
    
    // Load saved color theme
    const savedColorTheme = localStorage.getItem('colorTheme');
    if (savedColorTheme) {
        document.body.setAttribute('data-theme', savedColorTheme);
        
        // Update active state in theme panel
        colorOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedColorTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }
    
    // Update blob colors based on selected theme
    function updateBlobColors(theme) {
        const colorMap = {
            'purple': ['#6a3de8', '#ff6b6b', '#00d2d3', '#ff9f43'],
            'blue': ['#3498db', '#56ccf2', '#00d2d3', '#81ecec'],
            'green': ['#2ecc71', '#55efc4', '#3498db', '#74b9ff'],
            'orange': ['#ff9f43', '#ffbf69', '#ff6b6b', '#ffa0a0'],
            'red': ['#e74c3c', '#ff6b6b', '#ff9f43', '#ffbf69'],
            'pink': ['#e84393', '#fd79a8', '#ff6b6b', '#ffa0a0'],
            'teal': ['#00b894', '#00d2d3', '#55efc4', '#81ecec'],
            'yellow': ['#f1c40f', '#ffeaa7', '#ff9f43', '#ffbf69']
        };
        
        const colors = colorMap[theme] || colorMap['purple'];
        const blobs = document.querySelectorAll('.color-blob');
        
        blobs.forEach((blob, index) => {
            if (colors[index]) {
                blob.style.backgroundColor = colors[index];
            }
        });
    }
    
    // Apply blob colors for initial theme
    if (savedColorTheme) {
        updateBlobColors(savedColorTheme);
    }
    
    // Color theme selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update active state
            colorOptions.forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            
            // Apply theme
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('colorTheme', theme);
            
            // Update blob colors
            updateBlobColors(theme);
            
            // Play switch sound when changing theme
            playSound(switchSound);
        });
    });
    
    // Add sound to all buttons
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            playSound(clickSound);
        });
    });
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Only apply smooth scroll for page anchors
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.querySelector('i').classList.remove('fa-times');
                        menuToggle.querySelector('i').classList.add('fa-bars');
                    }
                    
                    // Smooth scroll to the section
                    window.scrollTo({
                        top: targetSection.offsetTop - 80, // Adjust for header height
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    navItems.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Adjust for header and some buffer
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                navItems.forEach(item => item.classList.remove('active'));
                
                // Add active class to corresponding nav item
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // Fixed header on scroll with shadow effect
    const header = document.querySelector('header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        
        if (scrollTop > 50) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
            header.classList.add('scrolled');
            
            // Push elements to the right side when scrolling
            const navLinks = document.querySelector('.nav-links');
            const logo = document.querySelector('.logo');
            
            // Add sliding effect to navigation elements
            if (navLinks) {
                navLinks.style.transform = 'translateX(20px)';
                navLinks.style.transition = 'transform 0.3s ease-out';
                
                // Add margin to space out navigation items
                const navItems = navLinks.querySelectorAll('li');
                navItems.forEach(item => {
                    item.style.marginRight = '25px';
                    item.style.transition = 'margin-right 0.3s ease-out';
                });
            }
            
            // Move logo slightly to the right
            if (logo) {
                logo.style.transform = 'translateX(15px)';
                logo.style.transition = 'transform 0.3s ease-out';
            }
        } else {
            header.style.boxShadow = 'none';
            header.classList.remove('scrolled');
            
            // Reset positions when scrolling back to top
            const navLinks = document.querySelector('.nav-links');
            const logo = document.querySelector('.logo');
            
            if (navLinks) {
                navLinks.style.transform = 'translateX(0)';
                
                const navItems = navLinks.querySelectorAll('li');
                navItems.forEach(item => {
                    item.style.marginRight = '20px';
                });
            }
            
            if (logo) {
                logo.style.transform = 'translateX(0)';
            }
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;
            
            // Reset previous validation styles
            [name, email, message].forEach(field => {
                field.style.borderColor = 'var(--border-color)';
                const errorMessage = field.parentElement.querySelector('.error-message');
                if (errorMessage) {
                    errorMessage.remove();
                }
            });
            
            // Check required fields
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else {
                // Simple email validation
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(email.value)) {
                    showError(email, 'Please enter a valid email');
                    isValid = false;
                }
            }
            
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            }
            
            if (isValid) {
                // In a real implementation, you would send the form data to your server
                // For demo purposes, we'll just show a success message
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank You!</h3>
                        <p>Your message has been sent successfully. We'll get back to you soon.</p>
                        <div class="confetti-container"></div>
                    </div>
                `;
                
                // Play success sound
                playSound(successSound, 0.4);
                
                // Add confetti animation for successful submission
                createConfetti();
            }
        });
        
        // Function to show error messages
        function showError(field, message) {
            field.style.borderColor = 'var(--secondary-color)';
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            errorDiv.style.color = 'var(--secondary-color)';
            errorDiv.style.fontSize = '0.85rem';
            errorDiv.style.marginTop = '5px';
            field.parentElement.appendChild(errorDiv);
        }
        
        // Function to create confetti animation
        function createConfetti() {
            const confettiContainer = document.querySelector('.confetti-container');
            const colors = ['#6a3de8', '#ff6b6b', '#00d2d3', '#ff9f43', '#1dd1a1'];
            
            for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
                confetti.style.animationDelay = Math.random() * 5 + 's';
                confettiContainer.appendChild(confetti);
            }
        }
    }
    
    // Add animation effects when elements come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .about-image, .testimonial-card');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    // Add colorful animations to feature icons
    const featureIcons = document.querySelectorAll('.feature-card .icon');
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        icon.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
            // Reset the animation after a short delay
            setTimeout(() => {
                this.style.animation = 'none';
                setTimeout(() => {
                    this.style.animation = '';
                }, 10);
            }, 300);
        });
    });
    
    // Initially check for elements in view
    animateOnScroll();
    
    // Check for elements on scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Close theme panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!themePanel.contains(event.target) && 
            event.target !== themePanelToggle && 
            !themePanelToggle.contains(event.target) && 
            themePanel.classList.contains('open')) {
            themePanel.classList.remove('open');
        }
    });

    // Add sound to navigation links
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            playSound(clickSound);
        });
    });

    // Create mute button
    const muteButton = document.createElement('button');
    muteButton.className = 'sound-toggle';
    muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
    muteButton.setAttribute('aria-label', 'Toggle sound');
    document.body.appendChild(muteButton);

    // Check for saved sound preference
    let soundEnabled = localStorage.getItem('soundEnabled') !== 'false'; // Default to true
    
    // Update button icon based on current state
    if (!soundEnabled) {
        muteButton.querySelector('i').classList.replace('fa-volume-up', 'fa-volume-mute');
    }
    
    // Override play sound function when muted
    const originalPlaySound = playSound;
    
    // Redefine play sound to check if sound is enabled
    window.playSound = function(soundElement, volume = 0.3) {
        if (soundEnabled) {
            originalPlaySound(soundElement, volume);
        }
    };
    
    // Toggle sound when clicking the mute button
    muteButton.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        
        const icon = this.querySelector('i');
        if (soundEnabled) {
            icon.classList.replace('fa-volume-mute', 'fa-volume-up');
            playSound(switchSound);
        } else {
            icon.classList.replace('fa-volume-up', 'fa-volume-mute');
            // Play one last sound before muting
            originalPlaySound(switchSound);
        }
    });

    // Visitor Tracking and Analytics Module
    const visitorPanel = document.getElementById('visitorPanel');
    const visitorPanelToggle = document.getElementById('visitorPanelToggle');
    const pageViewsElement = document.getElementById('pageViews');
    const timeOnPageElement = document.getElementById('timeOnPage');
    const clickCountElement = document.getElementById('clickCount');
    const browserInfoElement = document.getElementById('browserInfo');
    const osInfoElement = document.getElementById('osInfo');
    const screenInfoElement = document.getElementById('screenInfo');
    const ipInfoElement = document.getElementById('ipInfo');
    const locationInfoElement = document.getElementById('locationInfo');
    const referrerInfoElement = document.getElementById('referrerInfo');
    const analyticConsentCheckbox = document.getElementById('analyticConsent');
    const locationConsentCheckbox = document.getElementById('locationConsent');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    // Check if visitor panel elements exist
    if (!visitorPanel || !visitorPanelToggle) {
        console.error("Visitor analytics panel elements not found");
        return; // Prevent errors if elements don't exist
    }
    
    // Tracking variables
    let pageViews = parseInt(localStorage.getItem('pageViews')) || 0;
    let clickCount = parseInt(localStorage.getItem('clickCount')) || 0;
    let startTime = new Date();
    let timeOnPageInterval;
    let dataCollectionEnabled = localStorage.getItem('analyticConsent') !== 'false';
    let locationCollectionEnabled = localStorage.getItem('locationConsent') !== 'false';
    
    // Initialize consent checkboxes if they exist
    if (analyticConsentCheckbox) analyticConsentCheckbox.checked = dataCollectionEnabled;
    if (locationConsentCheckbox) locationConsentCheckbox.checked = locationCollectionEnabled;
    
    // Toggle visitor panel
    visitorPanelToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent event bubbling
        visitorPanel.classList.toggle('open');
        playSound(clickSound);
        
        // Update data when panel is opened
        if (visitorPanel.classList.contains('open')) {
            updateVisitorInfo();
        }
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(event) {
        if (!visitorPanel.contains(event.target) && 
            event.target !== visitorPanelToggle && 
            !visitorPanelToggle.contains(event.target) && 
            visitorPanel.classList.contains('open')) {
            visitorPanel.classList.remove('open');
        }
    });
    
    // Update page views
    function updatePageViews() {
        if (dataCollectionEnabled && pageViewsElement) {
            pageViews++;
            localStorage.setItem('pageViews', pageViews);
            pageViewsElement.textContent = pageViews;
        }
    }
    
    // Track click count
    function trackClicks() {
        if (dataCollectionEnabled && clickCountElement) {
            document.addEventListener('click', function() {
                clickCount++;
                localStorage.setItem('clickCount', clickCount);
                clickCountElement.textContent = clickCount;
            });
        }
    }
    
    // Update time on page
    function updateTimeOnPage() {
        if (dataCollectionEnabled && timeOnPageElement) {
            clearInterval(timeOnPageInterval); // Clear any existing interval
            timeOnPageInterval = setInterval(function() {
                const now = new Date();
                const timeSpent = Math.floor((now - startTime) / 1000);
                
                let timeDisplay;
                if (timeSpent < 60) {
                    timeDisplay = timeSpent + 's';
                } else if (timeSpent < 3600) {
                    timeDisplay = Math.floor(timeSpent / 60) + 'm ' + (timeSpent % 60) + 's';
                } else {
                    timeDisplay = Math.floor(timeSpent / 3600) + 'h ' + 
                                 Math.floor((timeSpent % 3600) / 60) + 'm';
                }
                
                timeOnPageElement.textContent = timeDisplay;
            }, 1000);
        }
    }
    
    // Get browser information
    function getBrowserInfo() {
        const userAgent = navigator.userAgent;
        let browserName;
        
        if (userAgent.match(/chrome|chromium|crios/i)) {
            browserName = "Chrome";
        } else if (userAgent.match(/firefox|fxios/i)) {
            browserName = "Firefox";
        } else if (userAgent.match(/safari/i)) {
            browserName = "Safari";
        } else if (userAgent.match(/opr\//i)) {
            browserName = "Opera";
        } else if (userAgent.match(/edg/i)) {
            browserName = "Edge";
        } else {
            browserName = "Unknown";
        }
        
        const browserVersion = userAgent.split(browserName)[1]?.split(' ')[0] || '';
        return browserName + (browserVersion ? ' ' + browserVersion : '');
    }
    
    // Get OS information
    function getOSInfo() {
        const userAgent = navigator.userAgent;
        let osName;
        
        if (userAgent.match(/windows nt/i)) {
            osName = "Windows";
        } else if (userAgent.match(/macintosh|mac os x/i)) {
            osName = "macOS";
        } else if (userAgent.match(/linux/i)) {
            osName = "Linux";
        } else if (userAgent.match(/android/i)) {
            osName = "Android";
        } else if (userAgent.match(/iphone|ipad|ipod/i)) {
            osName = "iOS";
        } else {
            osName = "Unknown";
        }
        
        return osName;
    }
    
    // Get screen information
    function getScreenInfo() {
        return `${window.screen.width}x${window.screen.height}`;
    }
    
    // Get referrer information
    function getReferrerInfo() {
        return document.referrer || 'Direct';
    }
    
    // Fetch IP and location info
    function fetchIPInfo() {
        if (!ipInfoElement || !locationInfoElement) return;
        
        if (locationCollectionEnabled) {
            // Set loading state
            ipInfoElement.textContent = 'Loading...';
            locationInfoElement.textContent = 'Loading...';
            
            fetch('https://ipapi.co/json/')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    ipInfoElement.textContent = data.ip || 'Not available';
                    locationInfoElement.textContent = data.city && data.country_name 
                        ? `${data.city}, ${data.country_name}` 
                        : 'Not available';
                })
                .catch(error => {
                    console.error('Error fetching IP info:', error);
                    ipInfoElement.textContent = 'Failed to fetch';
                    locationInfoElement.textContent = 'Failed to fetch';
                });
        } else {
            ipInfoElement.textContent = 'Collection disabled';
            locationInfoElement.textContent = 'Collection disabled';
        }
    }
    
    // Update visitor information
    function updateVisitorInfo() {
        if (!browserInfoElement || !osInfoElement || !screenInfoElement || !referrerInfoElement) {
            console.error("One or more visitor info elements not found");
            return;
        }
        
        if (dataCollectionEnabled) {
            browserInfoElement.textContent = getBrowserInfo();
            osInfoElement.textContent = getOSInfo();
            screenInfoElement.textContent = getScreenInfo();
            referrerInfoElement.textContent = getReferrerInfo();
            fetchIPInfo();
        } else {
            browserInfoElement.textContent = 'Collection disabled';
            osInfoElement.textContent = 'Collection disabled';
            screenInfoElement.textContent = 'Collection disabled';
            referrerInfoElement.textContent = 'Collection disabled';
            if (ipInfoElement) ipInfoElement.textContent = 'Collection disabled';
            if (locationInfoElement) locationInfoElement.textContent = 'Collection disabled';
        }
    }
    
    // Handle the analytic consent change
    if (analyticConsentCheckbox) {
        analyticConsentCheckbox.addEventListener('change', function() {
            dataCollectionEnabled = this.checked;
            localStorage.setItem('analyticConsent', this.checked);
            
            if (dataCollectionEnabled) {
                updateVisitorInfo();
                updatePageViews();
                trackClicks();
                updateTimeOnPage();
            } else {
                clearInterval(timeOnPageInterval);
                if (browserInfoElement) browserInfoElement.textContent = 'Collection disabled';
                if (osInfoElement) osInfoElement.textContent = 'Collection disabled';
                if (screenInfoElement) screenInfoElement.textContent = 'Collection disabled';
                if (referrerInfoElement) referrerInfoElement.textContent = 'Collection disabled';
            }
        });
    }
    
    // Handle the location consent change
    if (locationConsentCheckbox) {
        locationConsentCheckbox.addEventListener('change', function() {
            locationCollectionEnabled = this.checked;
            localStorage.setItem('locationConsent', this.checked);
            
            if (locationCollectionEnabled) {
                fetchIPInfo();
            } else {
                if (ipInfoElement) ipInfoElement.textContent = 'Collection disabled';
                if (locationInfoElement) locationInfoElement.textContent = 'Collection disabled';
            }
        });
    }
    
    // Clear visitor data
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', function() {
            localStorage.removeItem('pageViews');
            localStorage.removeItem('clickCount');
            localStorage.removeItem('sessionEvents');
            
            pageViews = 0;
            clickCount = 0;
            startTime = new Date();
            sessionEvents = [];
            
            if (pageViewsElement) pageViewsElement.textContent = '0';
            if (clickCountElement) clickCountElement.textContent = '0';
            if (timeOnPageElement) timeOnPageElement.textContent = '0s';
            
            playSound(switchSound);
        });
    }
    
    // Initialize tracking
    if (dataCollectionEnabled) {
        updatePageViews();
        trackClicks();
        updateTimeOnPage();
        updateVisitorInfo();
    }

    // Session recording to track user interactions
    let sessionEvents = [];
    let isRecording = localStorage.getItem('sessionRecording') !== 'false';
    let recordingStartTime = new Date();
    
    // Add session recording checkbox
    const recordingConsentDiv = document.createElement('div');
    recordingConsentDiv.className = 'consent-option';
    recordingConsentDiv.innerHTML = `
        <input type="checkbox" id="recordingConsent" ${isRecording ? 'checked' : ''}>
        <label for="recordingConsent">Allow session recording</label>
    `;
    document.querySelector('.consent-settings').insertBefore(
        recordingConsentDiv, 
        document.getElementById('clearDataBtn')
    );
    
    const recordingConsentCheckbox = document.getElementById('recordingConsent');
    
    // Track mouse movements (throttled)
    let lastMouseMoveTime = 0;
    document.addEventListener('mousemove', function(e) {
        if (!isRecording) return;
        
        const now = Date.now();
        if (now - lastMouseMoveTime > 100) { // Record every 100ms to prevent too many events
            lastMouseMoveTime = now;
            recordEvent('mousemove', {
                x: e.clientX,
                y: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY
            });
        }
    });
    
    // Track clicks
    document.addEventListener('click', function(e) {
        if (!isRecording) return;
        
        recordEvent('click', {
            x: e.clientX,
            y: e.clientY,
            target: e.target.tagName,
            id: e.target.id,
            class: e.target.className
        });
    });
    
    // Track scrolling (throttled)
    let lastScrollTime = 0;
    window.addEventListener('scroll', function() {
        if (!isRecording) return;
        
        const now = Date.now();
        if (now - lastScrollTime > 200) { // Record every 200ms to prevent too many events
            lastScrollTime = now;
            recordEvent('scroll', {
                scrollX: window.scrollX,
                scrollY: window.scrollY
            });
        }
    });
    
    // Track form interactions
    document.addEventListener('input', function(e) {
        if (!isRecording) return;
        
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
            recordEvent('input', {
                target: e.target.tagName,
                id: e.target.id,
                type: e.target.type,
                // Don't record actual values for privacy reasons
                valueLength: e.target.value ? e.target.value.length : 0
            });
        }
    });
    
    // Record an event
    function recordEvent(type, data) {
        if (!isRecording) return;
        
        const now = new Date();
        const timeElapsed = now - recordingStartTime;
        
        sessionEvents.push({
            timestamp: timeElapsed,
            type: type,
            data: data
        });
        
        // Save to localStorage periodically (every 20 events)
        if (sessionEvents.length % 20 === 0) {
            saveSessionEvents();
        }
    }
    
    // Save session events to localStorage
    function saveSessionEvents() {
        if (sessionEvents.length === 0) return;
        
        try {
            localStorage.setItem('sessionEvents', JSON.stringify(sessionEvents));
        } catch (e) {
            // If localStorage is full, keep only the last 100 events
            if (e.name === 'QuotaExceededError') {
                sessionEvents = sessionEvents.slice(-100);
                localStorage.setItem('sessionEvents', JSON.stringify(sessionEvents));
            }
        }
    }
    
    // Load previous session events
    function loadSessionEvents() {
        const savedEvents = localStorage.getItem('sessionEvents');
        if (savedEvents) {
            try {
                sessionEvents = JSON.parse(savedEvents);
            } catch (e) {
                sessionEvents = [];
            }
        }
    }
    
    // Toggle session recording
    recordingConsentCheckbox.addEventListener('change', function() {
        isRecording = this.checked;
        localStorage.setItem('sessionRecording', isRecording);
        
        if (isRecording) {
            recordingStartTime = new Date();
            recordEvent('recording_started', {});
        } else {
            recordEvent('recording_stopped', {});
            saveSessionEvents();
        }
    });
    
    // Add view recordings button
    const viewRecordingsBtn = document.createElement('button');
    viewRecordingsBtn.className = 'btn btn-small';
    viewRecordingsBtn.style.marginTop = '10px';
    viewRecordingsBtn.textContent = 'View Session Data';
    viewRecordingsBtn.addEventListener('click', function() {
        const eventsString = JSON.stringify(sessionEvents, null, 2);
        
        // Create modal to show session data
        const modal = document.createElement('div');
        modal.className = 'session-modal';
        modal.innerHTML = `
            <div class="session-modal-content">
                <span class="close-modal">&times;</span>
                <h3>Session Recording Data</h3>
                <div class="session-data">
                    <pre>${eventsString}</pre>
                </div>
                <button class="btn btn-small download-session">Download Data</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .session-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1001;
            }
            .session-modal-content {
                background: var(--card-bg-color);
                padding: 20px;
                border-radius: var(--border-radius);
                max-width: 800px;
                width: 90%;
                max-height: 80vh;
                position: relative;
            }
            .close-modal {
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 20px;
                cursor: pointer;
                color: var(--text-color);
            }
            .session-data {
                max-height: 60vh;
                overflow-y: auto;
                margin: 15px 0;
                background: var(--background-color);
                padding: 10px;
                border-radius: var(--border-radius);
            }
            .session-data pre {
                white-space: pre-wrap;
                color: var(--text-color);
                font-size: 0.8rem;
                font-family: monospace;
            }
        `;
        document.head.appendChild(modalStyle);
        
        // Close modal
        document.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        // Download session data
        document.querySelector('.download-session').addEventListener('click', function() {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(eventsString);
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "session-data.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
        });
    });
    document.querySelector('.consent-settings').appendChild(viewRecordingsBtn);
    
    // Initialize session recording
    if (isRecording) {
        loadSessionEvents();
        recordEvent('page_load', {
            title: document.title,
            url: window.location.href
        });
    }
    
    // Save events before page unload
    window.addEventListener('beforeunload', function() {
        if (isRecording) {
            recordEvent('page_unload', {});
            saveSessionEvents();
        }
    });

    // Ensure the visitor panel toggle is visible and styled correctly
    if (visitorPanelToggle) {
        visitorPanelToggle.style.display = 'flex';
        visitorPanelToggle.style.zIndex = '999';
    }
    
    // Call initial update
    updateVisitorInfo();
});

// Add CSS for the animations
document.head.insertAdjacentHTML('beforeend', `
<style>
    /* Element animations */
    .feature-card, .about-image, .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .feature-card.animated, .about-image.animated, .testimonial-card.animated {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Stagger the animations for feature cards */
    .feature-card:nth-child(1) {
        transition-delay: 0.1s;
    }
    
    .feature-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(3) {
        transition-delay: 0.3s;
    }
    
    .feature-card:nth-child(4) {
        transition-delay: 0.4s;
    }
    
    /* Icon animation */
    .feature-card .icon.pulse {
        animation: pulse 0.5s ease-in-out;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    /* Success message */
    .success-message {
        text-align: center;
        padding: 30px 0;
        position: relative;
        overflow: hidden;
    }
    
    /* Confetti styles */
    .confetti-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
    }
    
    .confetti {
        position: absolute;
        width: 10px;
        height: 10px;
        opacity: 0;
        transform: translateY(0);
        animation: confetti-fall linear forwards;
    }
    
    @keyframes confetti-fall {
        0% {
            opacity: 1;
            transform: translateY(-100px) rotate(0deg);
        }
        100% {
            opacity: 0;
            transform: translateY(300px) rotate(360deg);
        }
    }
</style>
`);