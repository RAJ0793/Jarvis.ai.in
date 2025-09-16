# ================================
#  J.A.R.V.I.S. Enhanced Installer
# ================================

$Host.UI.RawUI.WindowTitle = "J.A.R.V.I.S. Enhanced Installer"
Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "   🤖 J.A.R.V.I.S. Enhanced Installer" -ForegroundColor Green
Write-Host " Just A Rather Very Intelligent System" -ForegroundColor Gray
Write-Host "=============================================`n" -ForegroundColor Cyan

# Global variables
$pythonSetupSuccess = $false
$vscodeSetupSuccess = $false
$venvSetupSuccess = $false
$requirementsSuccess = $false
$jarvisSetupSuccess = $false

# --- Function: Check Python 3.10.0 Installation ---
function Test-Python310 {
    Write-Host "🐍 Checking for Python 3.10.0..." -ForegroundColor Yellow
    
    try {
        $pythonVersion = & python --version 2>$null
        if ($pythonVersion -and $pythonVersion -match "Python 3\.10\.") {
            Write-Host "✅ Python 3.10.0 found: $pythonVersion" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "❌ Python 3.10.0 not found. Current version: $pythonVersion" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Python not found or not accessible from PATH" -ForegroundColor Red
        return $false
    }
}

# --- Function: Download and Install Python 3.10.0 ---
function Install-Python310 {
    Write-Host "📥 Downloading Python 3.10.0..." -ForegroundColor Cyan
    
    $pythonUrl = "https://www.python.org/ftp/python/3.10.0/python-3.10.0-amd64.exe"
    $pythonExe = "$env:TEMP\python-3.10.0-amd64.exe"
    
    try {
        Write-Host "⬇️  Downloading from: $pythonUrl" -ForegroundColor Gray
        Invoke-WebRequest -Uri $pythonUrl -OutFile $pythonExe -UseBasicParsing
        Write-Host "✅ Download completed!" -ForegroundColor Green
        
        Write-Host "🚀 Running Python installer..." -ForegroundColor Cyan
        Write-Host "⚠️  Please complete the Python installation manually." -ForegroundColor Yellow
        Write-Host "   Make sure to check 'Add Python to PATH' option!" -ForegroundColor Yellow
        
        Start-Process -FilePath $pythonExe -Wait
        
        # Clean up
        Remove-Item $pythonExe -Force -ErrorAction SilentlyContinue
        
        Write-Host "✅ Python installer completed. Please restart this script after installation." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to download/install Python: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# --- Function: Check VS Code Installation ---
function Test-VSCode {
    Write-Host "📝 Checking for VS Code..." -ForegroundColor Yellow
    
    $vscodeCmd = Get-Command "code" -ErrorAction SilentlyContinue
    if ($vscodeCmd) {
        Write-Host "✅ VS Code found and accessible" -ForegroundColor Green
        return $true
    }
    
    # Check common installation paths
    $vscodePaths = @(
        "${env:ProgramFiles}\Microsoft VS Code\Code.exe",
        "${env:ProgramFiles(x86)}\Microsoft VS Code\Code.exe",
        "$env:LOCALAPPDATA\Programs\Microsoft VS Code\Code.exe"
    )
    
    foreach ($path in $vscodePaths) {
        if (Test-Path $path) {
            Write-Host "✅ VS Code found at: $path" -ForegroundColor Green
            return $true
        }
    }
    
    Write-Host "❌ VS Code not found" -ForegroundColor Red
    return $false
}

# --- Function: Download and Install VS Code ---
function Install-VSCode {
    Write-Host "🔍 Checking for existing VS Code installer..." -ForegroundColor Yellow
    
    # Check for existing VS Code installer in common locations
    $vscodeInstallerPaths = @(
        "$env:USERPROFILE\Downloads\VSCodeSetup.exe",
        "$env:USERPROFILE\Downloads\VSCodeUserSetup*.exe",
        "$env:USERPROFILE\Desktop\VSCodeSetup.exe",
        "$env:USERPROFILE\Desktop\VSCodeUserSetup*.exe",
        ".\VSCodeSetup.exe",
        "$env:TEMP\VSCodeSetup.exe"
    )
    
    $existingInstaller = $null
    foreach ($path in $vscodeInstallerPaths) {
        if (Test-Path $path) {
            if ($path.Contains("*")) {
                $found = Get-ChildItem -Path (Split-Path $path) -Filter (Split-Path $path -Leaf) -ErrorAction SilentlyContinue | Select-Object -First 1
                if ($found) {
                    $existingInstaller = $found.FullName
                }
            } else {
                $existingInstaller = $path
            }
            
            if ($existingInstaller) {
                Write-Host "📂 Found existing VS Code installer at: $existingInstaller" -ForegroundColor Green
                break
            }
        }
    }
    
    $vscodeExe = $existingInstaller
    
    # Download only if no existing installer found
    if (-not $existingInstaller) {
        Write-Host "📥 Downloading VS Code..." -ForegroundColor Cyan
        
        $vscodeUrl = "https://update.code.visualstudio.com/latest/win32-x64/stable"
        $vscodeExe = "$env:TEMP\VSCodeSetup.exe"
        
        try {
            Write-Host "⬇️  Downloading from: $vscodeUrl" -ForegroundColor Gray
            Invoke-WebRequest -Uri $vscodeUrl -OutFile $vscodeExe -UseBasicParsing
            Write-Host "✅ Download completed!" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Failed to download VS Code: $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    }
    
    try {
        Write-Host "🚀 Running VS Code installer..." -ForegroundColor Cyan
        Write-Host "⚠️  Please complete the VS Code installation manually." -ForegroundColor Yellow
        
        Start-Process -FilePath $vscodeExe -Wait
        
        # Clean up only if we downloaded it
        if (-not $existingInstaller) {
            Remove-Item $vscodeExe -Force -ErrorAction SilentlyContinue
        }
        
        Write-Host "✅ VS Code installer completed." -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to run VS Code installer: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# --- Function: Check if Virtual Environment Exists ---
function Check-VirtualEnv {
    Write-Host "🔍 Checking for virtual environment..." -ForegroundColor Yellow
    
    $userLocation = Read-Host "Enter the location where you want to create/check for virtual environment (or press Enter for current directory)"
    if ([string]::IsNullOrWhiteSpace($userLocation)) {
        $userLocation = Get-Location
    }
    
    $venvPath = Join-Path $userLocation "venv"
    $global:venvPath = $venvPath
    
    if (Test-Path $venvPath) {
        Write-Host "✅ Virtual environment found at: $venvPath" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "❌ Virtual environment not found at: $venvPath" -ForegroundColor Red
        return $false
    }
}

# --- Function: New Virtual Environment ---
function New-VirtualEnv {
    param($location)
    
    Write-Host "🏗️  Creating virtual environment..." -ForegroundColor Cyan
    
    try {
        Set-Location $location
        & python -m venv venv
        
        if (Test-Path "venv") {
            Write-Host "✅ Virtual environment created successfully!" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Error creating virtual environment: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# --- Function: Install Requirements ---
function Install-Requirements {
    param($venvPath)
    
    Write-Host "📦 Installing requirements..." -ForegroundColor Cyan
    
    # Priority search paths for requirements.txt
    $requirementsPaths = @(
        "B:\FILE DATA\CODE EDITOR\WEB DEVELOPMENT\JARVIS dasbord\requirements.txt",
        "P:\Jarvis_v2.0\requirements.txt",
        ".\requirements.txt",
        "$env:USERPROFILE\Desktop\requirements.txt"
    )
    
    $requirementsFile = $null
    foreach ($path in $requirementsPaths) {
        if (Test-Path $path) {
            $requirementsFile = $path
            Write-Host "📂 Found requirements.txt at: $path" -ForegroundColor Green
            break
        }
    }
    
    if (-not $requirementsFile) {
        Write-Host "❌ requirements.txt not found in any expected location" -ForegroundColor Red
        return $false
    }
    
    try {
        # Activate virtual environment and install requirements
        $activateScript = Join-Path $venvPath "Scripts\Activate.ps1"
        if (Test-Path $activateScript) {
            Write-Host "🔄 Activating virtual environment..." -ForegroundColor Yellow
            & $activateScript
            
            Write-Host "📦 Installing packages from requirements.txt..." -ForegroundColor Yellow
            & python -m pip install --upgrade pip
            & pip install -r $requirementsFile
            
            Write-Host "✅ Requirements installed successfully!" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "❌ Virtual environment activation script not found" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ Error installing requirements: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# --- Function: Find and Run JARVIS Setup Executable ---
function Find-And-Run-Setup {
    Write-Host "🔍 Searching for JARVIS setup executable..." -ForegroundColor Yellow
    
    # Priority search paths for the setup executable
    $searchPaths = @(
        "P:\Jarvis_v2.0\Assets\Output\JARVIS_Assistant_v1.1_Setup.exe",
        ".\JARVIS_Assistant_v1.1_Setup.exe",
        ".\Setup.exe",
        "$env:USERPROFILE\Desktop\JARVIS*Setup*.exe",
        "$env:USERPROFILE\Downloads\JARVIS*Setup*.exe"
    )
    
    # Search for setup executable
    $setupExe = $null
    foreach ($path in $searchPaths) {
        if (Test-Path $path) {
            $setupExe = $path
            Write-Host "📂 Found setup at: $path" -ForegroundColor Green
            break
        }
    }
    
    # If not found in specific paths, do a broader search
    if (-not $setupExe) {
        Write-Host "🔎 Performing broader search..." -ForegroundColor Yellow
        $searchLocations = @("P:\", ".\", "$env:USERPROFILE\Desktop", "$env:USERPROFILE\Downloads")
        
        foreach ($location in $searchLocations) {
            if (Test-Path $location) {
                $found = Get-ChildItem -Path $location -Filter "*Setup*.exe" -ErrorAction SilentlyContinue | 
                        Where-Object { $_.Name -like "*JARVIS*" -or $_.Name -like "*jarvis*" } | 
                        Select-Object -First 1
                
                if ($found) {
                    $setupExe = $found.FullName
                    Write-Host "📂 Found setup at: $($found.FullName)" -ForegroundColor Green
                    break
                }
            }
        }
    }
    
    # Run the setup if found
    if ($setupExe) {
        Write-Host "🚀 Running JARVIS Setup..." -ForegroundColor Cyan
        Write-Host "   File: $setupExe" -ForegroundColor Gray
        
        try {
            # Run with silent installation parameters for Inno Setup
            Start-Process -FilePath $setupExe -ArgumentList "/SILENT /SUPPRESSMSGBOXES /NORESTART" -Wait
            Write-Host "✅ JARVIS Setup completed successfully!" -ForegroundColor Green
            return $true
        }
        catch {
            Write-Host "❌ Error running setup: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "🔄 Trying to run setup normally..." -ForegroundColor Yellow
            
            try {
                Start-Process -FilePath $setupExe -Wait
                Write-Host "✅ Setup launched successfully!" -ForegroundColor Green
                return $true
            }
            catch {
                Write-Host "❌ Failed to run setup: $($_.Exception.Message)" -ForegroundColor Red
                return $false
            }
        }
    }
    else {
        Write-Host "❌ JARVIS setup executable not found!" -ForegroundColor Red
        Write-Host "   Please ensure the setup file is in one of these locations:" -ForegroundColor Yellow
        Write-Host "   - Current directory" -ForegroundColor Gray
        Write-Host "   - P:\Jarvis_v2.0\Assets\Output\" -ForegroundColor Gray
        Write-Host "   - Desktop" -ForegroundColor Gray
        Write-Host "   - Downloads folder" -ForegroundColor Gray
        return $false
    }
}

# ===========================================
#              MAIN EXECUTION
# ===========================================

Write-Host "🚀 Starting JARVIS Enhanced Installation Process..." -ForegroundColor Magenta

# Step 1: Check Python 3.10.0
if (-not (Test-Python310)) {
    Write-Host "`n⚡ Python 3.10.0 installation required..." -ForegroundColor Yellow
    if (Install-Python310) {
        Write-Host "⚠️  Please restart this script after Python installation completes." -ForegroundColor Yellow
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
    else {
        Write-Host "❌ Failed to install Python 3.10.0" -ForegroundColor Red
    }
}
else {
    $pythonSetupSuccess = $true
}

# Step 2: Check VS Code (only if Python is ready)
if ($pythonSetupSuccess) {
    if (-not (Test-VSCode)) {
        Write-Host "`n⚡ VS Code installation required..." -ForegroundColor Yellow
        $vscodeSetupSuccess = Install-VSCode
    }
    else {
        $vscodeSetupSuccess = $true
    }
}

# Step 3: Virtual Environment Setup (only if both Python and VS Code are ready)
if ($pythonSetupSuccess -and $vscodeSetupSuccess) {
    if (-not (Check-VirtualEnv)) {
        Write-Host "`n⚡ Creating new virtual environment..." -ForegroundColor Yellow
        $userLocation = Split-Path $global:venvPath -Parent
        $venvSetupSuccess = New-VirtualEnv $userLocation
    }
    else {
        $venvSetupSuccess = $true
    }
    
    # Step 4: Install Requirements (only if venv is ready)
    if ($venvSetupSuccess) {
        Write-Host "`n⚡ Installing requirements..." -ForegroundColor Yellow
        $requirementsSuccess = Install-Requirements $global:venvPath
    }
}

# Step 5: JARVIS Setup (only if everything else is ready)
if ($pythonSetupSuccess -and $vscodeSetupSuccess -and $venvSetupSuccess -and $requirementsSuccess) {
    Write-Host "`n⚡ Running JARVIS Setup..." -ForegroundColor Yellow
    $jarvisSetupSuccess = Find-And-Run-Setup
}

# ===========================================
#            FINAL STATUS REPORT
# ===========================================

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "📊 INSTALLATION SUMMARY REPORT" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Cyan

# Python Status
if ($pythonSetupSuccess) {
    Write-Host "✅ PYTHON 3.10.0: READY!" -ForegroundColor Green
} else {
    Write-Host "❌ PYTHON 3.10.0: FAILED OR MISSING" -ForegroundColor Red
}

# VS Code Status
if ($vscodeSetupSuccess) {
    Write-Host "✅ VS CODE: INSTALLED!" -ForegroundColor Green
} else {
    Write-Host "❌ VS CODE: FAILED OR MISSING" -ForegroundColor Red
}

# Virtual Environment Status
if ($venvSetupSuccess) {
    Write-Host "✅ VIRTUAL ENVIRONMENT: CREATED/READY!" -ForegroundColor Green
} else {
    Write-Host "❌ VIRTUAL ENVIRONMENT: FAILED" -ForegroundColor Red
}

# Requirements Status
if ($requirementsSuccess) {
    Write-Host "✅ REQUIREMENTS: INSTALLED!" -ForegroundColor Green
} else {
    Write-Host "❌ REQUIREMENTS: FAILED TO INSTALL" -ForegroundColor Red
}

# JARVIS Setup Status
if ($jarvisSetupSuccess) {
    Write-Host "✅ JARVIS SETUP: COMPLETED!" -ForegroundColor Green
} else {
    Write-Host "❌ JARVIS SETUP: FAILED OR SKIPPED" -ForegroundColor Red
}

Write-Host "`n📋 Detailed Installation Summary:" -ForegroundColor Yellow
Write-Host "   Python 3.10.0: $(if ($pythonSetupSuccess) {'✅ Ready'} else {'❌ Failed'})" -ForegroundColor Gray
Write-Host "   VS Code: $(if ($vscodeSetupSuccess) {'✅ Installed'} else {'❌ Failed'})" -ForegroundColor Gray
Write-Host "   Virtual Environment: $(if ($venvSetupSuccess) {'✅ Ready'} else {'❌ Failed'})" -ForegroundColor Gray
Write-Host "   Requirements: $(if ($requirementsSuccess) {'✅ Installed'} else {'❌ Not Installed'})" -ForegroundColor Gray
Write-Host "   JARVIS Setup: $(if ($jarvisSetupSuccess) {'✅ Success'} else {'❌ Failed'})" -ForegroundColor Gray

Write-Host "=============================================" -ForegroundColor Cyan

if ($pythonSetupSuccess -and $vscodeSetupSuccess -and $venvSetupSuccess -and $requirementsSuccess -and $jarvisSetupSuccess) {
    Write-Host "🎉 ALL COMPONENTS INSTALLED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "🤖 JARVIS is ready to use!" -ForegroundColor Magenta
} else {
    Write-Host "⚠️  SOME COMPONENTS FAILED TO INSTALL" -ForegroundColor Yellow
    Write-Host "   Please check the error messages above and retry." -ForegroundColor Gray
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "🤖 Thank you for using JARVIS Enhanced Installer!" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor Cyan

Write-Host "`nPress any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
