# School Management Portal — Design Direction

## Three approaches

### 1. The Green Ledger
**Very Brief Intro:** A calm, contemporary academic operations system inspired by well-kept school records and botanical field notes. It communicates order, care, and momentum without feeling bureaucratic.

**Probability:** 0.07

### 2. Courtyard Signal
**Very Brief Intro:** A warm, community-first portal with generous daylight, illustrated campus moments, and friendly modular content. It emphasizes belonging and parent communication.

**Probability:** 0.03

### 3. Exam Studio
**Very Brief Intro:** A high-focus learning workspace that treats study and assessment as an active craft, using strong progress rhythm and editorial task views. It is energetic but deliberately restrained.

**Probability:** 0.09

## Chosen approach — The Green Ledger

### Design Movement
Contemporary editorial information design fused with subtle biophilic modernism. The portal should feel like a confident school operations desk rather than a generic SaaS dashboard.

### Core Principles
1. **Measured clarity:** Dense information is translated into readable strips, layers, and grouped activity—not walls of equal cards.
2. **Quiet authority:** Strong typography, anchored labels, and crisp dividers signal reliability without relying on corporate visual noise.
3. **Living progress:** Academic activity is expressed through organic green gradients, staggered modules, and small purposeful motion.
4. **Human stewardship:** Faces, learning imagery, and thoughtfully worded messages keep every operational feature grounded in students and families.

### Color Philosophy
White and near-white create a daylight workspace where school data can breathe. A deep evergreen is the structural anchor for navigation and decisions; fresh leaf green carries momentum, while pale mint creates low-pressure regions for learning, progress, and context. Warm neutral ink prevents the interface from feeling clinical. The brand uses green as a signal of stewardship and forward movement, not as decoration.

### Layout Paradigm
The application uses a **ledger rail**: a compact, evergreen left column as the stable operating spine, then an asymmetric main canvas built from horizontal information bands. The primary dashboard has a wide activity column and a slimmer insight column, rather than a uniform card grid. On smaller screens the rail becomes a compact top bar, with content bands preserved as an intentional reading flow.

### Signature Elements
1. **Ledger tabs:** Small uppercase section labels with a moss-green dot and finely ruled separators.
2. **Growth arcs:** Thin curved SVG-like line motifs and leaf-shaped color fields behind progress-oriented content.
3. **Record stamps:** Compact outlined metadata marks for dates, status, class, and priority.

### Interaction Philosophy
Interactions are practical and affirming. Navigation changes are immediate; hover states reveal subtle green tints and a 2px directional shift. Buttons compress slightly on press. High-value actions open focused overlays instead of sprawling secondary pages.

### Animation
Use a 180–240ms custom ease-out for surfaces and 120–160ms for controls. Dashboard bands enter with a short opacity and 6px upward stagger on first load; charts draw in gently. Avoid looping decoration. Respect reduced-motion preferences by showing final states immediately.

### Typography System
**DM Sans** is used for compact operational labels, tables, navigation, and body text. **Fraunces** is used sparingly for major page titles and student-facing encouragement, giving the portal a distinctive academic warmth. Numeric metrics use DM Sans semibold with tabular figures. Headlines should be left-aligned and split across lines only when the content benefits from editorial emphasis.

### Brand Essence
**A connected school operations and learning portal for communities that want clearer progress, kinder communication, and fewer loose ends.**

**Personality:** Assured, thoughtful, grounded.

### Brand Voice
Headlines sound like informed guidance, not generic software promotion. CTAs are concise and action-specific; microcopy explains the next useful step.

> “Every school day, accounted for.”

> “Review this week’s learning rhythm.”

### Wordmark & Logo
The mark is an open schoolhouse-book symbol: two vertical pages form a doorway, with a single rising leaf between them. It uses a bold evergreen silhouette on a transparent background and functions as the favicon. The wordmark is set in a custom letter-spaced DM Sans treatment, never in a default browser font.

### Signature Brand Color
**Ledger Green — `#176B4D`**

## Style Decisions

- The desktop portal uses a visible evergreen **ledger rail** as its operating spine; it remains present while records and activity scroll beside it.
- Data areas favour ruled bands, compact record stamps, asymmetric columns, and left-edge ledger rules over a uniform rounded-card grid.
- The schoolhouse-book/leaf mark and letter-spaced DM Sans wordmark appear in both the rail and the workspace header, establishing the brand before dashboard content.
- Growth arcs and leaf-field motifs are reserved for attendance, progress, learning rhythm, and weekly-focus areas; administrative lists remain deliberately structured and ruled.
