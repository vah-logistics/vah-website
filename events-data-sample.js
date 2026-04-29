/* ============================================================
   EVENTS DATA SAMPLE  —  events-data-sample.js
   ============================================================
   THIS FILE IS NOT USED IN PRODUCTION YET.
   It is a working reference/sample showing two things:

     A) How to connect a Google Sheet as a data source
     B) How to dynamically render the correct events layout
        based on the number of events returned

   HOW TO USE:
   1. Make your Google Sheet publicly readable (Share → Anyone
      with the link → Viewer).
   2. Publish it as a CSV:
        File → Share → Publish to web → CSV → Publish
      Copy the CSV URL — it looks like:
        https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv
   3. Paste that URL into SHEET_CSV_URL below.
   4. Replace your events-section HTML in index.html with:
        <section class="events-section" id="eventsSection">
          <p class="section-label">All Events</p>
          <div id="eventsContainer"></div>
        </section>
   5. Add this script tag at the bottom of index.html, after
      components.js and scroll.js:
        <script src="events-data.js"></script>
   ============================================================ */

/* ── STEP 1: paste your published Google Sheet CSV URL here ── */
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv';

/*
  Expected columns in your Google Sheet (header row, exact names):
    title | category | date | month | day | time | venue | price | ticketUrl | status | featured

  status values:  upcoming | free | sold-out
  featured:       TRUE for the one event you want shown as featured
*/

/* ── STEP 2: fetch and parse the CSV ─────────────────────── */
async function loadEvents() {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  let events = [];

  try {
    const res  = await fetch(SHEET_CSV_URL);
    const text = await res.text();
    events = parseCSV(text);
  } catch (err) {
    // Fallback: if fetch fails, show a friendly message
    container.innerHTML = '<p style="color:rgba(255,235,189,0.5);text-align:center;">Could not load events. Please try again later.</p>';
    console.error('Events fetch failed:', err);
    return;
  }

  renderEvents(events, container);
}

/* ── Minimal CSV parser (handles quoted commas) ───────────── */
function parseCSV(text) {
  const lines   = text.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').trim().replace(/^"|"$/g, '');
    });
    return obj;
  }).filter(e => e.title); // drop empty rows
}

/* ── STEP 3: pick layout based on event count ─────────────── */
function renderEvents(events, container) {
  const count = events.length;

  if (count === 0) {
    container.innerHTML = '<p style="color:rgba(255,235,189,0.5);text-align:center;padding:40px 0;">No upcoming events right now — check back soon!</p>';
    return;
  }

  /*
    LAYOUT RULES (matching your Figma wireframes):
      1 event  → full-width featured card + description text (Wireframe 4)
      2–4      → straight grid row (original 3-col layout)
      5+       → left half = featured card, right half = mini 2-col grid
  */
  const featured      = events.find(e => e.featured === 'TRUE') || events[0];
  const rest          = events.filter(e => e !== featured);

  if (count === 1) {
    container.innerHTML = buildFeaturedSplit(featured, []);
  } else if (count <= 4) {
    container.innerHTML = buildGrid(events);
  } else {
    container.innerHTML = buildFeaturedWithMiniGrid(featured, rest);
  }

  // After rendering, wire up modal open on each card/button
  wireModalButtons();
}

/* ── Layout builders ──────────────────────────────────────── */

/* 1 event: card left, description right */
function buildFeaturedSplit(ev) {
  return `
    <div class="events-featured-split">
      ${buildCard(ev, true)}
      <div class="events-featured-info">
        <h2 class="events-featured-title">${ev.title}</h2>
        <p class="events-featured-desc">${ev.description || ''}</p>
      </div>
    </div>`;
}

/* 2–4 events: plain grid */
function buildGrid(events) {
  return `<div class="events-grid">${events.map(e => buildCard(e, false)).join('')}</div>`;
}

/* 5+ events: featured card left, mini-grid right */
function buildFeaturedWithMiniGrid(featured, rest) {
  return `
    <div class="events-5plus">
      ${buildCard(featured, true)}
      <div class="events-mini-grid">
        ${rest.map(e => buildCard(e, false)).join('')}
      </div>
    </div>`;
}

/* Single card HTML — shared across all layouts */
function buildCard(ev, isFeatured) {
  const badgeClass = ev.status === 'free' ? 'free' : ev.status === 'sold-out' ? 'sold-out' : 'upcoming';
  const badgeLabel = ev.status === 'free' ? 'Free' : ev.status === 'sold-out' ? 'Sold Out' : 'Upcoming';
  const btnClass   = ev.status === 'free' ? 'btn-rsvp' : ev.status === 'sold-out' ? 'btn-rsvp' : 'btn-ticket';
  const btnLabel   = ev.status === 'free' ? 'RSVP' : ev.status === 'sold-out' ? 'Waitlist' : 'Tickets';
  const imageStyle = isFeatured ? 'height:200px;' : '';

  // Encode event data for inline onclick (avoids needing data attrs)
  const evJSON = encodeURIComponent(JSON.stringify({
    category: ev.category, title: ev.title,
    time: ev.time, venue: ev.venue,
    price: ev.price, ticketUrl: ev.ticketUrl
  }));

  return `
    <article class="event-card ${isFeatured ? 'events-featured-card' : ''}"
             data-event="${evJSON}">
      <div class="event-card-image" style="${imageStyle}">
        <div class="event-date-chip">
          <span class="day">${ev.day || '00'}</span>
          <span class="month">${ev.month || 'MMM'}</span>
        </div>
        <span class="event-badge ${badgeClass}">${badgeLabel}</span>
      </div>
      <div class="event-card-body">
        <span class="event-category">${ev.category || ''}</span>
        <h3 class="event-title">${ev.title || ''}</h3>
        <div class="event-meta">
          <span>&#128337; ${ev.time || ''}</span>
          <span>&#128205; ${ev.venue || ''}</span>
        </div>
      </div>
      <div class="event-card-footer">
        <span class="event-price">${ev.status === 'free' ? 'Free Admission' : ev.price || '$00'}</span>
        <button class="btn btn-pill-sm ${btnClass}" data-event="${evJSON}">${btnLabel}</button>
      </div>
    </article>`;
}

/* Wire modal open to every card and ticket button */
function wireModalButtons() {
  // Ticket/RSVP buttons
  document.querySelectorAll('[data-event]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.stopPropagation();
      try {
        const ev = JSON.parse(decodeURIComponent(this.dataset.event));
        if (typeof openModal === 'function') openModal(ev);
      } catch(_) {}
    });
  });
}

/* ── Run on DOM ready ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', loadEvents);

/*
  ============================================================
  GOOGLE SHEET SETUP INSTRUCTIONS
  ============================================================
  1. Create a new Google Sheet.
  2. Row 1 (headers, exact spelling):
       title | category | date | day | month | time | venue
       price | ticketUrl | status | featured | description
  3. Fill in one row per event. Example:
       Rivah Festival | Dance | June 14 2025 | 14 | JUN
       7:00 PM–10:00 PM | Jones Hall | $25
       https://eventbrite.com/e/123 | upcoming | TRUE
       VAH's 5th year celebration...
  4. Share: File → Share → Anyone with link → Viewer
  5. Publish: File → Share → Publish to web → Sheet1 → CSV → Publish
  6. Copy URL → paste into SHEET_CSV_URL at top of this file.

  WHY CSV INSTEAD OF THE SHEETS API?
  The published CSV URL requires no API key, no OAuth, no backend.
  It works from a plain HTML file opened from disk or any host.
  The trade-off is a ~10-second publishing delay when you edit
  the sheet; for an events calendar that's perfectly fine.

  UPDATING EVENTS:
  Just edit the Google Sheet. The page re-fetches on every load.
  No code changes needed.
  ============================================================
*/
