# Sky Sports Football Tactics Board (MNF Analysis Engine)

A broadcast-grade football tactics board web application inspired by **Sky Sports' Monday Night Football (MNF)**. Built with React, TypeScript, Vite, Tailwind CSS, SVG graphics, and WebRTC peer-to-peer real-time synchronization.

---

## 🌟 Key Features

### 1. Dual-Screen "TV Display + Mobile Remote"
No tablet or iPad needed!
- **TV Display View (`/` or `?mode=tv`):**
  - Pristine 16:9 4K pitch graphics with zero menu clutter.
  - Generates a **QR Code** and 4-digit room code for instant phone pairing.
  - 60fps animations, glowing spotlights, and laser passing lines.
- **Mobile Touch Controller (`?mode=remote`):**
  - Handheld touch trackpad to drag players and the ball with haptic feedback.
  - 1-tap formation switcher (4-3-3, 4-2-3-1, 3-5-2, 5-3-2, etc.).
  - Pundit tool palette (Spotlight, Curved Run, Laser Pass, Defensive Compactness, Distance Tape).
  - Tactical keyframe timeline with **"Play Replay"** trigger.

### 2. The High-Def Football Pitch
- Official FIFA pitch markings: penalty boxes, 6-yard boxes, center circle, penalty arcs ("D"), corner arcs.
- Alternating lawn-mow grass stripes.
- **Tactical 5 Vertical Channels:** Left Wing, Left Half-Space, Central Corridor, Right Half-Space, Right Wing.
- **Camera Perspectives:** Top-Down 2D and 2.5D Stadium Broadcast perspective.

### 3. Sky Sports Pundit Tools
- 🔦 **Spotlight / Halo:** Focus overhead stadium floodlight beams on an individual key player with dimmed pitch backdrop.
- 🏃 **Curved Run Arrows:** Tactical runs (wingers cutting inside, fullbacks overlapping).
- ⚡ **Laser Pass Lines:** Animated dashed pass lines directly to target.
- 🛡️ **Defensive Block Compactness:** Shaded polygon visualizing defensive lines and spacing between lines.
- 📏 **Distance Measurement:** Live distance tape between players in meters (e.g. `14.2m`).
- ✍️ **Telestrator Pen:** Freehand drawing on the pitch.

### 4. Tactical Keyframe Animation & Replay
- Record Phase 1 (initial setup) $\rightarrow$ Move players $\rightarrow$ Record Phase 2.
- Tap **Play Replay** to watch players glide into position at 60fps on the TV screen.

### 5. AirPlay / Screen Mirroring Support
- Includes a 1-click **Clean Presentation Mode** that collapses all toolbars and UI into a single invisible corner trigger, perfect for clean screen mirroring over AirPlay.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
By default, Vite binds to `0.0.0.0:5173`, allowing any phone or TV on your local Wi-Fi to access the application.

### 3. How to Pair Your Phone with Your TV Screen

1. **On your TV screen** (or laptop connected/AirPlayed to TV):
   - Open: `http://<your-computer-ip>:5173/?mode=tv`
   - A QR Code with a 4-digit room code will appear.
2. **On your Phone**:
   - Open your phone's camera and scan the QR code (or type `http://<your-computer-ip>:5173/?room=XXXX&mode=remote`).
   - Your phone will instantly pair as the master touch deck.
3. **Analyze:**
   - Drag players on your phone trackpad, switch formations, trigger spotlights, and hit **Play Replay** to watch it happen live on your TV!

---

## 🛠️ Tech Stack
- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **Realtime Sync:** WebRTC (PeerJS DataChannels) + BroadcastChannel API
- **Graphics:** High-DPI Scalable Vector Graphics (SVG) with floodlight masks and bezier curves
