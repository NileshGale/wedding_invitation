# Wedding Invitation — Nurul & Vallari

A premium, interactive web-based digital wedding invitation built for **Nurul & Vallari's Wedding** on **November 15, 2026**. Designed with a luxurious, warm Indian wedding theme featuring deep wine-red/maroon colors, warm cream backgrounds, and gold accents.

---

## 📂 Project Structure & Files

- **`home.html`**: Core HTML5 document containing structural elements for the entry gate, hero section, interactive scratch cards, live countdown, moments gallery, venue details, and ambient music controls.
- **`style.css`**: Central stylesheet defining the color palette, typography (Cormorant Garamond & Montserrat), 3D envelope transitions, scrollbars, responsive grids, and section reveals.
- **`main.js`**: Core JavaScript file managing interactive states: envelope wax seal opening delay, ambient audio compliance player, canvas-based falling rose petals, canvas-based touch scratch card unlocks, live countdown calculations, and scroll reveals.
- **`couple_photo/`**: Directory containing images:
  - `photo1.png`: Envelope cover background (blurred artistically) and Hero section thumbnail.
  - `photo2.png`: Event grid background frame.
  - `photo3.png` & `photo4.png`: Moments polaroid gallery images.
- **`assets/`**: Directory for external elements:
  - `assets/venue.png`: Venue card thumbnail.

---

## 🎨 Theme & Styles (`style.css`)

### Color Palette
- **Regal Wine Red/Maroon**: `#8a4f4c` (primary), `#5c2422` / `#502220` (dark shade envelope borders).
- **Gold Accent**: `#d4af37` (shimmer headings & borders), `#e8ce73` (warm gold wax seal heart & highlights).
- **Festive Cream**: `#faf5f0` (backgrounds & invitation cards).

### Key CSS Variables
- `--primary-color`: `#8a4f4c`
- `--accent-color`: `#d4af37`
- `--bg-light`: `#faf5f0`
- `--font-serif`: `'Cormorant Garamond', serif`
- `--font-sans`: `'Montserrat', sans-serif`

---

## 🛠️ Main Components & Mechanics

### 1. Interactive Entrance Envelope (`#entry-gate`)
- **Closed State**: Locks page scrolling (`body.no-scroll`). Shows a centered 3D textured maroon envelope (`#envelope`). Directly above it, a white title pulses: **"Tap to Reveal"**. In the center of the envelope flaps, a gold-rimmed **Wax Seal Button** (`#open-btn`) displays the couple's initials **"N" and "V"** split by a gold heart icon.
- **Action**: When the guest clicks the wax seal:
  - The wax seal button immediately fades and shrinks (`scale(0)`) out of view.
  - The envelope's top flap (`.envelope__flap--top`) rotates upwards 180 degrees using 3D perspective.
  - The invitation card (`.envelope__card`) containing a gold lotus-sitting Ganesha and the couple's names slides upwards out of the envelope flaps.
  - Ambient music starts playing.
  - After a 2-second delay, the entire entry gate overlay slides upwards out of the screen (`.entry-gate.dismissed`) and scrolling is unlocked.

### 2. Live Particles Canvas (`#petals-canvas`)
- Uses an HTML5 Canvas drawing loop to create falling rose petals and floating gold dust particles. Petals sway horizontally via a `Math.sin` curve calculation and drift down the screen.

### 3. Scratch-to-Reveal Date Section (`#scratch-section`)
- **Gate Mechanic**: Hides the rest of the page (`#countdown-section`, `#gallery-section`, `#venue-section`, and `#footer-section`) initially by applying the `.scratch-locked` class to `#main-content` (hiding them with `display: none !important`). Users **must** scratch the cards to reveal the wedding date before they can scroll down.
- **Canvases**: Three separate canvases overlaying `Month`, `Day`, and `Year` boxes. They are filled with a maroon-gold gradient banner reading `"S C R A T C H"`.
- **Action**: Supports both mouse drags and touch events on mobile. Once a guest clears **40%** of a canvas, it fades out. When all 3 cards are scratched, the `.scratch-locked` class is removed, loading the remaining sections, and initiating scroll reveals.

### 4. Compact Countdown Section (`#countdown-section`)
- Displays days, hours, minutes, and seconds remaining until **November 15, 2026, at 7:00 PM**.
- styled as a compact glassmorphic card with inline numbers resting on golden lines.

### 5. Photo Polaroid Gallery (`#gallery-section`)
- Tilted card frames rotating at slight angles (`--rot`). Hover states scale cards upwards and straighten them (`rotate(0deg)`) using smooth cubic-bezier transitions.

### 6. The Venue Section (`#venue-section`)
- Displays `Rajalakshmi Kalyana Mandapam` details. Shows a venue thumbnail (`assets/venue.png`) and an ethnic styled detail card with a location view button leading directly to Google Maps coordinates.

### 7. Floating Ambient Audio Player (`#audio-btn`)
- A round glassmorphic button in the bottom left that plays/pauses the looped audio file (`#bg-music`). The SVG icon updates dynamically to show sound waves when playing or an "X" mark when muted.

---

## ✏️ How to Edit & Customize

### Change Groom & Bride Names
Open `home.html` and search for `.couple-name`, `entry-gate__names`, and `footer-name` classes to edit the text (currently **Nurul & Vallari**).

### Replace Ganesha SVG Icon
Both Ganesha SVGs (in the entry card and hero card) use custom paths inside `<svg class="entry-gate__icon">` and `<svg class="hero-icon">` in `home.html`. You can replace the inner XML paths if you wish to use a different illustration.

### Update Wedding Date & Time
1. **Countdown calculations**: Open `main.js` and change `targetDateStr` (currently `"November 15, 2026 19:00:00"`).
2. **Text displays**: Update the date labels inside `home.html` under the Countdown and Save the Date sections.

### Change Background Music
Open `home.html` and search for the `<audio>` tag:
```html
<audio id="bg-music" loop src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"></audio>
```
Replace the `src` attribute with a local file link (e.g., `assets/bg-music.mp3`) or any hosted MP3 audio link.

### Update Venue Image & Coordinates
1. Put the venue picture inside `assets/` and name it `venue.png` (or change the path inside `#venue-section` image tag).
2. To change maps directions, edit the `href` attribute inside `#venue-section`'s map anchor (`.venue-map-btn`) to point to your new coordinates.


ayesha