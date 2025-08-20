// Cross-platform touch/keyboard accessibility for accordions and tabs
function addAccessibleAccordionHandlers() {
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.setAttribute('tabindex', '0');
    acc.setAttribute('role', 'button');
    acc.setAttribute('aria-expanded', 'false');
    acc.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        acc.click();
      }
    });
    acc.addEventListener('touchstart', function(e) {
      acc.focus();
    });
  });
}

function updateAccordionAria() {
  document.querySelectorAll('.accordion').forEach(acc => {
    const panel = acc.nextElementSibling;
    acc.setAttribute('aria-expanded', panel.classList.contains('active'));
  });
}

// Dynamic FAQ Generation
const faqData = {
  A: "Architecture: Built with modular Python design for easy extensibility and maintenance.",
  B: "Beginner Guide: Start with Python installation, then clone and run the main script.",
  C: "Customization: Easily modify responses, commands, and behavior through config files.",
  D: "Dependencies: Uses minimal external libraries for better performance and reliability.",
  E: "Extensions: Plugin architecture allows adding new features without core changes.",
  F: "Features: Voice control, text processing, memory, automation, and IoT integration.",
  G: "GitHub: Open development on https://github.com/raj0793/jarvis.ai.in",
  H: "Help: Community support through GitHub issues and discussion forums.",
  I: "Installation: Simple setup process with detailed documentation and video guides.",
  J: "JARVIS Name: Inspired by Iron Man's AI but built for real-world applications.",
  K: "Keyboard: Full keyboard input support alongside voice commands.",
  L: "Languages: Multi-language support with focus on Indian regional languages.",
  M: "Memory: Persistent memory system stores important context and user preferences.",
  N: "Network: Primarily offline operation with optional online feature enhancement.",
  O: "Open Source: MIT licensed, encouraging community contributions and improvements.",
  P: "Performance: Optimized for low-resource environments and older hardware.",
  Q: "Questions: Extensive Q&A database with easy editing and expansion capabilities.",
  R: "Reset: Simple reset options to restore default settings and clear memory.",
  S: "Speech: Advanced speech recognition with noise filtering and accent adaptation.",
  T: "Terminal: Command-line interface for advanced users and automation scripts.",
  U: "User Interface: Multiple interface options including CLI, GUI, and web dashboard.",
  V: "Voice: Natural voice synthesis with multiple voice options and speed control.",
  W: "Windows: Full Windows compatibility with Linux and macOS support planned.",
  X: "eXtensibility: Plugin system allows third-party developers to add features.",
  Y: "Your Data: Complete privacy with local data storage and no cloud dependency.",
  Z: "Zero Cost: Free forever with no subscription fees or usage limitations."
};

// Initialize FAQ section
function initializeFAQ() {
  const faqContainer = document.getElementById("dynamicFAQs");
  Object.entries(faqData).forEach(([letter, content]) => {
    const btn = document.createElement("button");
    btn.className = "accordion";
    btn.innerText = `${letter} – ${content.split(":")[0]}`;
    
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `<p>${content}</p>`;
    
    btn.onclick = () => {
      const isActive = panel.classList.contains('active');
      // Close all panels
      document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      // Open this panel if it wasn't active
      if (!isActive) {
        panel.classList.add('active');
      }
    };
    
    faqContainer.appendChild(btn);
    faqContainer.appendChild(panel);
  });
}

// Tab functionality
function showTab(tabNumber) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach((b, i) => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('tab' + tabNumber).classList.add('active');
  const tabBtn = document.querySelectorAll('.tabs button')[tabNumber - 1];
  tabBtn.classList.add('active');
  tabBtn.setAttribute('aria-selected', 'true');
  tabBtn.focus();
}

// Theme toggle functionality
function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
}

// Voice toggle functionality
function toggleVoice() {
  alert("🎤 Voice control " + (Math.random() > 0.5 ? "enabled" : "disabled"));
}

// Reset settings functionality
function resetSettings() {
  if (confirm("Reset all settings to default?")) {
    localStorage.clear();
    document.body.classList.remove('dark');
    alert("⚙️ Settings reset successfully!");
  }
}

// Settings panel animation functions
function animatedOpen() {
  const icon = document.getElementById('settingsIcon');
  const overlay = document.getElementById('overlay');
  
  icon.classList.add('rotate-clockwise');
  setTimeout(() => {
    icon.classList.remove('rotate-clockwise');
    document.getElementById('settingsPanel').classList.add('active');
    overlay.classList.add('active');
  }, 250);
}

function animatedClose() {
  const back = document.getElementById('backArrow');
  const overlay = document.getElementById('overlay');
  
  back.classList.add('rotate-anticlockwise');
  setTimeout(() => {
    back.classList.remove('rotate-anticlockwise');
    document.getElementById('settingsPanel').classList.remove('active');
    overlay.classList.remove('active');
  }, 250);
}

function closeSettings() {
  document.getElementById('settingsPanel').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// JARVIS launch functionality
function launchJARVIS() {
  const responses = [
    "🤖 JARVIS is initializing...",
    "🎯 Systems coming online...",
    "🚀 Ready for commands, sir!",
    "⚡ All systems operational!",
    "🎤 Voice recognition activated!"
  ];
  alert(responses[Math.floor(Math.random() * responses.length)]);
}

// Initialize page on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFAQ();
  
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(acc => {
    if (!acc.onclick) {
      acc.onclick = () => {
        const panel = acc.nextElementSibling;
        const isActive = panel.classList.contains('active');
        const currentTab = acc.closest('.tab-content');
        currentTab.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        if (!isActive) {
          panel.classList.add('active');
        }
        updateAccordionAria();
      };
    }
  });
  
  addAccessibleAccordionHandlers();
  updateAccordionAria();
  
  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark');
  } else if (savedTheme === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
  }
});

// Event listeners for settings panel
document.addEventListener('click', function(e) {
  const panel = document.getElementById('settingsPanel');
  const settingsBtn = document.getElementById('settingsIcon');
  if (!panel.contains(e.target) && !settingsBtn.contains(e.target) && panel.classList.contains('active')) {
    closeSettings();
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeSettings();
  }
});

// Touch gesture: swipe right to close settings on mobile
let touchStartX = null;
document.addEventListener('DOMContentLoaded', function() {
  const settingsPanel = document.getElementById('settingsPanel');
  
  settingsPanel.addEventListener('touchstart', function(e) {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });
  
  settingsPanel.addEventListener('touchend', function(e) {
    if (touchStartX !== null && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX > 60) {
        closeSettings();
      }
    }
    touchStartX = null;
  });
});

// ✅ Chat Send Message Function
function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");

  if (!input || !chatBox) return; // agar chat UI page pe nahi hai toh skip

  if (input.value.trim() === "") return;

  // User message
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = input.value;
  chatBox.appendChild(userMsg);

  // Bot auto reply
  const botMsg = document.createElement("div");
  botMsg.className = "message bot";
  botMsg.textContent = "You said: " + input.value;
  chatBox.appendChild(botMsg);

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // Clear input
  input.value = "";
}

// ✅ Optional: Enter key to send
document.addEventListener("keydown", function(e) {
  const input = document.getElementById("user-input");
  if (input && e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});
