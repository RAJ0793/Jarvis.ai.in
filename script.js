// -------- Accessible Accordion Handlers -------- //
function addAccessibleAccordionHandlers() {
  document.querySelectorAll('.accordion').forEach(acc => {
    acc.setAttribute('tabindex', '0');
    acc.setAttribute('role', 'button');
    acc.setAttribute('aria-expanded', 'false');

    acc.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
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

// -------- Dynamic FAQ Generator -------- //
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

function initializeFAQ() {
  const faqContainer = document.getElementById("dynamicFAQs");
  if (!faqContainer) return;

  Object.entries(faqData).forEach(([letter, content]) => {
    const btn = document.createElement("button");
    btn.className = "accordion";
    btn.innerText = `${letter} – ${content.split(":")[0]}`;

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `<p>${content}</p>`;

    btn.onclick = () => {
      const isActive = panel.classList.contains('active');
      faqContainer.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
      if (!isActive) panel.classList.add('active');
      updateAccordionAria();
    };

    faqContainer.appendChild(btn);
    faqContainer.appendChild(panel);
  });
}

// -------- Tabs & Sub-Tabs -------- //
function showTab(tabNumber) {
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.querySelectorAll('.tabs button').forEach((b, i) => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.getElementById('tab' + tabNumber).classList.add('active');
  const tabBtn = document.querySelectorAll('.tabs button')[tabNumber - 1];
  tabBtn.classList.add('active');
  tabBtn.setAttribute('aria-selected', 'true');
}

function showSubTab(tabNumber) {
  const tabs = document.querySelectorAll(".tab-content");
  const buttons = document.querySelectorAll(".sub-tabs button");

  tabs.forEach((tab, i) => {
    tab.classList.remove("active");
    tab.setAttribute("aria-hidden", "true");
    buttons[i].classList.remove("active");
    buttons[i].setAttribute("aria-selected", "false");
  });

  const activeTab = document.getElementById(`tab${tabNumber}`);
  const activeButton = document.getElementById(`subtab${tabNumber}`);

  if (activeTab && activeButton) {
    activeTab.classList.add("active");
    activeTab.setAttribute("aria-hidden", "false");
    activeButton.classList.add("active");
    activeButton.setAttribute("aria-selected", "true");
  }
}

// -------- Theme, Voice & Settings -------- //
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

function toggleVoice() {
  alert("🎤 Voice Toggled!");
}

function resetSettings() {
  if (confirm("Reset all settings to default?")) {
    localStorage.clear();
    document.body.classList.remove('dark');
    alert("⚙️ Settings reset successfully!");
  }
}

function animatedOpen() {
  document.getElementById("settingsPanel").classList.add("open");
  document.getElementById("overlay").style.display = "block";
}

function animatedClose() {
  document.getElementById("settingsPanel").classList.remove("open");
  document.getElementById("overlay").style.display = "none";
}

function closeSettings() {
  animatedClose();
}

// -------- Chat Handling -------- //
function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  if (!input || !chatBox) return;

  if (input.value.trim() === "") return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = input.value;
  chatBox.appendChild(userMsg);

  const botMsg = document.createElement("div");
  botMsg.className = "message bot";
  botMsg.textContent = "You said: " + input.value;
  chatBox.appendChild(botMsg);

  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";
}

document.addEventListener("keydown", e => {
  const input = document.getElementById("user-input");
  if (input && e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// -------- JARVIS Launch -------- //
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

// -------- DOM Ready -------- //
document.addEventListener('DOMContentLoaded', () => {
  initializeFAQ();
  addAccessibleAccordionHandlers();
  updateAccordionAria();

  const savedTheme = localStorage.getItem('darkMode');
  if (savedTheme === 'true') {
    document.body.classList.add('dark');
  } else if (savedTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark');
  }
});
