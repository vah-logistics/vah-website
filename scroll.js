/* ============================================================
   VAH SCROLL BEHAVIOR  —  scroll.js
   Shared navbar scroll state for pages using components.js.
   ============================================================ */

(function () {
  function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.classList.toggle('scrolled', window.scrollY > 8);
  }

  window.addEventListener('scroll', updateNavbarState, { passive: true });
  window.addEventListener('resize', updateNavbarState);
  document.addEventListener('DOMContentLoaded', updateNavbarState);
  updateNavbarState();
})();