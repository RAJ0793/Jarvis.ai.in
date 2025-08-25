// Compact JARVIS Dashboard JavaScript

// Utility functions
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const hide = el => { el.classList.remove('active'); el.style.display = 'none'; };
const show = el => { el.classList.add('active'); el.style.display = 'block'; };

// Main tab switching
function showMainTab(tabName) {
  $$('.content').forEach(hide);
  $$('.tab-btn').forEach(btn => btn.classList.remove('active'));
  
  const targetId = tabName.toLowerCase() === 'download and install' ? 'dwnlninstl' : 
                   tabName.toLowerCase() === 'setup' ? 'setup' : 
                   tabName.toLowerCase();
  
  const target = $(targetId);
  if (target) show(target);
  
  const activeBtn = Array.from($$('.tab-btn')).find(btn => 
    btn.textContent.trim().toLowerCase() === tabName.toLowerCase());
  if (activeBtn) activeBtn.classList.add('active');
}

// Internal tab switching
function showTabContent(tabNumber) {
  for (let i = 1; i <= 5; i++) {
    const tab = $(`tab${i}`);
    if (tab) hide(tab);
  }
  
  const selected = $(`tab${tabNumber}`);
  if (selected) show(selected);
  
  $$('.tabs button').forEach((btn, i) => {
    btn.classList.toggle('active', i === tabNumber - 1);
    btn.setAttribute('aria-selected', i === tabNumber - 1);
  });
}

// Feedback subtabs
function showSubtab(subtabName) {
  $$('.subcontent').forEach(hide);
  $$('.subtab-btn').forEach(btn => btn.classList.remove('active'));
  
  const target = $(subtabName);
  if (target) show(target);
  event.target.classList.add('active');
}

// Accordion toggle
function toggleAccordion(element) {
  const panel = element.nextElementSibling;
  const isOpen = element.getAttribute('aria-expanded') === 'true';
  
  // Close others in same tab
  const tab = element.closest('.tab-content, .subcontent');
  if (tab) {
    tab.querySelectorAll('.accordion').forEach(acc => {
      if (acc !== element) {
        acc.setAttribute('aria-expanded', 'false');
        acc.nextElementSibling.style.maxHeight = null;
      }
    });
  }
  
  element.setAttribute('aria-expanded', !isOpen);
  panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
}

// Settings panel
const settingsPanel = () => $('settingsPanel');
const overlay = () => $('overlay');

function animatedOpen() {
  settingsPanel().classList.add('open');
  overlay().style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function animatedClose() { closeSettings(); }

function closeSettings() {
  settingsPanel().classList.remove('open');
  overlay().style.display = 'none';
  document.body.style.overflow = 'auto';
}

function toggleVoice() {
  const current = localStorage.getItem('voiceEnabled') === 'true';
  const newStatus = !current;
  localStorage.setItem('voiceEnabled', newStatus);
  
  if (newStatus) {
    showNotification('Voice enabled! 🎤');
    initVoice();
  } else {
    showNotification('Voice disabled! 🔇');
    stopVoice();
  }
}

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  showNotification(`${isDark ? 'Dark' : 'Light'} theme! 🌗`);
}

function resetSettings() {
  if (confirm('Reset all settings?')) {
    localStorage.clear();
    document.body.classList.remove('dark-theme');
    showNotification('Settings reset! 🔄');
  }
}

function launchJARVIS() {
  showNotification('🚀 JARVIS launching...');
  setTimeout(() => showNotification('✅ JARVIS ready!'), 2000);
}

// Feedback functions
function submitEmojiRating(emoji) {
  const ratings = {
    '😍': 'Awesome', '😆': 'Excellent', '😊': 'Well done', '😅': 'Neutral',
    '😏': 'Not very well', '🙄': 'Ok', '😐': 'Poor', '😡': 'Very poor'
  };
  showNotification(`Thanks for ${ratings[emoji]} feedback! ${emoji}`);
}

function sendEmail() {
  const subject = $('subject').value;
  const message = $('message').value;
  
  if (!subject.trim() || !message.trim()) {
    showNotification('Fill both fields! ⚠️');
    return;
  }
  
  const mailto = `mailto:support@jarvis.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  window.location.href = mailto;
  showNotification('Email opened! 📧');
  $('subject').value = $('message').value = '';
}

// Voice recognition
let recognition = null;

function initVoice() {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    showNotification('Speech not supported! ❌');
    return;
  }
  
  const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new Speech();
  Object.assign(recognition, { continuous: true, interimResults: true, lang: 'en-US' });
  
  recognition.onresult = e => handleCommand(e.results[e.results.length - 1][0].transcript);
  recognition.onerror = () => showNotification('Voice error! 🎤');
  recognition.onstart = () => showNotification('Listening... 🎤');
  recognition.onend = () => {
    if (localStorage.getItem('voiceEnabled') === 'true') {
      setTimeout(() => recognition.start(), 1000);
    }
  };
  
  recognition.start();
}

function stopVoice() {
  if (recognition) {
    recognition.stop();
    recognition = null;
    showNotification('Voice stopped! 🔇');
  }
}

function handleCommand(cmd) {
  const lower = cmd.toLowerCase().trim();
  const commands = {
    'hello jarvis': () => showNotification('Hello! 👋'),
    'what time is it': () => showNotification(`Time: ${new Date().toLocaleTimeString()} ⏰`),
    'open settings': () => { animatedOpen(); showNotification('Settings opened ⚙️'); },
    'close settings': () => { animatedClose(); showNotification('Settings closed ✅'); },
    'switch theme': toggleTheme,
    'toggle theme': toggleTheme,
    'show home': () => { showTabContent(1); showNotification('Home 🏠'); },
    'go home': () => { showTabContent(1); showNotification('Home 🏠'); },
    'show guides': () => { showTabContent(2); showNotification('Guides 📖'); },
    'show troubleshoot': () => { showTabContent(3); showNotification('Troubleshoot 🔧'); },
    'show faq': () => { showTabContent(4); showNotification('FAQ ❓'); },
    'feedback': () => { showMainTab('feedback'); showNotification('Feedback 💬'); },
    'launch jarvis': launchJARVIS
  };
  
  Object.keys(commands).forEach(key => {
    if (lower.includes(key)) commands[key]();
  });
}

// Notification system
function showNotification(msg) {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();
  
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = msg;
  document.body.appendChild(notif);
  
  setTimeout(() => notif.classList.add('show'), 100);
  setTimeout(() => {
    notif.classList.remove('show');
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// FAQ search
function searchFAQ() {
  const term = $('searchInput').value.toLowerCase();
  $$('#tab4 .accordion').forEach(acc => {
    const text = acc.textContent.toLowerCase();
    const panel = acc.nextElementSibling;
    const panelText = panel ? panel.textContent.toLowerCase() : '';
    const match = text.includes(term) || panelText.includes(term);
    
    acc.style.display = !term || match ? 'block' : 'none';
    if (panel) panel.style.display = !term || match ? 'block' : 'none';
    acc.classList.toggle('highlight', term && match);
  });
}

function clearSearch() {
  const input = $('searchInput');
  if (input) { input.value = ''; searchFAQ(); }
}

// Settings management
function saveSettings() {
  const settings = {
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    voiceEnabled: localStorage.getItem('voiceEnabled') === 'true',
    lastTab: getCurrentTab(),
    lastMain: getCurrentMain()
  };
  localStorage.setItem('jarvisSettings', JSON.stringify(settings));
}

function loadSettings() {
  try {
    const settings = JSON.parse(localStorage.getItem('jarvisSettings') || '{}');
    if (settings.theme === 'dark') document.body.classList.add('dark-theme');
    if (settings.voiceEnabled) localStorage.setItem('voiceEnabled', 'true');
    if (settings.lastMain) showMainTab(settings.lastMain);
    if (settings.lastTab) showTabContent(settings.lastTab);
  } catch (e) { console.error('Settings load error:', e); }
}

const getCurrentTab = () => {
  const active = document.querySelector('.tab-content.active');
  return active ? parseInt(active.id.replace('tab', '')) : 1;
};

const getCurrentMain = () => {
  const active = document.querySelector('.content.active');
  return active ? active.id : 'home';
};

// Dynamic FAQ loading
function loadFAQs() {
  const container = $('dynamicFAQs');
  if (!container) return;
  
  const faqs = [
    { q: "How to contribute to JARVIS source code?", a: "Fork the repository on GitHub, make changes, and submit a pull request with proper documentation." },
    { q: "Voice recognition not accurate?", a: "Use clear pronunciation, reduce noise, keep mic close. Train the system for better accuracy." },
    { q: "Can JARVIS control smart home devices?", a: "Yes! With Arduino integration, JARVIS can control lights, fans, sensors, and IoT devices." },
    { q: "How to add custom voice commands?", a: "Edit conversation.py and add commands in appropriate functions. Modify qna.json for Q&A pairs." },
    { q: "JARVIS consuming too much CPU?", a: "Reduce voice recognition sensitivity or optimize processing interval in settings." },
    { q: "Which platforms does JARVIS support?", a: "Works on Windows, Linux, macOS, and Android. Some features are platform-specific." },
    { q: "How to enable offline mode?", a: "Enable in settings. Some AI features may have limited functionality offline." },
    { q: "Can JARVIS send emails?", a: "Yes! Configure credentials in email_settings.json. Use 'send email' command." },
    { q: "Multiple language support?", a: "Currently English only. Additional languages coming in future updates." },
    { q: "How to update JARVIS?", a: "Pull latest from GitHub or use built-in update command if available." }
  ];
  
  faqs.forEach(faq => {
    const btn = document.createElement('button');
    btn.className = 'accordion';
    btn.setAttribute('aria-expanded', 'false');
    btn.onclick = () => toggleAccordion(btn);
    btn.textContent = faq.q;
    
    const panel = document.createElement('div');
    panel.className = 'panel';
    panel.innerHTML = `<p>${faq.a}</p>`;
    
    container.append(btn, panel);
  });
}

// Keyboard shortcuts
function handleKeys(e) {
  if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
    e.preventDefault();
    showTabContent(parseInt(e.key));
  }
  if (e.key === 'Escape') closeSettings();
  if (e.ctrlKey && e.key === '/' && getCurrentTab() === 4) {
    e.preventDefault();
    $('searchInput')?.focus();
  }
  if (e.altKey && e.key.toLowerCase() === 'h') { e.preventDefault(); showMainTab('home'); }
  if (e.altKey && e.key.toLowerCase() === 'f') { e.preventDefault(); showMainTab('feedback'); }
}

// Add search to FAQ
function addSearch() {
  const faqTab = $('tab4');
  const title = faqTab?.querySelector('h2');
  if (!title) return;
  
  const search = document.createElement('div');
  search.className = 'search-container';
  search.innerHTML = `
    <input type="text" id="searchInput" placeholder="Search FAQs..." onkeyup="searchFAQ()" />
    <button onclick="clearSearch()">Clear</button>
  `;
  title.parentNode.insertBefore(search, title.nextSibling);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  loadFAQs();
  addSearch();
  document.addEventListener('keydown', handleKeys);
  setInterval(saveSettings, 30000);
  
  setTimeout(() => showNotification('Welcome to JARVIS! 🤖'), 1000);
  
  if (localStorage.getItem('voiceEnabled') === 'true') {
    setTimeout(initVoice, 2000);
  }
});

window.addEventListener('beforeunload', saveSettings);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && recognition) {
    recognition.stop();
  } else if (!document.hidden && localStorage.getItem('voiceEnabled') === 'true' && !recognition) {
    setTimeout(initVoice, 1000);
  }
});
