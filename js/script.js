document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('.section');
    
    // Function to load content using XMLHttpRequest
    function loadContent(sectionId) {
        console.log('Loading content for section:', sectionId); // Debug log
        
        // Set default path to load
        let contentPath = '';
        
        // Determine which tab to load
        if (sectionId === 'about') {
            contentPath = './tabs/about.html';
        } else if (sectionId === 'services') {
            contentPath = './tabs/services.html';
        } else if (sectionId === 'contact') {
            contentPath = './tabs/contact.html';
        } else if (sectionId === 'home') {
            contentPath = './tabs/home.html';
        }
        
        console.log('Content path:', contentPath); // Debug log
        
        // Only proceed if we have a path
        if (contentPath) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', contentPath, true);
            
            xhr.onload = function() {
                console.log('XHR status:', this.status); // Debug log
                if (this.status === 200) {
                    // Get the section and update its content
                    const section = document.getElementById(sectionId);
                    if (section) {
                        section.innerHTML = this.responseText;
                        console.log('Content loaded successfully for:', sectionId); // Debug log
                    } else {
                        console.error(`Section element not found for ID: ${sectionId}`);
                    }
                } else {
                    console.error(`Failed to load ${contentPath}. Status: ${this.status}`);
                }
            };
            
            xhr.onerror = function() {
                console.error(`Network error when trying to load ${contentPath}`);
            };
            
            xhr.send();
        } else {
            console.error('No content path determined for section:', sectionId);
        }
    }
    
    // Set up navigation click handlers
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Prevent default anchor behavior
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            
            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            document.getElementById(targetId).classList.add('active');
            
            // Load content for the clicked section
            loadContent(targetId);
        });
    });
    
    // Load initial content for the active section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        console.log('Loading initial content for section:', activeSection.id); // Debug log
        loadContent(activeSection.id);
    } else {
        console.error('No active section found on page load');
    }
});