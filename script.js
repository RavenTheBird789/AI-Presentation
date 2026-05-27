/* ═══════════════════════════════════════════════
   THE COST OF INTELLIGENCE — script.js
   Page navigation + scroll animations
═══════════════════════════════════════════════ */

/**
 * showPage — switches the visible page and updates nav link states.
 * @param {string} pageId  - the id of the page div to show
 * @param {HTMLElement} clickedLink - the nav anchor that was clicked
 */
function showPage(pageId, clickedLink) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function(page) {
    page.classList.remove('active');
  });

  // Deactivate all nav links
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.classList.remove('active');
  });

  // Show the selected page
  var target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Activate the clicked link
  if (clickedLink) {
    clickedLink.classList.add('active');
  }
}

/**
 * Animate cards into view when they enter the viewport.
 * Uses IntersectionObserver for performance.
 */
function initScrollAnimations() {
  var style = document.createElement('style');
  style.textContent = [
    '.anim-target {',
    '  opacity: 0;',
    '  transform: translateY(22px);',
    '  transition: opacity 0.5s ease, transform 0.5s ease;',
    '}',
    '.anim-target.visible {',
    '  opacity: 1;',
    '  transform: translateY(0);',
    '}'
  ].join('\n');
  document.head.appendChild(style);

  // Attach animation class to animatable elements
  var selectors = [
    '.impact-card',
    '.solution-card',
    '.budget-card',
    '.timeline-phase',
    '.summary-table-wrap',
    '.sources-section'
  ];

  var elements = document.querySelectorAll(selectors.join(', '));
  elements.forEach(function(el) {
    el.classList.add('anim-target');
  });

  // Create the observer
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        // Stagger siblings slightly for a cascade effect
        var siblings = entry.target.parentElement
          ? Array.from(entry.target.parentElement.children).filter(function(c) {
              return c.classList.contains('anim-target');
            })
          : [];
        var index = siblings.indexOf(entry.target);
        var delay = Math.min(index * 80, 320); // max 320ms stagger
        setTimeout(function() {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(function(el) {
    observer.observe(el);
  });
}

/**
 * Re-run animation setup when a page becomes visible,
 * so newly displayed pages also animate correctly.
 */
function observePageChanges() {
  var pageObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        var page = mutation.target;
        if (page.classList.contains('active')) {
          // Re-attach observer to new page's elements
          var elements = page.querySelectorAll('.anim-target:not(.visible)');
          elements.forEach(function(el) {
            // Small timeout to let layout settle after display change
            setTimeout(function() {
              el.classList.add('visible');
            }, 100);
          });
        }
      }
    });
  });

  document.querySelectorAll('.page').forEach(function(page) {
    pageObserver.observe(page, { attributes: true });
  });
}

/**
 * Highlight active nav link based on current visible page on load.
 */
function syncNavOnLoad() {
  var activePage = document.querySelector('.page.active');
  if (!activePage) return;

  var activeId = activePage.id;
  document.querySelectorAll('.nav-link').forEach(function(link) {
    if (link.getAttribute('data-page') === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Add subtle hover depth to timeline phases for interactivity feedback.
 */
function initTimelineHovers() {
  document.querySelectorAll('.timeline-phase').forEach(function(phase) {
    phase.addEventListener('mouseenter', function() {
      this.style.boxShadow = '0 6px 28px rgba(27, 67, 50, 0.14)';
      this.style.transform = 'translateX(4px)';
      this.style.transition = 'box-shadow 0.2s, transform 0.2s';
    });
    phase.addEventListener('mouseleave', function() {
      this.style.boxShadow = '0 2px 16px rgba(27, 67, 50, 0.07)';
      this.style.transform = 'translateX(0)';
    });
  });
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', function() {
  syncNavOnLoad();
  initScrollAnimations();
  observePageChanges();
  initTimelineHovers();

  // Prevent default jump on nav link clicks (already handled by showPage)
  document.querySelectorAll('.nav-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
    });
  });
});