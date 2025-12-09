# Vulcão de Santa Barbara Shake

A Progressive Web Application (PWA) for visualizing 3D seismic activity in the Serra de Santa Bárbara region, Terceira Island, Azores, Portugal.

## 📋 Overview

This web application provides an interactive 3D visualization of recent seismic events around the Serra de Santa Bárbara volcano. It displays earthquakes from the last 30 days within a 30km radius, using data from the Portuguese Institute for Sea and Atmosphere (IPMA).

## ✨ Features

- **3D Visualization**: Interactive 3D plot showing earthquake locations, depths, and magnitudes
- **Temporal Animation**: Timeline slider and play/pause controls to view earthquakes chronologically
- **Color Coding**: Earthquakes are color-coded by age:
  - 🔴 Red: Oldest events
  - 🟡 Yellow: Intermediate events
  - 🟢 Green: Most recent events
- **Interactive List**: Clickable sidebar list of all earthquakes with details
- **Focus on Selection**: Click an earthquake in the list to focus the 3D view on it
- **Hover Interactions**: Hover over earthquakes in the 3D plot to highlight them in the list
- **Recent Event Indicator**: The most recent earthquake blinks for 5 seconds on load
- **PWA Support**: Installable as a Progressive Web App for offline access to the interface
- **Responsive Design**: Dark theme optimized for viewing seismic data

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **3D Visualization**: [Plotly.js](https://plotly.com/javascript/) (v2.35.2)
- **Data Source**: IPMA Open Data API (`https://api.ipma.pt/open-data/observation/seismic/3.json`)
- **PWA**: Service Worker for offline functionality

## 📁 Project Structure

```
vulcao-sta-barbara-shake/
├── index.html              # Main application page
├── about.html              # About page with project information
├── manifest.json           # PWA manifest configuration
├── service-worker          # Service worker for PWA functionality
├── app-logo.png            # Application logo
├── icon-192.png            # PWA icon (192x192)
├── icon-512.png            # PWA icon (512x512)
├── icone-192.png           # Alternative icon
├── ipma-logo.png           # IPMA logo
├── vost-portugal.png       # VOST Portugal logo
├── VOSTAZ_f.png            # VOSTAZ logo
└── VOSTAZ-logo.png         # VOSTAZ logo (alternative)
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser with JavaScript enabled
- Internet connection (for fetching data from IPMA API)
- A local web server (required - cannot open HTML file directly due to CORS and service worker requirements)

### Quick Start - Running Locally

**⚠️ Important:** This application must be served via HTTP/HTTPS. Opening `index.html` directly in a browser will not work due to:
- CORS restrictions when fetching data from IPMA API
- Service Worker requirements (must be served over HTTP)

#### Option 1: Python 3 (Recommended - Usually Pre-installed)

```bash
# Navigate to the project directory
cd vulcao-sta-barbara-shake

# Start a simple HTTP server
python3 -m http.server 8000

# Or if you have Python 2:
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

#### Option 2: Node.js (http-server)

```bash
# Install http-server globally (one time)
npm install -g http-server

# Or use npx (no installation needed)
npx http-server -p 8000

# Navigate to project directory first
cd vulcao-sta-barbara-shake
```

Then open: **http://localhost:8000**

#### Option 3: PHP

```bash
cd vulcao-sta-barbara-shake
php -S localhost:8000
```

Then open: **http://localhost:8000**

#### Option 4: VS Code Live Server Extension

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option 5: Other Options

- **Ruby:** `ruby -run -e httpd . -p 8000`
- **Docker:** Use any web server Docker image
- **Any static file server** that serves files over HTTP

### Installation (For Development)

1. Clone or download this repository:
   ```bash
   git clone <repository-url>
   cd vulcao-sta-barbara-shake
   ```

2. Choose one of the server options above and start the server

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

### Testing Different Versions

- **Version 2.0 (Current):** `http://localhost:8000/index.html`
- **Version 1.0 (Legacy):** `http://localhost:8000/index-v1.html`

### Installing as PWA

1. Open the application in a supported browser (Chrome, Edge, Safari, etc.)
2. Look for the "Install" or "Add to Home Screen" prompt
3. Follow the browser's instructions to install the app

## 📊 How It Works

### Data Processing

1. The application fetches seismic data from the IPMA API
2. Filters earthquakes:
   - Within the last 30 days
   - In the Serra de Santa Bárbara region (detected by region name matching)
   - Within 30km radius of the volcano center (38.72972°N, -27.31972°W)
3. Converts geographic coordinates (lat/lon) to local X/Y coordinates (km)
4. Color-codes earthquakes by age (normalized from oldest to newest)
5. Sorts events by recency for display

### Coordinate System

- **X/Y**: Local coordinates in kilometers, centered on Serra de Santa Bárbara
- **Z**: Depth in kilometers (negative values below surface)
- The volcano peak is marked at +1.1 km altitude

### Visualization Elements

- **Surface Plane**: Represents sea level (Z=0)
- **Volcano Cone**: 3D representation of the volcano structure
- **Compass Rose**: N/S/E/W indicators at the bottom
- **Earthquake Points**: Sized by magnitude, colored by age, positioned by location and depth

## 🎮 Usage

1. **View Earthquakes**: The sidebar lists all earthquakes with:
   - Timestamp
   - Magnitude (ML)
   - Depth (km)
   - Region name
   - Distance from center (km)

2. **Interact with 3D Plot**:
   - Rotate: Click and drag
   - Zoom: Scroll or pinch
   - Pan: Right-click and drag (or use controls)

3. **Navigate Timeline**:
   - Use the slider at the bottom to jump to specific dates
   - Click "▶ Play" to animate earthquakes chronologically
   - Click "⏸ Pause" to stop animation

4. **Focus on Earthquake**:
   - Click any earthquake in the sidebar list
   - The 3D view will animate to focus on that earthquake

5. **Hover for Details**:
   - Hover over earthquakes in the 3D plot
   - The corresponding item in the sidebar will be highlighted

## 📡 Data Source

All seismic data is provided by:
- **IPMA** - Instituto Português do Mar e da Atmosfera
- **Rede Sísmica Nacional** (National Seismic Network)
- API Endpoint: `https://api.ipma.pt/open-data/observation/seismic/3.json`

The application does not create, modify, or interpret seismic data—it only visualizes publicly available data from IPMA.

## ⚠️ Important Notes

- This application is for **informational and educational purposes only**
- It does **not** replace official information from:
  - IPMA (Instituto Português do Mar e da Atmosfera)
  - CIVISA (Centro de Informação e Vigilância Sismovulcânica dos Açores)
  - Proteção Civil (Civil Protection)
- Always refer to official sources for critical seismic information

## 👥 Credits

- **Developer**: Luís Serpa (LSerpa)
- **Location**: Developed from Faial, Azores
- **AI Assistance**: Improved with AI models
- **Support**: VOST Portugal and VOSTAZ

## 📧 Contact

For suggestions, improvements, or questions:
- 📧 Email: [azores@vost.pt](mailto:azores@vost.pt)

## 📄 License

© 2025 Luís Serpa

## 🔧 Technical Details

### Configuration Constants

Located in `index.html`:

```javascript
const CENTER_LAT = 38.72972;  // Serra de Santa Bárbara latitude
const CENTER_LON = -27.31972; // Serra de Santa Bárbara longitude
const RADIUS_KM  = 30;        // Search radius in kilometers
const PEAK_ALT_KM = 1.1;      // Volcano peak altitude
const API_URL = "https://api.ipma.pt/open-data/observation/seismic/3.json";
```

### Browser Compatibility

- Modern browsers with ES6+ support
- Service Worker support for PWA features
- WebGL support for 3D rendering (via Plotly.js)

### Known Issues

- The service worker file is named `service-worker` but referenced as `service-worker.js` in the code. Ensure your web server serves it correctly or rename the file to match.

## 🌐 Links

- [IPMA Official Website](https://www.ipma.pt)
- [VOST Portugal](https://vost.pt)
- [About Page](./about.html)

---

**Disclaimer**: This application visualizes publicly available seismic data for educational purposes. It is not an official monitoring tool and should not be used for emergency decision-making.

