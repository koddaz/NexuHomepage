function loadBannerImage(pageType) {
    const topImageContainer = document.querySelector('.topImage');
    if (!topImageContainer) return;
    
    fetch('./tabs/images.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load banner images');
            }
            return response.json();
        })
        .then(data => {
            // Find the image for the current tab
            const image = data.bannerImages.find(img => img.tab === pageType) || data.defaultImage;
            
            // Apply styles from settings
            topImageContainer.style.height = data.settings.height;
            topImageContainer.style.backgroundImage = `url(${image.url})`;
            topImageContainer.style.backgroundSize = 'cover';
            topImageContainer.style.backgroundPosition = 'center';
            topImageContainer.style.transition = `background-image ${data.settings.transitionDuration} ${data.settings.transitionEffect}`;
            
            // Add overlay if enabled
            if (data.settings.overlay.enabled) {
                topImageContainer.style.position = 'relative';
                // Clear previous overlay
                const existingOverlay = topImageContainer.querySelector('.image-overlay');
                if (existingOverlay) {
                    topImageContainer.removeChild(existingOverlay);
                }
                
                // Create new overlay
                const overlay = document.createElement('div');
                overlay.className = 'image-overlay';
                overlay.style.position = 'absolute';
                overlay.style.top = 0;
                overlay.style.left = 0;
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = data.settings.overlay.color;
                
                topImageContainer.appendChild(overlay);
            }
            
            // Add title if present
            if (image.title) {
                // Clear previous title
                const existingTitle = topImageContainer.querySelector('.banner-title');
                if (existingTitle) {
                    topImageContainer.removeChild(existingTitle);
                }
                
                // Create new title
                const titleElement = document.createElement('h2');
                titleElement.className = 'banner-title';
                titleElement.textContent = image.title;
                titleElement.style.position = 'absolute';
                titleElement.style.bottom = '20px';
                titleElement.style.left = '20px';
                titleElement.style.color = 'white';
                titleElement.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                
                topImageContainer.appendChild(titleElement);
            }
        })
        .catch(error => {
            console.error('Error loading banner image:', error);
            // Set a fallback background
            topImageContainer.style.backgroundColor = '#f5f5f5';
            topImageContainer.style.height = '200px';
        });
}