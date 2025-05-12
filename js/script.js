document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('nav a');
    
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
    
    // Add click event listener to each link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor link behavior
            
            // Get the target section id from the href attribute
            const targetId = this.getAttribute('href').substring(1); // Remove the # character
            console.log('Clicked on navigation link:', targetId); // Debug log
            
            // Hide all sections
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Show the target section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                // Load content for this section
                loadContent(targetId);
            } else {
                console.error(`Target section not found for ID: ${targetId}`);
            }
            
            // Update active class on navigation links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
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

