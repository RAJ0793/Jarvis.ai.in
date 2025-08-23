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
