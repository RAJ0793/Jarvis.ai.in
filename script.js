// Enhanced JavaScript with additional functionality
function showTab(tabNumber) {
  // Hide all tabs
  const tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  
  // Remove active from all tab buttons
  const tabButtons = document.querySelectorAll('.tabs button');
  tabButtons.forEach(button => {
    button.classList.remove('active');
    button.setAttribute('aria-selected', 'false');
  });
  
  // Show selected tab
  document.getElementById(`tab${tabNumber}`).classList.add('active');
  
  // Set active tab button
  const activeButton = document.querySelector(`.tabs button:nth-child(${tabNumber})`);
  activeButton.classList.add('active');
  activeButton.setAttribute('aria-selected', 'true');
}

function toggleAccordion(element) {
  const panel = element.nextElementSibling;
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  
  // Close all other accordions in the same tab
  const currentTab = element.closest('.tab-content');
  const accordions = currentTab.querySelectorAll('.accordion');
  accordions.forEach(acc => {
    if (acc !== element) {
      acc.setAttribute('aria-expanded', 'false');
      acc.nextElementSibling.style.maxHeight = null;
    }
  });
  
  // Toggle current accordion
  if (isExpanded) {
    element.setAttribute('aria-expanded', 'false');
    panel.style.maxHeight = null;
  } else {
    element.setAttribute('aria-expanded', 'true');
    panel.style.maxHeight = panel.scrollHeight + "px";
  }
}

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
    alert('Voice recognition enabled! 🎤');
    // Here you would initialize voice recognition
    initializeVoiceRecognition();
  } else {
    alert('Voice recognition disabled! 🔇');
    // Here you would stop voice recognition
    stopVoiceRecognition();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  
  // Show notification
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
  // This would typically trigger the Python script
  // For demo purposes, showing notification
  
  // Simulate loading process
  setTimeout(() => {
    showNotification('✅ JARVIS is ready! You can now use voice commands.');
  }, 2000);
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
    };
    
    recognition.start();
    window.voiceRecognition = recognition;
  } else {
    alert('Speech recognition is not supported in this browser.');
  }
}

function stopVoiceRecognition() {
  if (window.voiceRecognition) {
    window.voiceRecognition.stop();
    window.voiceRecognition = null;
  }
}

function handleVoiceCommand(command) {
  const lowerCommand = command.toLowerCase().trim();
  
  // Voice command handlers
  if (lowerCommand.includes('hello jarvis')) {
    showNotification('Hello! How can I help you today?');
  } else if (lowerCommand.includes('what time is it')) {
    const currentTime = new Date().toLocaleTimeString();
    showNotification(`Current time is ${currentTime}`);
  } else if (lowerCommand.includes('open settings')) {
    animatedOpen();
  } else if (lowerCommand.includes('close settings')) {
    animatedClose();
  } else if (lowerCommand.includes('switch theme') || lowerCommand.includes('toggle theme')) {
    toggleTheme();
  } else if (lowerCommand.includes('show home')) {
    showTab(1);
  } else if (lowerCommand.includes('show guides')) {
    showTab(2);
  } else if (lowerCommand.includes('show troubleshoot')) {
    showTab(3);
  } else if (lowerCommand.includes('show faq')) {
    showTab(4);
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

// Search functionality
function searchFAQ() {
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput.value.toLowerCase();
  const accordions = document.querySelectorAll('#tab4 .accordion');
  
  accordions.forEach(accordion => {
    const text = accordion.textContent.toLowerCase();
    const panel = accordion.nextElementSibling;
    const panelText = panel.textContent.toLowerCase();
    
    if (text.includes(searchTerm) || panelText.includes(searchTerm)) {
      accordion.style.display = 'block';
      panel.style.display = 'block';
      
      // Highlight search term
      if (searchTerm && text.includes(searchTerm)) {
        accordion.classList.add('highlight');
      } else {
        accordion.classList.remove('highlight');
      }
    } else {
      accordion.style.display = searchTerm ? 'none' : 'block';
      panel.style.display = searchTerm ? 'none' : 'block';
      accordion.classList.remove('highlight');
    }
  });
}

// Auto-save settings
function saveSettings() {
  const settings = {
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    voiceEnabled: localStorage.getItem('voiceEnabled') === 'true',
    lastActiveTab: getCurrentActiveTab()
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
    
    // Show last active tab
    if (settings.lastActiveTab) {
      showTab(settings.lastActiveTab);
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

// Initialize dynamic content
function loadDynamicFAQs() {
  const dynamicContainer = document.getElementById('dynamicFAQs');
  
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
  // Ctrl + number keys to switch tabs
  if (event.ctrlKey) {
    const key = parseInt(event.key);
    if (key >= 1 && key <= 4) {
      event.preventDefault();
      showTab(key);
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
      console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.loadEventStart) + 'ms');
    }, 0);
  });
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
});

// Add search box to FAQ tab
function addSearchToFAQ() {
  const faqTab = document.getElementById('tab4');
  const faqTitle = faqTab.querySelector('h2');
  
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

function clearSearch() {
  document.getElementById('searchInput').value = '';
  searchFAQ();
}

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
      initializeVoiceRecognition();
    }
  }
});

// Add CSS for notifications and search
const additionalStyles = `
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  background: rgba(102, 126, 234, 0.95);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  font-weight: bold;
  z-index: 2000;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.notification.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.search-container {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-container input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #667eea;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

.search-container input:focus {
  border-color: #5a67d8;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-container button {
  padding: 12px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-container button:hover {
  background: #5a67d8;
}

.accordion.highlight {
  background: #fff3cd !important;
  border-left-color: #ffc107 !important;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
  }
  
  .search-container button {
    width: 100%;
  }
  
  .notification {
    left: 10px;
    right: 10px;
    transform: translateY(-100px);
    width: auto;
  }
  
  .notification.show {
    transform: translateY(0);
  }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
