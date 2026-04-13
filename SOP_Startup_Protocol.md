# SOP: Agent Startup Protocol (The Morning Sync)

**Purpose:** To ensure every agent session begins with a high-fidelity, rapid reconstruction of the HeliosUK operational context, preventing information loss and ensuring continuity.

## 1. The Ritual (Execution Order)

Upon session initialization, the Agent MUST execute the following sequence:

### Phase A: Historical Audit (Chronology)
1. **Scan** `HeliosUK/mission_log/` for the most recent `.log` files.
2. **Read** the contents of the most recent log.
3. **Identify** recent milestones, decisions, and changes in strategy.

### Phase/B: State Reconstruction (The Battlefield)
1. **Scan** `HeliosUK/state_snapshots/` for the latest `.md` or `.json` snapshot.
2. **Load** the current "Battlefield" state:
    *   **Active Focus:** What was the last task worked on?
    *   **Blockers:** What is currently preventing progress?
    *   **Next Priority:** What is the very next actionable item?

### Phase C: Asset & Task Verification (The Ground Truth)
1. **Scan** `HeliosUK/tasks/ACTIVE_TASKS.md` to verify the current task board.
2. **Scan** `HeliosUK/infrastructure/` to verify the current deployment/credential mapping status.

## 2. Expected Output
After completing the ritual, the Agent should be able to provide a brief **"Re-Sync Summary"** to the CEO:
* "I have reviewed the logs from [Date]."
* "I am aware that [Task ID] is currently the priority."
* "I have identified [Blocker/Risk] that needs attention."

## 3. Failure Protocol
If `mission_log/` or `state_snapshots/` are missing or unreadable, the Agent must:
1. **Alert the CEO** immediately.
2. **Fall back** to a manual scan of `tasks/` and `README.md` to establish a baseline.
