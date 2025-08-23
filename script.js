// Enhanced JavaScript with fixed functionality

// Main Tab Functions (Home/Feedback)
function showMainTab(tabName) {
  // Hide all main content sections
  const contents = document.querySelectorAll('.content');
  contents.forEach(content => content.classList.remove('active'));
  
  // Remove active from all main tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(button => button.classList.remove('active'));
  
  // Show selected content
  document.getElementById(tabName).classList.add('active');
  
  // Set active tab button
  const activeButton = document.querySelector(`.tab-btn[onclick="showMainTab('${tabName}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Internal Tab Functions (Home/Guides/Troubleshoot/FAQ)
function showTabContent(tabNumber) {
  // Hide all internal tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Remove active from all internal tab buttons
  const tabButtons = document.querySelectorAll('.tabs button');
  tabButtons.forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  
  // Show selected tab
  const selectedTab = document.getElementById(`tab${tabNumber}`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
  
  // Set active tab button
  const activeButton = document.querySelector(`.tabs button:nth-child(${tabNumber})`);
  if (activeButton) {
    activeButton.classList.add('active');
    activeButton.setAttribute('aria-selected', 'true');
  }
}

// Feedback Sub-tab Functions
function showSubtab(subtabName) {
  // Hide all sub-content
  const subcontents = document.querySelectorAll('.subcontent');
  subcontents.forEach(content => content.classList.remove('active'));
  
  // Remove active from all subtab buttons
  const subtabButtons = document.querySelectorAll('.subtab-btn');
  subtabButtons.forEach(button => button.classList.remove('active'));
  
  // Show selected subcontent
  const selectedSubcontent = document.getElementById(subtabName);
  if (selectedSubcontent) {
    selectedSubcontent.classList.add('active');
  }
  
  // Set active subtab button
  const activeButton = document.querySelector(`.subtab-btn[onclick="showSubtab('${subtabName}')"]`);
  if (activeButton) {
    activeButton.classList.add('active');
  }
}

// Accordion Functions
function toggleAccordion(element) {
  const panel = element.nextElementSibling;
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  
  // Close all other accordions in the same tab
  const currentTab = element.closest('.tab-content, .subcontent');
  if (currentTab) {
    const accordions = currentTab.querySelectorAll('.accordion');
    accordions.forEach(acc => {
      if (acc !== element) {
        acc.setAttribute('aria-expanded', 'false');
        const accPanel = acc.nextElementSibling;
        if (accPanel) {
          accPanel.style.maxHeight = null;
        }
      }
    });
  }
  
  // Toggle current accordion
  if (isExpanded) {
    element.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = null;
  } else {
    element.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}

// Settings Functions
function animatedOpen() {
  document.getElementById('settingsPanel').classList.add('open');
  document.getElementById('overlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function animatedClose() {
  closeSettings();
}

function closeSettings() {
  document.getElementById('settingsPanel').classList.remove('open');
  document.getElementById('overlay').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function toggleVoice() {
  const currentStatus = localStorage.getItem('voiceEnabled') === 'true';
  const newStatus = !currentStatus;
  localStorage.setItem('voiceEnabled', newStatus);
  
  if (newStatus) {
    showNotification('Voice recognition enabled! 🎤');
    initializeVoiceRecognition();
  } else {
    showNotification('Voice recognition disabled! 🔇');
    stopVoiceRecognition();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  const theme = isDark ? 'Dark' : 'Light';
  showNotification(`${theme} theme activated! 🌗`);
}

function resetSettings() {
  if (confirm('This will reset all settings to default. Continue?')) {
    localStorage.clear();
    document.body.classList.remove('dark-theme');
    showNotification('Settings have been reset! 🔄');
  }
}

function launchJARVIS() {
  showNotification('🚀 JARVIS launching... Please ensure Python environment is ready!');
  
  // Simulate loading process
  setTimeout(() => {
    showNotification('✅ JARVIS is ready! You can now use voice commands.');
  }, 2000);
}

// Feedback Functions
function submitEmojiRating(emoji) {
  const emojiMeaning = {
    '😍': 'Excellent',
    '🙂': 'Good', 
    '😐': 'Neutral',
    '😡': 'Poor'
  };
  
  const rating = emojiMeaning[emoji] || 'Unknown';
  showNotification(`Thanks for your ${rating} feedback! ${emoji}`);
  
  // Here you could send the rating to a server
  console.log('Emoji rating submitted:', emoji, rating);
}

function sendEmail() {
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  
  if (!subject.trim() || !message.trim()) {
    showNotification('Please fill in both subject and message! ⚠️');
    return;
  }
  
  // Create mailto link
  const mailtoLink = `mailto:support@jarvis.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  
  // Try to open email client
  try {
    window.location.href = mailtoLink;
    showNotification('Email client opened! 📧');
    
    // Clear form
    document.getElementById('subject').value = '';
    document.getElementById('message').value = '';
  } catch (error) {
    showNotification('Could not open email client. Please try again. ❌');
    console.error('Email error:', error);
  }
}

// Voice Recognition Functions
function initializeVoiceRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = function(event) {
      const transcript = event.results[event.results.length - 1][0].transcript;
      handleVoiceCommand(transcript);
    };
    
    recognition.onerror = function(event) {
      console.error('Speech recognition error:', event.error);
      showNotification('Voice recognition error. Please try again. 🎤');
    };
    
    recognition.onstart = function() {
      showNotification('Voice recognition started. Listening... 🎤');
    };
    
    recognition.onend = function() {
      const voiceEnabled = localStorage.getItem('voiceEnabled') === 'true';
      if (voiceEnabled) {
        setTimeout(() => {
          recognition.start();
        }, 1000);
      }
    };
    
    recognition.start();
    window.voiceRecognition = recognition;
  } else {
    showNotification('Speech recognition is not supported in this browser. ❌');
  }
}

function stopVoiceRecognition() {
  if (window.voiceRecognition) {
    window.voiceRecognition.stop();
    window.voiceRecognition = null;
    showNotification('Voice recognition stopped. 🔇');
  }
}

function handleVoiceCommand(command) {
  const lowerCommand = command.toLowerCase().trim();
  
  // Voice command handlers
  if (lowerCommand.includes('hello jarvis')) {
    showNotification('Hello! How can I help you today? 👋');
  } else if (lowerCommand.includes('what time is it')) {
    const currentTime = new Date().toLocaleTimeString();
    showNotification(`Current time is ${currentTime} ⏰`);
  } else if (lowerCommand.includes('open settings')) {
    animatedOpen();
    showNotification('Settings opened ⚙️');
  } else if (lowerCommand.includes('close settings')) {
    animatedClose();
    showNotification('Settings closed ✅');
  } else if (lowerCommand.includes('switch theme') || lowerCommand.includes('toggle theme')) {
    toggleTheme();
  } else if (lowerCommand.includes('show home') || lowerCommand.includes('go home')) {
    showTabContent(1);
    showNotification('Home tab activated 🏠');
  } else if (lowerCommand.includes('show guides')) {
    showTabContent(2);
    showNotification('Guides tab activated 📖');
  } else if (lowerCommand.includes('show troubleshoot')) {
    showTabContent(3);
    showNotification('Troubleshoot tab activated 🔧');
  } else if (lowerCommand.includes('show faq')) {
    showTabContent(4);
    showNotification('FAQ tab activated ❓');
  } else if (lowerCommand.includes('feedback')) {
    showMainTab('feedback');
    showNotification('Feedback section opened 💬');
  } else if (lowerCommand.includes('launch jarvis')) {
    launchJARVIS();
  }
}

// Notification System
function showNotification(message) {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Hide and remove notification
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// Search functionality for FAQ
function searchFAQ() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase();
  const accordions = document.querySelectorAll('#tab4 .accordion');
  
  accordions.forEach(accordion => {
    const text = accordion.textContent.toLowerCase();
    const panel = accordion.nextElementSibling;
    const panelText = panel ? panel.textContent.toLowerCase() : '';
    
    if (text.includes(searchTerm) || panelText.includes(searchTerm)) {
      accordion.style.display = 'block';
      if (panel) panel.style.display = 'block';
      
      // Highlight search term
      if (searchTerm && text.includes(searchTerm)) {
        accordion.classList.add('highlight');
      } else {
        accordion.classList.remove('highlight');
      }
    } else {
      accordion.style.display = searchTerm ? 'none' : 'block';
      if (panel) panel.style.display = searchTerm ? 'none' : 'block';
      accordion.classList.remove('highlight');
    }
  });
}

function clearSearch() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
    searchFAQ();
  }
}

// Settings Management
function saveSettings() {
  const settings = {
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    voiceEnabled: localStorage.getItem('voiceEnabled') === 'true',
    lastActiveTab: getCurrentActiveTab(),
    lastMainTab: getCurrentMainTab()
  };
  
  localStorage.setItem('jarvisSettings', JSON.stringify(settings));
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('jarvisSettings') || '{}');
    
    // Apply theme
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
    }
    
    // Apply voice setting
    if (settings.voiceEnabled) {
      localStorage.setItem('voiceEnabled', 'true');
    }
    
    // Show last main tab
    if (settings.lastMainTab) {
      showMainTab(settings.lastMainTab);
    }
    
    // Show last active internal tab
    if (settings.lastActiveTab) {
      showTabContent(settings.lastActiveTab);
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

function getCurrentActiveTab() {
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab) {
    return parseInt(activeTab.id.replace('tab', ''));
  }
  return 1;
}

function getCurrentMainTab() {
  const activeMainContent = document.querySelector('.content.active');
  if (activeMainContent) {
    return activeMainContent.id;
  }
  return 'home';
}

// Dynamic FAQ Loading
function loadDynamicFAQs() {
  const dynamicContainer = document.getElementById('dynamicFAQs');
  if (!dynamicContainer) return;
  
  const additionalFAQs = [
    {
      question: "How to contribute to JARVIS source code?",
      answer: "Fork the repository on GitHub, make your changes, and submit a pull request. Make sure to follow the coding guidelines and include proper documentation."
    },
    {
      question: "Voice recognition is not accurate?",
      answer: "Use clear pronunciation, reduce background noise, and keep the microphone close to your mouth. You can also train the voice recognition system for better accuracy."
    },
    {
      question: "Can JARVIS control smart home devices?",
      answer: "Yes! With Arduino integration, JARVIS can control lights, fans, sensors, and other IoT devices. Check the Arduino setup guide for more details."
    },
    {
      question: "How to add custom voice commands?",
      answer: "Edit the conversation.py file and add your custom commands in the appropriate functions. You can also modify the qna.json file for simple question-answer pairs."
    },
    {
      question: "JARVIS is consuming too much CPU?",
      answer: "This might be due to continuous voice recognition. Try reducing the recognition sensitivity or optimize the processing interval in the settings."
    }
  ];

  additionalFAQs.forEach(faq => {
    const accordionButton = document.createElement('button');
    accordionButton.className = 'accordion';
    accordionButton.setAttribute('aria-expanded', 'false');
    accordionButton.onclick = () => toggleAccordion(accordionButton);
    accordionButton.textContent = faq.question;

    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<p>${faq.answer}</p>`;

    dynamicContainer.appendChild(accordionButton);
    dynamicContainer.appendChild(panel);
  });
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
  // Ctrl + number keys to switch internal tabs
  if (event.ctrlKey) {
    const key = parseInt(event.key);
    if (key >= 1 && key <= 4) {
      event.preventDefault();
      showTabContent(key);
    }
  }
  
  // Escape to close settings
  if (event.key === 'Escape') {
    closeSettings();
  }
  
  // Ctrl + / for search (when on FAQ tab)
  if (event.ctrlKey && event.key === '/') {
    const activeTab = getCurrentActiveTab();
    if (activeTab === 4) { // FAQ tab
      event.preventDefault();
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.focus();
      }
    }
  }
  
  // Alt + H for Home tab
  if (event.altKey && event.key.toLowerCase() === 'h') {
    event.preventDefault();
    showMainTab('home');
  }
  
  // Alt + F for Feedback tab
  if (event.altKey && event.key.toLowerCase() === 'f') {
    event.preventDefault();
    showMainTab('feedback');
  }
}

// Performance monitoring
function monitorPerformance() {
  // Monitor memory usage (if available)
  if (performance.memory) {
    const memoryInfo = {
      used: Math.round(performance.memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(performance.memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB'
    };
    
    console.log('Memory Usage:', memoryInfo);
  }
  
  // Monitor page load performance
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms');
      }
    }, 0);
  });
}

// Add search box to FAQ tab
function addSearchToFAQ() {
  const faqTab = document.getElementById('tab4');
  if (!faqTab) return;
  
  const faqTitle = faqTab.querySelector('h2');
  if (!faqTitle) return;
  
  // Create search container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';
  searchContainer.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search FAQs..." onkeyup="searchFAQ()" />
    <button onclick="clearSearch()">Clear</button>
  `;
  
  // Insert after title
  faqTitle.parentNode.insertBefore(searchContainer, faqTitle.nextSibling);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load saved settings
  loadSettings();
  
  // Add dynamic FAQ content
  loadDynamicFAQs();
  
  // Add search functionality to FAQ tab
  addSearchToFAQ();
  
  // Setup keyboard shortcuts
  document.addEventListener('keydown', handleKeyboardShortcuts);
  
  // Auto-save settings periodically
  setInterval(saveSettings, 30000); // Save every 30 seconds
  
  // Monitor performance
  monitorPerformance();
  
  // Add smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
  
  // Show welcome message
  setTimeout(() => {
    showNotification('Welcome to JARVIS Dashboard! 🤖');
  }, 1000);
  
  // Initialize voice recognition if enabled
  const voiceEnabled = localStorage.getItem('voiceEnabled') === 'true';
  if (voiceEnabled) {
    setTimeout(() => {
      initializeVoiceRecognition();
    }, 2000);
  }
});

// Save settings when page is about to unload
window.addEventListener('beforeunload', saveSettings);

// Handle visibility change to pause/resume voice recognition
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // Page is hidden, pause voice recognition
    if (window.voiceRecognition) {
      window.voiceRecognition.stop();
    }
  } else {
    // Page is visible, resume if enabled
    const voiceEnabled = localStorage.getItem('voiceEnabled') === 'true';
    if (voiceEnabled && !window.voiceRecognition) {
      setTimeout(() => {
        initializeVoiceRecognition();
      }, 1000);
    }
  }
});
