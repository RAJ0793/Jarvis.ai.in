// JARVIS Dashboard - Modular JavaScript with Error Handling

// === UTILITY MODULE ===
const Utils = {
  // Safe DOM selectors with error handling
  $: (id) => {
    try {
      const element = document.getElementById(id);
      if (!element) console.warn(`Element with ID '${id}' not found`);
      return element;
    } catch (error) {
      console.error(`Error selecting element '${id}':`, error);
      return null;
    }
  },

  $$: (selector) => {
    try {
      return document.querySelectorAll(selector);
    } catch (error) {
      console.error(`Error with selector '${selector}':`, error);
      return [];
    }
  },

  hide: (el) => {
    if (!el) return;
    try {
      el.classList.remove('active');
      el.style.display = 'none';
    } catch (error) {
      console.error('Error hiding element:', error);
    }
  },

  show: (el) => {
    if (!el) return;
    try {
      el.classList.add('active');
      el.style.display = 'block';
    } catch (error) {
      console.error('Error showing element:', error);
    }
  },

  safeExecute: (fn, errorMsg = 'Function execution error') => {
    try {
      return fn();
    } catch (error) {
      console.error(errorMsg, error);
      return null;
    }
  }
};

// === TAB MANAGEMENT MODULE ===
const TabManager = {
  // Main tab switching with error handling
  showMainTab: (tabName) => {
    Utils.safeExecute(() => {
      Utils.$$('.content').forEach(Utils.hide);
      Utils.$$('.tab-btn').forEach(btn => btn.classList.remove('active'));
      
      const targetId = tabName.toLowerCase() === 'download and install' ? 'dwnlninstl' : 
                       tabName.toLowerCase() === 'setup' ? 'setup' : 
                       tabName.toLowerCase();
      
      const target = Utils.$(targetId);
      if (target) {
        Utils.show(target);
      } else {
        console.warn(`Target tab '${targetId}' not found`);
      }
      
      const activeBtn = Array.from(Utils.$$('.tab-btn')).find(btn => 
        btn.textContent.trim().toLowerCase() === tabName.toLowerCase());
      if (activeBtn) {
        activeBtn.classList.add('active');
      }
    }, 'Error switching main tab');
  },

  // Internal tab switching with error handling
  showTabContent: (tabNumber) => {
    Utils.safeExecute(() => {
      // Hide all tabs
      for (let i = 1; i <= 5; i++) {
        const tab = Utils.$(`tab${i}`);
        if (tab) Utils.hide(tab);
      }
      
      // Show selected tab
      const selected = Utils.$(`tab${tabNumber}`);
      if (selected) {
        Utils.show(selected);
      } else {
        console.warn(`Tab ${tabNumber} not found`);
        return;
      }
      
      // Update button states
      Utils.$$('.tabs button').forEach((btn, i) => {
        const isActive = i === tabNumber - 1;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', isActive);
      });
    }, 'Error switching tab content');
  },

  // Feedback subtabs with error handling
  showSubtab: (subtabName) => {
    Utils.safeExecute(() => {
      Utils.$$('.subcontent').forEach(Utils.hide);
      Utils.$$('.subtab-btn').forEach(btn => btn.classList.remove('active'));
      
      const target = Utils.$(subtabName);
      if (target) {
        Utils.show(target);
      } else {
        console.warn(`Subtab '${subtabName}' not found`);
      }
      
      // Check if event is available
      if (typeof event !== 'undefined' && event.target) {
        event.target.classList.add('active');
      }
    }, 'Error switching subtab');
  },

  getCurrentTab: () => {
    try {
      const active = document.querySelector('.tab-content.active');
      return active ? parseInt(active.id.replace('tab', '')) : 1;
    } catch (error) {
      console.error('Error getting current tab:', error);
      return 1;
    }
  },

  getCurrentMain: () => {
    try {
      const active = document.querySelector('.content.active');
      return active ? active.id : 'home';
    } catch (error) {
      console.error('Error getting current main:', error);
      return 'home';
    }
  }
};

// === ACCORDION MODULE ===
const AccordionManager = {
  toggle: (element) => {
    if (!element) return;
    
    Utils.safeExecute(() => {
      const panel = element.nextElementSibling;
      if (!panel) {
        console.warn('Accordion panel not found');
        return;
      }
      
      const isOpen = element.getAttribute('aria-expanded') === 'true';
      
      // Close others in same tab
      const tab = element.closest('.tab-content, .subcontent');
      if (tab) {
        tab.querySelectorAll('.accordion').forEach(acc => {
          if (acc !== element && acc.nextElementSibling) {
            acc.setAttribute('aria-expanded', 'false');
            acc.nextElementSibling.style.maxHeight = null;
          }
        });
      }
      
      element.setAttribute('aria-expanded', !isOpen);
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    }, 'Error toggling accordion');
  }
};

// === SETTINGS MODULE ===
const SettingsManager = {
  get panel() { return Utils.$('settingsPanel'); },
  get overlay() { return Utils.$('overlay'); },

  animatedOpen: () => {
    Utils.safeExecute(() => {
      const panel = SettingsManager.panel;
      const overlay = SettingsManager.overlay;
      
      if (panel) panel.classList.add('open');
      if (overlay) overlay.style.display = 'block';
      document.body.style.overflow = 'hidden';
    }, 'Error opening settings');
  },

  animatedClose: () => SettingsManager.closeSettings(),

  closeSettings: () => {
    Utils.safeExecute(() => {
      const panel = SettingsManager.panel;
      const overlay = SettingsManager.overlay;
      
      if (panel) panel.classList.remove('open');
      if (overlay) overlay.style.display = 'none';
      document.body.style.overflow = 'auto';
    }, 'Error closing settings');
  },

  toggleVoice: () => {
    Utils.safeExecute(() => {
      const current = localStorage.getItem('voiceEnabled') === 'true';
      const newStatus = !current;
      localStorage.setItem('voiceEnabled', newStatus);
      
      if (newStatus) {
        NotificationManager.show('Voice enabled! 🎤');
        VoiceManager.init();
      } else {
        NotificationManager.show('Voice disabled! 🔇');
        VoiceManager.stop();
      }
    }, 'Error toggling voice');
  },

  toggleTheme: () => {
    Utils.safeExecute(() => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      NotificationManager.show(`${isDark ? 'Dark' : 'Light'} theme! 🌗`);
    }, 'Error toggling theme');
  },

  reset: () => {
    Utils.safeExecute(() => {
      if (confirm('Reset all settings?')) {
        localStorage.clear();
        document.body.classList.remove('dark-theme');
        NotificationManager.show('Settings reset! 🔄');
      }
    }, 'Error resetting settings');
  },

  save: () => {
    Utils.safeExecute(() => {
      const settings = {
        theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
        voiceEnabled: localStorage.getItem('voiceEnabled') === 'true',
        lastTab: TabManager.getCurrentTab(),
        lastMain: TabManager.getCurrentMain()
      };
      localStorage.setItem('jarvisSettings', JSON.stringify(settings));
    }, 'Error saving settings');
  },

  load: () => {
    Utils.safeExecute(() => {
      const settings = JSON.parse(localStorage.getItem('jarvisSettings') || '{}');
      if (settings.theme === 'dark') document.body.classList.add('dark-theme');
      if (settings.voiceEnabled) localStorage.setItem('voiceEnabled', 'true');
      if (settings.lastMain) TabManager.showMainTab(settings.lastMain);
      if (settings.lastTab) TabManager.showTabContent(settings.lastTab);
    }, 'Error loading settings');
  }
};

// === NOTIFICATION MODULE ===
const NotificationManager = {
  show: (msg) => {
    Utils.safeExecute(() => {
      const existing = document.querySelector('.notification');
      if (existing) existing.remove();
      
      const notif = document.createElement('div');
      notif.className = 'notification';
      notif.textContent = msg;
      document.body.appendChild(notif);
      
      setTimeout(() => notif.classList.add('show'), 100);
      setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => {
          if (notif.parentNode) notif.remove();
        }, 300);
      }, 3000);
    }, 'Error showing notification');
  }
};

// === FEEDBACK MODULE ===
const FeedbackManager = {
  submitEmojiRating: (emoji) => {
    Utils.safeExecute(() => {
      const ratings = {
        '😍': 'Awesome', '😆': 'Excellent', '😊': 'Well done', '😅': 'Neutral',
        '😏': 'Not very well', '🙄': 'Ok', '😐': 'Poor', '😡': 'Very poor'
      };
      NotificationManager.show(`Thanks for ${ratings[emoji] || 'your'} feedback! ${emoji}`);
    }, 'Error submitting emoji rating');
  },

  sendEmail: () => {
    Utils.safeExecute(() => {
      const subject = Utils.$('subject');
      const message = Utils.$('message');
      
      if (!subject || !message) {
        NotificationManager.show('Email form not found! ❌');
        return;
      }
      
      if (!subject.value.trim() || !message.value.trim()) {
        NotificationManager.show('Fill both fields! ⚠️');
        return;
      }
      
      const mailto = `mailto:support@jarvis.ai?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(message.value)}`;
      window.location.href = mailto;
      NotificationManager.show('Email opened! 📧');
      subject.value = message.value = '';
    }, 'Error sending email');
  }
};

// === VOICE MODULE ===
const VoiceManager = {
  recognition: null,

  init: () => {
    Utils.safeExecute(() => {
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        NotificationManager.show('Speech not supported! ❌');
        return;
      }
      
      const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
      VoiceManager.recognition = new Speech();
      
      Object.assign(VoiceManager.recognition, {
        continuous: true,
        interimResults: true,
        lang: 'en-US'
      });
      
      VoiceManager.recognition.onresult = (e) => {
        if (e.results && e.results.length > 0) {
          const transcript = e.results[e.results.length - 1][0].transcript;
          VoiceManager.handleCommand(transcript);
        }
      };
      
      VoiceManager.recognition.onerror = () => NotificationManager.show('Voice error! 🎤');
      VoiceManager.recognition.onstart = () => NotificationManager.show('Listening... 🎤');
      VoiceManager.recognition.onend = () => {
        if (localStorage.getItem('voiceEnabled') === 'true') {
          setTimeout(() => {
            if (VoiceManager.recognition) VoiceManager.recognition.start();
          }, 1000);
        }
      };
      
      VoiceManager.recognition.start();
    }, 'Error initializing voice');
  },

  stop: () => {
    Utils.safeExecute(() => {
      if (VoiceManager.recognition) {
        VoiceManager.recognition.stop();
        VoiceManager.recognition = null;
        NotificationManager.show('Voice stopped! 🔇');
      }
    }, 'Error stopping voice');
  },

  handleCommand: (cmd) => {
    Utils.safeExecute(() => {
      const lower = cmd.toLowerCase().trim();
      const commands = {
        'hello jarvis': () => NotificationManager.show('Hello! 👋'),
        'what time is it': () => NotificationManager.show(`Time: ${new Date().toLocaleTimeString()} ⏰`),
        'open settings': () => { SettingsManager.animatedOpen(); NotificationManager.show('Settings opened ⚙️'); },
        'close settings': () => { SettingsManager.animatedClose(); NotificationManager.show('Settings closed ✅'); },
        'switch theme': SettingsManager.toggleTheme,
        'toggle theme': SettingsManager.toggleTheme,
        'show home': () => { TabManager.showTabContent(1); NotificationManager.show('Home 🏠'); },
        'go home': () => { TabManager.showTabContent(1); NotificationManager.show('Home 🏠'); },
        'show guides': () => { TabManager.showTabContent(2); NotificationManager.show('Guides 📖'); },
        'show troubleshoot': () => { TabManager.showTabContent(3); NotificationManager.show('Troubleshoot 🔧'); },
        'show faq': () => { TabManager.showTabContent(4); NotificationManager.show('FAQ ❓'); },
        'feedback': () => { TabManager.showMainTab('feedback'); NotificationManager.show('Feedback 💬'); },
        'launch jarvis': JarvisManager.launch
      };
      
      Object.keys(commands).forEach(key => {
        if (lower.includes(key) && typeof commands[key] === 'function') {
          commands[key]();
        }
      });
    }, 'Error handling voice command');
  }
};

// === FAQ MODULE ===
const FAQManager = {
  search: () => {
    Utils.safeExecute(() => {
      const searchInput = Utils.$('searchInput');
      if (!searchInput) return;
      
      const term = searchInput.value.toLowerCase();
      Utils.$$('#tab4 .accordion').forEach(acc => {
        const text = acc.textContent.toLowerCase();
        const panel = acc.nextElementSibling;
        const panelText = panel ? panel.textContent.toLowerCase() : '';
        const match = text.includes(term) || panelText.includes(term);
        
        acc.style.display = !term || match ? 'block' : 'none';
        if (panel) panel.style.display = !term || match ? 'block' : 'none';
        acc.classList.toggle('highlight', term && match);
      });
    }, 'Error searching FAQ');
  },

  clearSearch: () => {
    Utils.safeExecute(() => {
      const input = Utils.$('searchInput');
      if (input) {
        input.value = '';
        FAQManager.search();
      }
    }, 'Error clearing search');
  },

  load: () => {
    Utils.safeExecute(() => {
      const container = Utils.$('dynamicFAQs');
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
        btn.onclick = () => AccordionManager.toggle(btn);
        btn.textContent = faq.q;
        
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.innerHTML = `<p>${faq.a}</p>`;
        
        container.append(btn, panel);
      });
    }, 'Error loading FAQs');
  },

  addSearch: () => {
    Utils.safeExecute(() => {
      const faqTab = Utils.$('tab4');
      const title = faqTab?.querySelector('h2');
      if (!title) return;
      
      const search = document.createElement('div');
      search.className = 'search-container';
      search.innerHTML = `
        <input type="text" id="searchInput" placeholder="Search FAQs..." onkeyup="FAQManager.search()" />
        <button onclick="FAQManager.clearSearch()">Clear</button>
      `;
      title.parentNode.insertBefore(search, title.nextSibling);
    }, 'Error adding search');
  }
};

// === JARVIS CORE MODULE ===
const JarvisManager = {
  launch: () => {
    Utils.safeExecute(() => {
      NotificationManager.show('🚀 JARVIS launching...');
      setTimeout(() => NotificationManager.show('✅ JARVIS ready!'), 2000);
    }, 'Error launching JARVIS');
  }
};

// === KEYBOARD HANDLER MODULE ===
const KeyboardManager = {
  handleKeys: (e) => {
    Utils.safeExecute(() => {
      // Tab switching shortcuts
      if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
        e.preventDefault();
        TabManager.showTabContent(parseInt(e.key));
      }
      
      // Close settings with Escape
      if (e.key === 'Escape') {
        SettingsManager.closeSettings();
      }
      
      // Focus search in FAQ tab
      if (e.ctrlKey && e.key === '/' && TabManager.getCurrentTab() === 4) {
        e.preventDefault();
        const searchInput = Utils.$('searchInput');
        if (searchInput) searchInput.focus();
      }
      
      // Alt shortcuts for main tabs
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        TabManager.showMainTab('home');
      }
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        TabManager.showMainTab('feedback');
      }
    }, 'Error handling keyboard shortcut');
  }
};

// === GLOBAL FUNCTIONS (for backward compatibility) ===
window.showMainTab = TabManager.showMainTab;
window.showTabContent = TabManager.showTabContent;
window.showSubtab = TabManager.showSubtab;
window.toggleAccordion = AccordionManager.toggle;
window.animatedOpen = SettingsManager.animatedOpen;
window.animatedClose = SettingsManager.animatedClose;
window.closeSettings = SettingsManager.closeSettings;
window.toggleVoice = SettingsManager.toggleVoice;
window.toggleTheme = SettingsManager.toggleTheme;
window.resetSettings = SettingsManager.reset;
window.launchJARVIS = JarvisManager.launch;
window.submitEmojiRating = FeedbackManager.submitEmojiRating;
window.sendEmail = FeedbackManager.sendEmail;
window.searchFAQ = FAQManager.search;
window.clearSearch = FAQManager.clearSearch;

// === INITIALIZATION MODULE ===
const AppInitializer = {
  init: () => {
    Utils.safeExecute(() => {
      // Load settings first
      SettingsManager.load();
      
      // Load dynamic content
      FAQManager.load();
      FAQManager.addSearch();
      
      // Setup event listeners
      AppInitializer.setupEventListeners();
      
      // Setup periodic saves
      setInterval(SettingsManager.save, 30000);
      
      // Welcome notification
      setTimeout(() => NotificationManager.show('Welcome to JARVIS! 🤖'), 1000);
      
      // Initialize voice if enabled
      if (localStorage.getItem('voiceEnabled') === 'true') {
        setTimeout(VoiceManager.init, 2000);
      }
    }, 'Error during app initialization');
  },

  setupEventListeners: () => {
    // Keyboard shortcuts
    document.addEventListener('keydown', KeyboardManager.handleKeys);
    
    // Save settings before unload
    window.addEventListener('beforeunload', SettingsManager.save);
    
    // Handle visibility change for voice
    document.addEventListener('visibilitychange', () => {
      Utils.safeExecute(() => {
        if (document.hidden && VoiceManager.recognition) {
          VoiceManager.recognition.stop();
        } else if (!document.hidden && localStorage.getItem('voiceEnabled') === 'true' && !VoiceManager.recognition) {
          setTimeout(VoiceManager.init, 1000);
        }
      }, 'Error handling visibility change');
    });
  }
};

// === MAIN INITIALIZATION ===
document.addEventListener('DOMContentLoaded', AppInitializer.init);
