document.addEventListener('DOMContentLoaded', function () {
     console.log('DOM loaded');

     // Get references to elements
     const menuToggle = document.querySelector('.menuToggle');
     const navigationWrapper = document.querySelector('.navigationWrapper');
     const mainContent = document.querySelector('.mainContent');
     const header = document.querySelector('header');

     console.log('Menu toggle element:', menuToggle);
     console.log('Navigation wrapper element:', navigationWrapper);

     // Set main content top margin to match header height
     if (mainContent && header) {
          const headerHeight = header.offsetHeight;
          mainContent.style.marginTop = headerHeight + 'px';
          console.log('Setting main content margin-top to:', headerHeight + 'px');
     }

     // Initialize menu toggle button
     if (menuToggle) {
          console.log('Adding click event to menu toggle');
          
          // Force display to ensure it's always visible
          menuToggle.style.display = 'flex';
          
          // Set initial icon state
          menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
          
          menuToggle.addEventListener('click', function () {
               // Toggle the navigation wrapper visibility
               navigationWrapper.classList.toggle('active');
               console.log('Menu toggled, active:', navigationWrapper.classList.contains('active'));

               // Change icon based on menu state
               this.innerHTML = navigationWrapper.classList.contains('active')
                    ? '<i class="fas fa-times"></i>'
                    : '<i class="fas fa-bars"></i>';
          });
     } else {
          console.error('Menu toggle button not found');
     }

     // Close mobile menu when a link is clicked
     document.querySelectorAll('nav ul li a').forEach(link => {
          link.addEventListener('click', function () {
               navigationWrapper.classList.remove('active');
               if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
               }
          });
     });

     // Handle window resize to adjust content margin and reset menu
     window.addEventListener('resize', function() {
          if (mainContent && header) {
               const headerHeight = header.offsetHeight;
               mainContent.style.marginTop = headerHeight + 'px';
          }
          
          // Close menu on window resize
          if (navigationWrapper && navigationWrapper.classList.contains('active')) {
               navigationWrapper.classList.remove('active');
               if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
               }
          }
     });

     // Set active link based on current URL hash
     updateActiveLink(location.hash || '#home');

     // Load content based on current hash or default to home
     loadContent(location.hash || '#home');
});


window.addEventListener('hashchange', function () {
     loadContent(location.hash || '#home');
});
// Handle browser back/forward navigation
window.addEventListener('popstate', function (event) {
     if (event.state && event.state.page) {
          loadContent(event.state.page);
     }
});


function loadContent(page) {
     const mainElement = document.querySelector('main');
     mainElement.innerHTML = '<p>Loading...</p>';

     if (page.startsWith('#')) {
          // If it's a hash, convert to page type
          const pageType = hashToPage(page);
          if (pageType) {
               // Process the page based on its type
               handlePageContent(pageType, mainElement);
          } else {
               // Invalid hash, fallback to home
               handlePageContent('home', mainElement);
          }
     } else {
          // If we somehow got a direct page name, handle it
          handlePageContent(page, mainElement);
     }
}


// FOR NAVIGATION !!!
function handlePageContent(pageType, container) {
     // Update URL hash if needed
     if (location.hash !== `#${pageType}`) {
          history.replaceState(null, '', `#${pageType}`);
     }
     // Update active link in navigation
     updateActiveLink(`#${pageType}`);
     
     if(typeof loadBannerImage === 'function') {
     loadBannerImage(pageType);
     }

     // Load content based on page type
     switch (pageType) {
          case 'home':
               loadSplitContent(container, 'home', 'contact');
              // loadHome(container);
               break;
          case 'about':
               loadAbout(container);
               break;
          case 'portfolio':
               loadPortfolio(container);
               break;
          case 'contact':
               loadProfiles(container);
               break;
          case 'product':
               loadProduct(container);
               break;
          default:
               container.innerHTML = '<p>Page not found</p>';
     }
}

// FOR SPLIT CONTENT VIEW!!!

function loadColumnContent(column, contentType) {
    if (!column) return;
    
    switch(contentType) {
        case 'home':
            loadHome(column);
            break;
        case 'about':
            loadAbout(column);
            break;
        case 'contact':
            loadProfiles(column);
            break;
        case 'portfolio':
            loadPortfolio(column);
            break;
        case 'product':
            loadProduct(column);
            break;
        default:
            column.innerHTML = '<p>Unknown content type</p>';
    }
}

function hashToPage(hash) {
     // Remove the # character
     const page = hash.substring(1);

     // Create an array of valid pages
     const validPages = ['home', 'about', 'portfolio', 'contact', 'product'];

     // Check if the page is valid, otherwise return null
     return validPages.includes(page) ? page : null;
}

function updateActiveLink(page) {
     document.querySelectorAll('nav ul li a').forEach(link => {
          link.classList.remove('active');
     });

     // Find the correct link - either by href or by corresponding hash
     let currentLink = document.querySelector(`nav ul li a[href="${page}"]`);
     if (!currentLink) {
          const hash = '#' + page.split('/').pop().replace('.html', '');
          currentLink = document.querySelector(`nav ul li a[href="${hash}"]`);
     }

     if (currentLink !== null) {
          currentLink.classList.add('active');
     }
}


function navButton(url, text) {
     const button = document.createElement('a');
     button.className = 'navButton';
     button.href = url;
     button.innerHTML = `<button class="btn btn-outline">${text}</button>`;
     return button;
}

function loadAbout(container) {
     if (!container) return;
     container.innerHTML = '';
     fetch('./tabs/about/about.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load about information')
               }
               return response.json();
          })
          .then(aboutData => {

               // Create the title container
               const titleContainer = document.createElement('div');
               titleContainer.className = 'titleContainer';
               titleContainer.innerHTML = `<h1 class="${aboutData.titleClass}">${aboutData.title}</h1>`;
               container.appendChild(titleContainer)

               // Create the text sections
               aboutData.sections.forEach(section => {
                    const textContainer = document.createElement('div');
                    textContainer.className = 'textContainer';

                    const formattedText = section.text.replace(
                         aboutData.companyName,
                         `<span class="text-bold">${aboutData.companyName}</span>`
                    )
                    textContainer.innerHTML = `<p class="${section.textClass}">${formattedText}</p>`
                    container.appendChild(textContainer)
               })
          })

}

function loadProfiles(container) {
     if (!container) return;
     container.innerHTML = '';
     fetch('./tabs/contact/contact.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load contact information')
               }
               return response.json();
          })
          .then(contactData => {
               
               // Create profiles container
               const profilesContainer = document.createElement('div');
               profilesContainer.id = contactData.profilesContainer.id;
               profilesContainer.className = contactData.profilesContainer.class;
               container.appendChild(profilesContainer);

               // Call the profileContainer function with the correct name
               profileContainer(profilesContainer);
          })
          .catch(error => {
               console.error('Error loading contact page:', error);
               container.innerHTML = '<p>Error loading contact information. Please try again later.</p>';
          });
}

function loadHome(container) {
     if (!container) return;
     container.innerHTML = '<p>Attempting to load home content...</p>';

     console.log('Loading home content, fetching from:', './tabs/home/home.json');

     fetch('./tabs/home/home.json')
          .then(response => {
               console.log('Home fetch response:', response.status, response.ok);
               if (!response.ok) {
                    throw new Error(`Failed to load home information (status: ${response.status})`);
               }
               return response.json();
          })
          .then(homeData => {
               console.log('Home data loaded successfully:', homeData);
               container.innerHTML = ''; // Clear loading message


               // Create text sections with proper checks for missing data
               if (homeData.sections && Array.isArray(homeData.sections)) {
                    homeData.sections.forEach(section => {
                         // Skip invalid sections
                         if (!section || !section.text) return;

                         const textContainer = document.createElement('div');
                         textContainer.className = 'textContainer';

                         // Handle the company name replacement and formatting
                         let formattedText = section.text;
                         if (homeData.companyName && formattedText.includes(homeData.companyName)) {
                              formattedText = formattedText.replace(
                                   homeData.companyName,
                                   `<span class="text-bold">${homeData.companyName}</span>`
                              );
                         }

                         // If the section is marked as bold, wrap it in a span
                         if (section.isBold) {
                              formattedText = `<span class="text-bold">${formattedText}</span>`;
                         }

                         textContainer.innerHTML =
                              `<p class="${section.textClass}">${formattedText}</p>`;
                         container.appendChild(textContainer);
                    });
               }
               if (homeData.buttonInfo) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'buttonContainer';

                    const button = navButton(
                         homeData.buttonInfo.url || '#about',
                         homeData.buttonInfo.text || 'Read More'
                    );

                    buttonContainer.appendChild(button);
                    container.appendChild(buttonContainer);
               }
          })
          .catch(error => {
               console.error('Error loading home page:', error);
               container.innerHTML = `<p>Error loading home information: ${error.message}</p>`;
          });
}

function profileContainer(container) {
     if (!container) return;

     // Fix the path to the profiles.json file
     fetch('./tabs/contact/profiles.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load profile information')
               }
               return response.json();
          })
          .then(profiles => {
               // Loop through each profile and create profile cards
               profiles.forEach(profile => {
                    // Create profile card with the correct CSS class name
                    const profileCard = document.createElement('div');
                    profileCard.className = 'profileContainer';  // Changed from 'profileCard' to match CSS

                    // Create profile HTML with the correct CSS class names
                    profileCard.innerHTML = `
                    <div class="profileImageContainer">  <!-- Changed from 'profileImage' to match CSS -->
                         <img src="${profile.image}" alt="${profile.name}">
                    </div>
                    <div class="profileContent">  <!-- Changed from 'profileInfo' to match CSS -->
                         <h3 class="text-subtitle">${profile.name}</h3>
                         <h4 class="text-caption">${profile.title}</h4>
                         <p class="text-body-small">${profile.bio}</p>
                         <div class="skills">
                              ${profile.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
                         </div>
                    </div>
               `;

                    container.appendChild(profileCard);
               });
          })
          .catch(error => {
               console.error('Error loading profiles:', error);
               container.innerHTML = '<p>Error loading team profiles. Please try again later.</p>';
          });
}

function loadPortfolio(container) {
     if (!container) return;
     container.innerHTML = '';

     fetch('./tabs/portfolio/portfolio.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load portfolio information');
               }
               return response.json();
          })
          .then(portfolioData => {
               // Create the title container
               const titleContainer = document.createElement('div');
               titleContainer.className = 'titleContainer';
               titleContainer.innerHTML = `<h1 class="${portfolioData.titleClass}">${portfolioData.title}</h1>`;
               container.appendChild(titleContainer);

               // Create text sections with formatted text
               portfolioData.sections.forEach(section => {
                    const textContainer = document.createElement('div');
                    textContainer.className = 'textContainer';

                    // Format text - bold company name and product name
                    let formattedText = section.text;

                    if (portfolioData.companyName) {
                         formattedText = formattedText.replace(
                              portfolioData.companyName,
                              `<span class="text-bold">${portfolioData.companyName}</span>`
                         );
                    }

                    if (portfolioData.productName) {
                         formattedText = formattedText.replace(
                              portfolioData.productName,
                              `<span class="text-bold">${portfolioData.productName}</span>`
                         );
                    }

                    textContainer.innerHTML = `<p class="${section.textClass}">${formattedText}</p>`;
                    container.appendChild(textContainer);
               });

               // Create projects container
               const projectsContainer = document.createElement('div');
               projectsContainer.id = portfolioData.projectsContainer.id;
               projectsContainer.className = portfolioData.projectsContainer.class;
               container.appendChild(projectsContainer);

               // Load projects
               loadProjects(projectsContainer);
          })
          .catch(error => {
               console.error('Error loading portfolio:', error);
               container.innerHTML = '<p>Error loading portfolio information. Please try again later.</p>';
          });
}

function loadProjects(container) {
     if (!container) return;

     fetch('./tabs/portfolio/projects.json')
          .then(response => {
               if (!response.ok) {
                    throw new Error('Failed to load projects information');
               }
               return response.json();
          })
          .then(projects => {
               projects.forEach(project => {
                    // Use presentationContainer instead of projectContainer to match CSS
                    const projectCard = document.createElement('div');
                    projectCard.className = 'presentationContainer';

                    // Create link wrapper if project has a link
                    const wrapInLink = project.link ?
                         (content) => `<a href="${project.link}" class="projectLink">${content}</a>` :
                         (content) => content;

                    // Determine tags HTML
                    const tagsHTML = project.tags ?
                         `<div class="tags">${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` :
                         '';

                    // Build project HTML with classes that match tabLayout.css
                    const projectHTML = `
                         <div class="imageContainer">
                              <img src="${project.image}" alt="${project.title}">
                         </div>
                         <div class="projectContent">
                              <h3 class="text-subtitle">${project.title}</h3>
                              <p class="text-body-small">${project.description}</p>
                              ${tagsHTML}
                              ${project.link ? `<a href="${project.link}" class="projectLink">View Details</a>` : ''}
                         </div>
                    `;

                    // Don't use wrapInLink anymore since we're including the link in the content
                    projectCard.innerHTML = projectHTML;
                    container.appendChild(projectCard);
               });
          })
          .catch(error => {
               console.error('Error loading projects:', error);
               container.innerHTML = '<p>Error loading projects. Please try again later.</p>';
          });
}

function loadProduct(container) {
     if (!container) return;
     container.innerHTML = '';

     // Create a placeholder for product page
     const titleContainer = document.createElement('div');
     titleContainer.className = 'titleContainer';
     titleContainer.innerHTML = '<h1 class="text-title-small">Our Products</h1>';
     container.appendChild(titleContainer);

     const textContainer = document.createElement('div');
     textContainer.className = 'textContainer';
     textContainer.innerHTML = '<p class="text-body-medium">Product information coming soon. Stay tuned for our upcoming digital solutions!</p>';
     container.appendChild(textContainer);
}



function loadSplitContent(container, leftContent, rightContent) {
    if (!container) return;
     // Clear the container and show loading message
    container.innerHTML = '<p>Loading split content...</p>';
    if(container) {
        container.innerHTML = ''; // Clear loading message
    
    // Create the main row for two columns
    const mainRow = document.createElement('div');
    mainRow.className = 'mainRow';
    
    // Create left column
    const leftColumn = document.createElement('div');
    leftColumn.className = 'column-left';
    leftColumn.innerHTML = '<p>Loading left column...</p>';
    
    // Create right column
    const rightColumn = document.createElement('div');
    rightColumn.className = 'column-right';
    rightColumn.innerHTML = '<p>Loading right column...</p>';
    
    // Add columns to the row
    mainRow.appendChild(leftColumn);
    mainRow.appendChild(rightColumn);
    
    // Add row to the container
    container.appendChild(mainRow);
    
    // Load content into each column based on parameters
    loadColumnContent(leftColumn, leftContent);
    loadColumnContent(rightColumn, rightContent);
}
}
