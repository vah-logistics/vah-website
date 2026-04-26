/* ============================================================
   VAH SHARED COMPONENTS  —  components.js
   Include on EVERY page before scroll.js:
     <script src="components.js"></script>
     <script src="scroll.js"></script>

   REQUIRES these elements to exist in the page HTML:
     <div id="vah-navbar"></div>     ← navbar injection target
     <div id="vah-footer"></div>     ← footer injection target
     <div id="vah-modal"></div>      ← ticket modal injection target

   EXPOSES the global function:
     openModal(eventData)  — call from any "Tickets" button
   ============================================================ */

(function () {

  /* ══════════════════════════════════════════════════════════
     1.  NAVBAR HTML
  ══════════════════════════════════════════════════════════ */
  const navbarHTML = `
    <header class="navbar">
      <div class="nav-left">
        <a href="index.html">
          <img src="assets/logo.avif" alt="Virtual Arts for Humanity" class="logo"/>
        </a>
      </div>
      <nav class="nav-links">
        <a href="index.html"   data-page="index">Home</a>
        <a href="events.html"  data-page="events">Events</a>
        <a href="gallery.html" data-page="gallery">Gallery</a>
        <a href="about.html"   data-page="about">About</a>
        <!--
          CONTACT → Instagram
          Replace the href below with your Instagram URL.
          Using <a> instead of <button> so it opens a real link.
        -->
        <a href="https://www.instagram.com/YOUR_HANDLE"
           target="_blank" rel="noopener"
           class="btn btn-outline">Contact</a>
      </nav>
    </header>
  `;

  /* ══════════════════════════════════════════════════════════
     2.  FOOTER HTML
  ══════════════════════════════════════════════════════════ */
  const footerHTML = `
    <footer class="footer">
      <div class="footer-left">
        <!--
          Contact → Instagram (blank href — fill in your URL)
        -->
        <a href="https://www.instagram.com/YOUR_HANDLE"
           target="_blank" rel="noopener"
           class="btn btn-outline">Contact</a>

        <!--
          Get Involved → Google Form (blank href — fill in your URL)
        -->
        <a href="https://forms.google.com/YOUR_FORM_ID"
           target="_blank" rel="noopener"
           class="btn btn-outline">Get Involved</a>
      </div>

      <div class="footer-center">
        <a href="index.html">
          <img src="assets/logo.avif" alt="Virtual Arts for Humanity"/>
        </a>
        <div class="footer-social">
          <!-- Replace # with real URLs -->
          <a href="https://www.instagram.com/YOUR_HANDLE" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://facebook.com/YOUR_PAGE" target="_blank" rel="noopener" aria-label="Facebook">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="https://youtube.com/YOUR_CHANNEL" target="_blank" rel="noopener" aria-label="YouTube">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
            </svg>
          </a>
          <a href="https://tiktok.com/@YOUR_HANDLE" target="_blank" rel="noopener" aria-label="TikTok">
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.05a8.16 8.16 0 0 0 4.77 1.52V7.12a4.85 4.85 0 0 1-1-.43z"/>
            </svg>
          </a>
        </div>
        <p class="copyright">©2021 by Virtual Arts for Humanity</p>
      </div>

      <div class="footer-right">
        <a href="index.html">Home</a>
        <a href="events.html">Events</a>
        <a href="gallery.html">Gallery</a>
        <a href="about.html">About</a>
      </div>
    </footer>
  `;

  /* ══════════════════════════════════════════════════════════
     3.  TICKET MODAL HTML
     Injected once. JS populates content dynamically via
     openModal(). Styles live in vah-global.css (.modal-overlay).
  ══════════════════════════════════════════════════════════ */
  const modalHTML = `
    <div class="modal-overlay" id="ticketModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="modal-box">
        <button class="modal-close" id="modalClose" aria-label="Close">&#x2715;</button>
        <p class="modal-badge" id="modalCategory">Category</p>
        <h2 class="modal-title" id="modalTitle">Event Title</h2>
        <div class="modal-meta">
          <span>&#128337; <span id="modalTime">Time</span></span>
          <span>&#128205; <span id="modalVenue">Venue</span></span>
        </div>
        <hr class="modal-divider"/>
        <div class="modal-price-row">
          <span class="modal-price-label">Tickets from</span>
          <span class="modal-price-value" id="modalPrice">$00</span>
        </div>
        <div class="modal-actions">
          <!--
            TICKET PURCHASE LINK — leave href blank until ticketing URL is known.
            This is an <a> tag styled as a button so it navigates to the
            ticketing platform (e.g. Eventbrite, PayPal) in a new tab.
          -->
          <a id="modalTicketLink"
             href=""
             target="_blank" rel="noopener"
             class="btn btn-accent">Get Tickets →</a>

          <!--
            DONATE via Zelle — blank href, fill in your Zelle deep-link or landing page.
            Zelle doesn't have a universal deep-link standard; use your bank's link or
            a page that shows your Zelle handle (e.g. zellepay.com/pay/YOUR_EMAIL).
          -->
          <a href="https://enroll.zellepay.com/pay-with-zelle"
             target="_blank" rel="noopener"
             class="btn btn-outline">Donate via Zelle</a>
        </div>
      </div>
    </div>
  `;

  /* ══════════════════════════════════════════════════════════
     4.  INJECT INTO PAGE
  ══════════════════════════════════════════════════════════ */
  const navSlot    = document.getElementById('vah-navbar');
  const footerSlot = document.getElementById('vah-footer');
  const modalSlot  = document.getElementById('vah-modal');

  if (navSlot)    navSlot.innerHTML    = navbarHTML;
  if (footerSlot) footerSlot.innerHTML = footerHTML;
  if (modalSlot)  modalSlot.innerHTML  = modalHTML;

  /* ══════════════════════════════════════════════════════════
     5.  ACTIVE NAV LINK
     Reads the filename and marks the matching link "active".
  ══════════════════════════════════════════════════════════ */
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  const pageKey  = filename.replace('.html', '');
  document.querySelectorAll('.nav-links a[data-page]').forEach(link => {
    if (link.dataset.page === pageKey) link.classList.add('active');
  });

  /* ══════════════════════════════════════════════════════════
     6.  TICKET MODAL LOGIC

     Call openModal(eventData) from any card's ticket button.
     eventData shape:
       {
         category: "Dance",
         title:    "Rivah Festival",
         time:     "7:00 PM – 10:00 PM",
         venue:    "Jones Hall, Houston TX",
         price:    "$25",
         ticketUrl: "https://eventbrite.com/e/YOUR_EVENT"
       }
  ══════════════════════════════════════════════════════════ */
  window.openModal = function (eventData) {
    const overlay = document.getElementById('ticketModal');
    if (!overlay) return;

    // Populate content
    document.getElementById('modalCategory').textContent   = eventData.category  || '';
    document.getElementById('modalTitle').textContent      = eventData.title      || 'Event';
    document.getElementById('modalTime').textContent       = eventData.time       || '—';
    document.getElementById('modalVenue').textContent      = eventData.venue      || '—';
    document.getElementById('modalPrice').textContent      = eventData.price      || '—';
    document.getElementById('modalTicketLink').href        = eventData.ticketUrl  || '#';

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  };

  // Close handlers (attached after injection so elements exist)
  document.addEventListener('click', function (e) {
    const overlay = document.getElementById('ticketModal');
    if (!overlay) return;
    // Close on × button OR clicking the dark backdrop
    if (e.target.id === 'modalClose' || e.target === overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const overlay = document.getElementById('ticketModal');
      if (overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

})();
