# 🛡️ JARVIS Sandbox Design (v1)

## Objective
Design a secure sandbox layer for JARVIS so that commands, plugins, web actions, and file operations run with strict controls by default.

## Design Goals
- **Safe by default**: Every risky action is denied unless explicitly allowed.
- **Offline-first compatibility**: Must work even without internet.
- **Low overhead**: Lightweight checks suitable for low-end systems.
- **Modular**: Sandbox policies can evolve per feature/plugin.
- **Auditable**: Every sensitive action is logged with reason.

## Threat Model
Sandbox must protect against:
1. Accidental destructive commands (delete/format/system changes).
2. Malicious prompt injection from web content.
3. Unsafe plugin behavior (data theft, privilege escalation).
4. Unauthorized file reads (passwords, SSH keys, browser cookies).
5. Uncontrolled network calls (tracking/exfiltration).

## High-Level Architecture

```text
User Input / Voice
      |
 Intent Parser
      |
 Policy Engine  <---- Sandbox Config (JSON/YAML)
      |
 Capability Router
  |      |      |
File   Command  Network
Guard  Guard    Guard
  |      |      |
Isolated Executors (per-task process)
      |
 Result + Audit Log
```

## Core Components

### 1) Policy Engine
Central decision layer.

- Evaluates request context: user intent, source (voice/text/web), sensitivity.
- Maps actions to capability classes:
  - `read_file`
  - `write_file`
  - `run_command`
  - `network_access`
  - `device_control`
- Returns decision:
  - `ALLOW`
  - `DENY`
  - `ASK_CONFIRMATION`

### 2) File Guard
Restricts filesystem access via allowlist and denylist.

**Allowlist examples**
- `~/Music`
- `~/Documents/JarvisWorkspace`
- app-local `./data`

**Denylist examples**
- `~/.ssh`
- browser profile folders
- system dirs (`/etc`, `C:\Windows\System32`)

Rules:
- No wildcard write outside allowlist.
- Read-only mode for external folders by default.
- Max file size limit for reads to prevent data dump.

### 3) Command Guard
Protects shell execution.

- Permit only known-safe command templates.
- Block dangerous tokens: `rm -rf`, `mkfs`, `shutdown`, registry edits, etc.
- Execute in non-admin mode.
- Per-command timeout + output size cap.

### 4) Network Guard
Controls all outgoing/incoming connections.

- Default: `DENY_ALL` for plugins unless explicitly enabled.
- Domain allowlist for trusted services.
- Rate limit requests.
- Optional offline lock mode.

### 5) Plugin Sandbox
Each plugin runs in isolated process context.

- Plugin declares required capabilities in manifest.
- Runtime grants temporary scoped tokens.
- No direct unrestricted OS calls.
- Plugin memory/state separate from core runtime.

### 6) Confirmation Gateway
Human-in-the-loop for risky actions.

Trigger examples:
- Writing outside workspace
- Network upload
- Executing script downloaded from internet
- Device/IoT control command

Prompt format:
- Action
- Target
- Risk note
- One-click allow once / always / deny

### 7) Audit & Forensics Log
Append-only logs for transparency.

Log fields:
- timestamp
- user intent hash
- requested capability
- decision
- policy matched
- executor result code

## Suggested Policy Levels

| Level | Purpose | Behavior |
|------|---------|----------|
| `STRICT` | New users / unknown plugins | deny-by-default, confirmation-heavy |
| `BALANCED` | Daily assistant usage | safe defaults + selective prompts |
| `DEV` | local development/testing | broader access with full audit |

## Example Policy (JSON)

```json
{
  "mode": "BALANCED",
  "filesystem": {
    "allow_read": ["./data", "~/Documents/JarvisWorkspace", "~/Music"],
    "allow_write": ["./data", "~/Documents/JarvisWorkspace"],
    "deny": ["~/.ssh", "~/.aws", "/etc", "C:/Windows/System32"]
  },
  "commands": {
    "allowed": ["python", "notepad", "calc", "echo"],
    "blocked_patterns": ["rm -rf", "mkfs", "shutdown", "reg add"],
    "timeout_seconds": 10
  },
  "network": {
    "default": "deny",
    "allow_domains": ["api.weather.com", "wikipedia.org"],
    "max_requests_per_min": 20
  }
}
```

## Integration Plan for Current JARVIS

1. Add `sandbox/` module:
   - `policy_engine.py`
   - `guards/file_guard.py`
   - `guards/command_guard.py`
   - `guards/network_guard.py`
2. Route all action handlers through sandbox checks.
3. Add `sandbox_policy.json` in project root.
4. Add simple UI toggle in JarSetting:
   - Strict / Balanced / Dev
5. Add logs in `./data/sandbox_audit.log`.

## MVP Milestones

### Phase 1 (Fast)
- File + command guard
- Basic allowlist/denylist
- Confirmation prompts for dangerous operations

### Phase 2
- Network guard + per-domain controls
- Structured audit log viewer in settings

### Phase 3
- Full plugin manifest permissions
- Capability tokenization + per-session revocation

## Success Metrics
- 0 destructive command execution in normal mode.
- >95% routine commands pass without manual interruption.
- All blocked actions produce explainable log entries.
- Plugin permission violations are isolated without app crash.

## Notes for Future
- Add signed plugin manifests.
- Add policy learning (suggest allowlist updates after repeated safe use).
- Consider OS-native sandbox support where available (AppContainer, seccomp, etc.).
