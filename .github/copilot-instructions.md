# Copilot Instructions for miniaturepancake.github.io

## Project Overview
Academic portfolio website built with **Jekyll** (static site generator), modernized with **MathJax 3.x**, vanilla JavaScript (no jQuery), and **CSS custom properties** for theming. Features interactive physics simulations, searchable content, and dark mode support.

## Architecture

### Core Technology Stack
- **Build:** Jekyll 3.x+ (GitHub Pages compatible)
- **Markup:** Liquid templates + Markdown
- **Styling:** SCSS with CSS custom properties (variables) for design tokens
- **Client-side:** Vanilla JavaScript (ES6+), no jQuery
- **Math rendering:** MathJax 3.2.2 (modern SVG output)
- **Icons:** Font Awesome 6.6

### Design System (CSS Variables)
Located at top of `css/stylesheet.scss`, all colors and spacing use CSS custom properties:
- **Colors:** `--color-primary` (#155F83), `--color-accent` (#800000), neutrals
- **Spacing:** `--space-1` through `--space-16` (8px increment scale)
- **Typography:** `--font-family-heading`, `--font-family-base`, etc.
- **Transitions:** `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow`
- **Dark mode:** Overrides applied when `[data-theme="dark"]` attribute set on `<html>`

**Key benefit:** Change theme globally by updating 4-5 CSS variables instead of hunting hardcoded colors.

### File Structure
```
css/stylesheet.scss          # SCSS with CSS variables, design tokens
javascript/
  navigation.js              # Modern nav toggle, dark mode, active links (no jQuery)
  search.js                  # Site search module
_plugins/
  search_index_generator.rb  # Generates /assets/search-index.json during build
_includes/
  head.html                  # MathJax 3.2.2 config, fonts, meta
  navigation.html            # Search + dark mode toggle + nav menus
_layouts/
  default.html               # Main template
  compress.html              # Compresses HTML output
_data/
  courses_*.yml              # Data-driven course lists (Jekyll loops)
teaching/applet/
  *.html                     # Self-contained applets (Wave Eq, Heat Eq, etc.)
```

## Key Features & Implementation

### 1. Dark Mode
**How it works:**
- Toggle in header (moon icon) stored in `localStorage` as `dark-mode`
- Sets `[data-theme="dark"]` on `<html>` element
- CSS variables override in `[data-theme="dark"]` block (lighter text, darker backgrounds)
- Respects system preference (`prefers-color-scheme: dark`) on first visit

**To adjust dark mode colors:** Edit `[data-theme="dark"]` block in `css/stylesheet.scss`

### 2. Site Search
**How it works:**
1. **Build time:** `_plugins/search_index_generator.rb` runs during Jekyll build, generates `/assets/search-index.json` with title + excerpt for each page
2. **Runtime:** `javascript/search.js` fetches index, filters on user input (debounced 300ms), renders results with highlighting
3. **UI:** Search box in header, dropdown shows 8 results max with title + excerpt with matched text highlighted

**To exclude pages from search:** Add `robots: false` to frontmatter

### 3. Navigation (Vanilla JavaScript)
**Old (jQuery):** Used `slideUp/slideDown`, `.addClass/.removeClass`  
**New:** 
- CSS transitions (no animation framework needed)
- `Element.classList` for state toggling
- Event listeners with proper cleanup
- Keyboard support: Escape closes menu, Arrow keys navigable (ready for enhancement)
- ARIA labels for accessibility (`aria-expanded`, `aria-label`)

**Module pattern:** `NavModule` encapsulates state, prevents global pollution

### 4. MathJax 3.2.2 (Upgraded from 2.7)
**Why:** Faster rendering, native SVG output, CommonHTML fallback, better accessibility  
**Config in `head.html`:**
```html
<script>
  MathJax = {
    tex: { inlineMath: [['$', '$']], displayMath: [['$$', '$$']] },
    svg: { fontCache: 'global' },
    startup: { pageReady: () => MathJax.typesetPromise() }
  };
</script>
<script async src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js"></script>
```
**Usage:** Just write `$...$` or `$$...$$` in Markdown/HTML, MathJax renders automatically

### 5. Responsive Design & Breakpoints
- **Mobile-first:** No breakpoint = base styles
- **Tablet:** `@media all and (max-width: 900px)` — hamburger menu visible, nav hidden
- **Desktop:** Full nav bar visible, search in header

**Key responsive containers:**
- `.main-wrapper`: `width: min(900px, 90vw)` (avoids 75% fixed width from old code)
- Header: Flexbox with gap/align for responsive spacing
- Search container: Max-width 400px on desktop, 250px on mobile

## Developer Workflows

### Running Locally
```bash
bundle install  # Install Jekyll dependencies
bundle exec jekyll serve
# Site at http://localhost:4000, auto-rebuilds on file changes
```

### Adding a New Course/Talk
1. Edit `_data/courses_[institution].yml` or `_data/talks_math.yml` (YAML structure)
2. Jekyll loops in `teaching/index.md` or respective page automatically render new entry
3. Commit → GitHub Pages publishes in ~1 minute

### Creating a New Applet
1. Copy `teaching/applet/WaveEquationSimulation.html` as template
2. Include MathJax in `<head>`: 
   ```html
   <script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"></script>
   ```
3. Use Tailwind CDN (`<script src="https://cdn.tailwindcss.com"></script>`) for quick styling (inline CSS also works)
4. Physics goes in `<canvas>` with `requestAnimationFrame` loop
5. Test with `jekyll serve`, link in `teaching/applet/index.md`

### Modifying Navigation
- **Main nav menu items:** Edit `_includes/navigation.html` (autogenerated from pages with `navigation_weight` frontmatter)
- **Subnav:** Add `has_subnav: 1` and `parentnav: ParentTitle` to page frontmatter
- **Styling:** Edit `nav#nav-main` section in `css/stylesheet.scss`

### Changing Colors
1. Find color in `:root { }` block (top of `stylesheet.scss`)
2. Update CSS variable (e.g., `--color-primary: #155F83`)
3. Both light and dark modes updated automatically if that variable is overridden in `[data-theme="dark"]`

### Adding New Pages
1. Create `.md` or `.html` file in repo root or subdirectory
2. Add frontmatter:
   ```yaml
   ---
   layout: default
   title: My Page
   navigation_weight: 5
   ---
   ```
3. If submenu item: add `parentnav: Parent Title` and `subnav_weight: 2`
4. `navigation.js` auto-highlights active link based on current URL

## Project Conventions

### Frontmatter Fields
- `layout: default` — use main template (required)
- `title:` — page title, shown in nav and browser tab
- `navigation_weight: N` — order in main menu (lower = first), omit to hide from nav
- `has_subnav: 1` — enables submenu dropdown
- `parentnav: Title` — parent menu for submenu items
- `subnav_weight: N` — order within submenu
- `robots: false` — prevent indexing by search engines

### Naming Conventions
- **SCSS files:** Lowercase with underscores (`stylesheet.scss`)
- **JS modules:** Camel case (`navigation.js`, `search.js`)
- **Data files:** Lowercase with underscores (`courses_bowdoin.yml`)
- **Applets:** Clear descriptor + "Simulation" (`WaveEquationSimulation.html`)

### Mentoring Content Pattern
Toggle-able abstracts use anchor links:
```markdown
[:Abstract](#x-name-year)
### :x name year
Brief summary hidden by default, revealed on click (Nutshell.js feature)
```

### Dark Mode Best Practices
- Use CSS variable names that describe purpose, not color (`--color-primary` not `--color-blue`)
- Test new styles in both light and dark modes: manually set `[data-theme="dark"]` in DevTools
- Avoid pure black/white in dark mode (use `#f3f4f6` for light text, `#1f2937` for background)

## Build & Deployment

### Local Build
```bash
bundle exec jekyll build
# Output in _site/ directory
```

### GitHub Pages Deploy
- Push to `master` branch → GitHub automatically runs Jekyll build
- GitHub Actions publishes `_site/` to live site
- No manual build steps needed

### Performance Checklist
- ✅ MathJax CDN w/ global font cache (reuses fonts across page)
- ✅ Lazy load Font Awesome (only on pages that use it)
- ✅ CSS variables prevent repeat color definitions
- ✅ Minimal JavaScript (no jQuery, no build step for applets)
- ✅ Search debounced to 300ms to avoid excessive filtering

## Accessibility Notes
- Navigation toggle has `aria-expanded`, `aria-label` attributes
- Search input has `aria-label`
- Dark mode toggle labeled for screen readers
- Images in applets can have `alt` text
- MathJax 3.x outputs semantic MathML for better accessibility

## Common Tasks

### Update site theme colors
Edit `:root { }` block in `css/stylesheet.scss` (lines 5-40 approx)

### Modify dark mode appearance
Edit `[data-theme="dark"] { }` block in `css/stylesheet.scss`

### Add a new data-driven section
1. Create `_data/newsection_category.yml`
2. Add Jekyll loop in appropriate `.md` file:
   ```liquid
   {% for item in site.data.newsection_category %}
     {{ item.title }} - {{ item.description }}
   {% endfor %}
   ```

### Debug search not working
Check:
1. `/assets/search-index.json` exists after `jekyll build` (generated by plugin)
2. Browser console for fetch errors in `search.js`
3. Verify `search.js` and `navigation.js` load via `defer` in `head.html`

### Customize applet styles
- Copy Tailwind CDN approach, or
- Add `<style>` block in applet HTML with custom CSS

## Future Enhancement Ideas
- Move applet CSS to external file for better performance
- Add search filters (by page type: course, talk, paper)
- Implement breadcrumb navigation for nested pages
- Add "Last updated" date to pages
- Server-side rendering of search results (faster than client-side filtering on large sites)
