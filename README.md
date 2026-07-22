# Trichy Vector Watch (Community-connect)

**Prototype for PHC Dengue Surveillance**

This repository contains a digital decision-support tool prototype developed for the Community Connect course and the EPICS in IEEE Poster Competition. It transitions dengue surveillance from a district-level reactive response to a ward-level proactive approach for Primary Health Centres (PHCs) in Tiruchirappalli (Trichy), Tamil Nadu, India.

## ⚠️ Important Limitations
* **Synthetic Demonstration Data:** This application does NOT use live government or IDSP data. All data is synthetic and generated for demonstration purposes only.
* **Not Predictive:** This tool does NOT use AI to predict outbreaks. Risk scores are pre-computed using a static heuristic.
* **Prototype Status:** This is a frontend-only prototype. Data persistence is limited to the browser's `LocalStorage`. 

## Features
* **Ward Map & Priority List:** Visual and tabular representations of dengue risk across synthetic wards.
* **Bilingual UI:** Full support for English and Tamil.
* **Observation Form:** Allows PHC workers to submit field observations (updates locally).
* **Progressive Web App (PWA):** Can be installed and supports basic offline caching.
* **Responsive Dark Mode UI:** Designed using modern CSS, strictly without external frameworks (No React/Bootstrap/Tailwind).

## Tech Stack
* HTML5, CSS3, Vanilla JavaScript
* Chart.js (via CDN)
* Python (for synthetic data generation)

## Running the Application
No build tools or servers are required. Simply clone the repository and open `index.html` in any modern web browser.
