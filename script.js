// === SETTINGS ICON & OVERLAY HANDLING ===
document.addEventListener('DOMContentLoaded', () => {
  const settingsIcon = document.getElementById("settingsIcon");
  const panel = document.getElementById("settingsPanel");
  const overlay = document.getElementById("overlay");

  if (!settingsIcon || !panel || !overlay) return;

  // Toggle panel on icon click
  settingsIcon.addEventListener("click", function() {
      panel.classList.add("active");
      overlay.style.display = "flex";
      this.style.display = "none"; // hide icon when panel open
  });

  // Close panel when overlay clicked
  overlay.addEventListener("click", function() {
      panel.classList.remove("active");
      this.style.display = "none";
      settingsIcon.style.display = "block"; // show icon again
  });

  // Optional: close panel with ESC key
  document.addEventListener("keydown", function(e) {
      if (e.key === "Escape" && panel.classList.contains("active")) {
          panel.classList.remove("active");
          overlay.style.display = "none";
          settingsIcon.style.display = "block";
      }
  });
});

// === OVERRIDE SETTINGSMANAGER FUNCTIONS TO SYNC ICON ===
SettingsManager.animatedOpen = () => {
  Utils.safeExecute(() => {
      const panel = SettingsManager.panel;
      const overlay = SettingsManager.overlay;
      const icon = document.getElementById("settingsIcon");

      if (panel) panel.classList.add('active');
      if (overlay) overlay.style.display = 'flex';
      if (icon) icon.style.display = 'none';
      document.body.style.overflow = 'hidden';
  }, 'Error opening settings');
};

SettingsManager.animatedClose = () => {
  Utils.safeExecute(() => {
      const panel = SettingsManager.panel;
      const overlay = SettingsManager.overlay;
      const icon = document.getElementById("settingsIcon");

      if (panel) panel.classList.remove('active');
      if (overlay) overlay.style.display = 'none';
      if (icon) icon.style.display = 'block';
      document.body.style.overflow = 'auto';
  }, 'Error closing settings');
};
// Simple Requirements Tab JavaScript

// System Check Function
function checkSystem() {
  const resultDiv = document.getElementById('systemResult');
  const button = document.querySelector('.check-btn');
  
  // Show loading
  button.innerHTML = '🔄 Checking...';
  button.disabled = true;
  resultDiv.classList.remove('hidden');
  
  resultDiv.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 2rem; margin-bottom: 10px;">⏳</div>
      <p>Scanning your system...</p>
    </div>
  `;

  // Simulate system check
  setTimeout(() => {
    performSystemCheck(resultDiv, button);
  }, 2000);
}

function performSystemCheck(resultDiv, button) {
  // Get system information
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const memory = navigator.deviceMemory || 'Unknown';
  const cores = navigator.hardwareConcurrency || 'Unknown';
  const connection = navigator.connection;
  
  // Check requirements
  const results = {
    os: checkOS(userAgent),
    ram: checkRAM(memory),
    cpu: checkCPU(cores),
    browser: checkBrowser(userAgent),
    connection: checkConnection(connection)
  };
  
  // Display results
  displayResults(resultDiv, results);
  
  // Reset button
  button.innerHTML = '🔍 Check My System';
  button.disabled = false;
}

function checkOS(userAgent) {
  if (userAgent.includes('Windows NT 10.0')) {
    return { status: 'good', text: 'Windows 10/11 ✓' };
  } else if (userAgent.includes('Windows')) {
    return { status: 'warning', text: 'Older Windows ⚠️' };
  } else {
    return { status: 'error', text: 'Non-Windows OS ❌' };
  }
}

function checkRAM(memory) {
  if (memory >= 16) {
    return { status: 'good', text: `${memory}GB - Excellent ✓` };
  } else if (memory >= 8) {
    return { status: 'good', text: `${memory}GB - Good ✓` };
  } else if (memory >= 4) {
    return { status: 'warning', text: `${memory}GB - Minimum ⚠️` };
  } else if (memory === 'Unknown') {
    return { status: 'warning', text: 'Cannot detect ⚠️' };
  } else {
    return { status: 'error', text: `${memory}GB - Too low ❌` };
  }
}

function checkCPU(cores) {
  if (cores >= 8) {
    return { status: 'good', text: `${cores} cores - Excellent ✓` };
  } else if (cores >= 4) {
    return { status: 'good', text: `${cores} cores - Good ✓` };
  } else if (cores >= 2) {
    return { status: 'warning', text: `${cores} cores - Minimum ⚠️` };
  } else {
    return { status: 'error', text: `${cores} cores - Too low ❌` };
  }
}

function checkBrowser(userAgent) {
  if (userAgent.includes('Chrome') || userAgent.includes('Edge')) {
    return { status: 'good', text: 'Modern browser ✓' };
  } else if (userAgent.includes('Firefox') || userAgent.includes('Safari')) {
    return { status: 'good', text: 'Compatible browser ✓' };
  } else {
    return { status: 'warning', text: 'Update recommended ⚠️' };
  }
}

function checkConnection(connection) {
  if (!connection) {
    return { status: 'warning', text: 'Cannot detect speed ⚠️' };
  }
  
  const effectiveType = connection.effectiveType;
  if (effectiveType === '4g') {
    return { status: 'good', text: '4G - Fast ✓' };
  } else if (effectiveType === '3g') {
    return { status: 'warning', text: '3G - Slow ⚠️' };
  } else if (effectiveType === '2g') {
    return { status: 'error', text: '2G - Too slow ❌' };
  } else {
    return { status: 'good', text: `${effectiveType} - Good ✓` };
  }
}

function displayResults(resultDiv, results) {
  resultDiv.innerHTML = `
    <h4 style="color: #667eea; margin-bottom: 15px; text-align: center;">
      📊 System Check Results
    </h4>
    <div class="result-item">
      <span class="result-label">Operating System:</span>
      <span class="result-value status-${results.os.status}">${results.os.text}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Available RAM:</span>
      <span class="result-value status-${results.ram.status}">${results.ram.text}</span>
    </div>
    <div class="result-item">
      <span class="result-label">CPU Cores:</span>
      <span class="result-value status-${results.cpu.status}">${results.cpu.text}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Browser:</span>
      <span class="result-value status-${results.browser.status}">${results.browser.text}</span>
    </div>
    <div class="result-item">
      <span class="result-label">Connection:</span>
      <span class="result-value status-${results.connection.status}">${results.connection.text}</span>
    </div>
    <div style="margin-top: 15px; padding: 12px; background: rgba(102,126,234,0.1); border-radius: 8px; text-align: center;">
      <strong style="color: #667eea;">
        ${getOverallStatus(results)}
      </strong>
    </div>
  `;
}

function getOverallStatus(results) {
  const statuses = Object.values(results).map(r => r.status);
  const goodCount = statuses.filter(s => s === 'good').length;
  const warningCount = statuses.filter(s => s === 'warning').length;
  const errorCount = statuses.filter(s => s === 'error').length;
  
  if (errorCount > 0) {
    return '❌ System may not meet minimum requirements';
  } else if (warningCount > 2) {
    return '⚠️ System meets basic requirements with limitations';
  } else if (goodCount >= 3) {
    return '✅ System is compatible for JARVIS!';
  } else {
    return '⚠️ System compatibility is moderate';
  }
}

// Show notification function
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existing = document.querySelectorAll('.notification');
  existing.forEach(n => n.remove());

  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#667eea'
  };
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${colors[type] || colors.info};
    color: white;
    padding: 15px 25px;
    border-radius: 25px;
    font-weight: 600;
    z-index: 10000;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Hide notification
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 4000);
}

// Check Python version (simulation)
function checkPython() {
  showNotification('Python version check requires terminal access', 'warning');
}

// Download system checker
function downloadSystemChecker() {
  const content = `
JARVIS System Requirements Checker
=================================

To check your system manually:

1. Windows Version:
   - Press Win + R, type "winver"
   - Check if Windows 11 22H2 or later

2. RAM Check:
   - Open Task Manager (Ctrl + Shift + Esc)
   - Go to Performance > Memory
   - Check total physical memory

3. Python Check:
   - Open Command Prompt
   - Type: python --version
   - Should show Python 3.10.0

4. Storage Check:
   - Open This PC
   - Check available space on C: drive
   - Need at least 50GB free

5. GPU Check:
   - Right-click desktop > Display settings
   - Scroll down > Advanced display settings
   - Check adapter properties

Date: ${new Date().toLocaleDateString()}
  `;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'jarvis-system-check.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showNotification('System checker downloaded!', 'success');
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  console.log('JARVIS Requirements Tab loaded');
  
  // Add download checker button if needed
  const checkSection = document.querySelector('.check-section');
  if (checkSection) {
    const downloadBtn = document.createElement('button');
    downloadBtn.innerHTML = '📥 Download Checker';
    downloadBtn.className = 'check-btn';
    downloadBtn.style.marginLeft = '10px';
    downloadBtn.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    downloadBtn.onclick = downloadSystemChecker;
    checkSection.appendChild(downloadBtn);
  }
});

// Error handling
window.addEventListener('error', function(event) {
  console.error('Requirements Tab Error:', event.error);
  showNotification('Error occurred while checking system', 'error');
});
