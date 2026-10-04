# CampusPilot — Smart Student OS

## ALGOTHON'26 Project

CampusPilot is a local-first student command center designed around one question:

> "What should I do next, given my attendance, deadlines, energy and available time?"

### Core features
- **Attendance AI:** calculates current attendance, remaining classes, minimum classes needed and a safe leave buffer.
- **Adaptive Planner:** allocates study minutes based on priority and energy.
- **Task Engine:** local task management with priority levels and browser persistence.
- **Focus Lab:** 25-minute focus sprint timer.
- **Student Health Score:** a lightweight visual indicator combining attendance pressure and workload.
- **Responsive UI:** works on desktop and mobile.
- **No backend required:** everything runs in the browser using localStorage.

## Why it is hackathon-friendly
The event allows participants to build their own innovative/practical project. CampusPilot demonstrates a complete working prototype rather than only an idea.

## Tech stack
HTML5 + CSS3 + Vanilla JavaScript + localStorage.

No API key is required, so the demo works offline after the files are downloaded.

## Run
Open `index.html` in a browser.

For a cleaner local server:
- VS Code → install Live Server → right-click `index.html` → Open with Live Server.

## Suggested 2-minute demo
1. Open Dashboard and show the Student Health Score.
2. Go to Attendance AI and change the numbers to demonstrate the what-if calculation.
3. Open Tasks and add a high-priority assignment.
4. Open Smart Planner and generate an adaptive plan.
5. Open Focus Lab and start a sprint.

## Future scope
- AI-generated study plans using an LLM API.
- College timetable import.
- Notifications and calendar integration.
- Subject-level attendance from uploaded CSVs.
- Predictive attendance forecasting using historical attendance.
- Teacher/mentor dashboard.

## Submission pitch
"CampusPilot is a smart student OS that turns academic pressure into a concrete next action. Instead of showing students disconnected to-do lists and percentages, it combines attendance risk, workload priority, time and energy into an adaptive plan."
