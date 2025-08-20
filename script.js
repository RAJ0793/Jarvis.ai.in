// Accessibility setup for accordions
function addAccessibleAccordionHandlers() {
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.setAttribute('tabindex', '0');
    acc.setAttribute('role', 'button');
    acc.setAttribute('aria-expanded', 'false');

    acc.addEventListener('keydown', e => {
      if (['Enter', ' ', 'Spacebar'].includes(e.key)) {
        e.preventDefault();
        acc.click();
      }
    });

    acc.addEventListener('touchstart', () => acc.focus());
  });
}

function updateAccordionAria() {
  document.querySelectorAll('.accordion').forEach(acc => {
    const panel = acc.nextElementSibling;
    acc.setAttribute('aria-expanded', panel.classList.contains('active'));
  });
}

// FAQ data
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

// Render FAQ section
function initializeFAQ() {
  const faqContainer = document.getElementById("dynamicFAQs");
  Object.entries(faqData).forEach(([key, content]) => {
    const button = document.createElement("button");
    button.className = "accordion";
    button.innerText = `${key} – ${content.split(":")[0]}`;

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `<p>${content}</p>`;

    button.addEventListener('click', () => {
      const isActive = panel.classList.contains('active');
      const currentTab = button.closest('.tab-content') || document;
      currentTab.querySelectorAll('.panel.active').forEach(p => p.classList.remove('active'));
      if (!isActive) panel.classList.add('active');
      updateAccordionAria();
    });

    faqContainer.append(button, panel);
  });
}

// Tab switching logic
function showTab(tabNumber) {
  const tabs = document.querySelectorAll('.tabs button');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach((btn, i) => {
    const active = i + 1 === tabNumber;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', String(active));
  });

  contents.forEach((content, i) => {
    content.classList.toggle('active', i + 1 === tabNumber);
    if (i + 1 === tabNumber) content.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  });

  tabs[tabNumber - 1].focus();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// Voice toggle
function toggleVoice() {
  const enabled = Math.random() > 0.5;
  alert(`🎤 Voice control ${enabled ? "enabled" : "disabled"}`);
}

// Reset all settings
function resetSettings() {
  if (confirm("Reset all settings to default?")) {
    localStorage.clear();
    document.body.classList.remove('dark');
    alert("⚙️ Settings reset successfully!");
  }
}

// Settings panel open/close animations
function animatedOpen() {
  const icon = document.getElementById('settingsIcon');
  const overlay = document.getElementById('overlay');
  icon.classList.add('rotate-clockwise');

  requestAnimationFrame(() => {
    setTimeout(() => {
      icon.classList.remove('rotate-clockwise');
      document.getElementById('settingsPanel').classList.add('active');
      overlay.classList.add('active');
    }, 250);
  });
}

function animatedClose() {
  const back = document.getElementById('backArrow');
  const overlay = document.getElementById('overlay');
  back.classList.add('rotate-anticlockwise');

  requestAnimationFrame(() => {
    setTimeout(() => {
      back.classList.remove('rotate-anticlockwise');
      document.getElementById('settingsPanel').classList.remove('active');
      overlay.classList.remove('active');
    }, 250);
  });
}

function closeSettings() {
  document.getElementById('settingsPanel').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}

// Launch simulation
function launchJARVIS() {
  const messages = [
    "🤖 JARVIS is initializing...",
    "🎯 Systems coming online...",
    "🚀 Ready for commands, sir!",
    "⚡ All systems operational!",
    "🎤 Voice recognition activated!"
  ];
  alert(messages[Math.floor(Math.random() * messages.length)]);
}

// Setup everything once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeFAQ();
  addAccessibleAccordionHandlers();
  updateAccordionAria();

  // Apply saved theme
  const savedTheme = localStorage.getItem('darkMode');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'true' || (savedTheme === null && systemDark)) {
    document.body.classList.add('dark');
  }

  // Swipe gesture to close settings
  const settingsPanel = document.getElementById('settingsPanel');
  let touchStartX = null;

  settingsPanel.addEventListener('touchstart', e => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
    }
  });

  settingsPanel.addEventListener('touchend', e => {
    if (touchStartX !== null && e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (deltaX > 60) closeSettings();
    }
    touchStartX = null;
  });
});

// Outside click and Escape key to close settings
document.addEventListener('click', e => {
  const panel = document.getElementById('settingsPanel');
  const icon = document.getElementById('settingsIcon');
  if (!panel.contains(e.target) && !icon.contains(e.target) && panel.classList.contains('active')) {
    closeSettings();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSettings();
});
