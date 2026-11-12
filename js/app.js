/**
 * StyleStory — Outfit Planner
 * app.js — Vanilla JS, no frameworks
 *
 * Sections:
 *  1. Data — wardrobe items, inspiration cards
 *  2. Helpers — toast, localStorage
 *  3. Navbar — scroll behaviour, hamburger, active links
 *  4. Wardrobe — render cards, filter
 *  5. Planner — render days, modal
 *  6. Builder — live preview, save/clear
 *  7. Inspiration — render cards, like toggle
 *  8. Scroll reveal animation
 *  9. Init
 */

'use strict';

/* ═══════════════════════════════════════════════════
   1. DATA
═══════════════════════════════════════════════════ */

/** Wardrobe items — pre-populated sample collection */
const WARDROBE_ITEMS = [
  // TOPS
  { id: 'w01', name: 'White Linen Blouse',    emoji: '👚', category: 'tops',        color: 'White' },
  { id: 'w02', name: 'Classic Black Tee',     emoji: '🖤', category: 'tops',        color: 'Black' },
  { id: 'w03', name: 'Floral Sundress',       emoji: '👗', category: 'tops',        color: 'Multi' },
  { id: 'w04', name: 'Striped Shirt',         emoji: '👕', category: 'tops',        color: 'Blue & White' },
  // BOTTOMS
  { id: 'w05', name: 'High-Rise Jeans',       emoji: '👖', category: 'bottoms',     color: 'Indigo' },
  { id: 'w06', name: 'Pleated Midi Skirt',    emoji: '🩱', category: 'bottoms',     color: 'Blush' },
  { id: 'w07', name: 'Tailored Trousers',     emoji: '🩲', category: 'bottoms',     color: 'Charcoal' },
  // SHOES
  { id: 'w08', name: 'Block-Heel Pumps',      emoji: '👠', category: 'shoes',       color: 'Nude' },
  { id: 'w09', name: 'White Sneakers',        emoji: '👟', category: 'shoes',       color: 'White' },
  { id: 'w10', name: 'Strappy Sandals',       emoji: '🩴', category: 'shoes',       color: 'Tan' },
  // ACCESSORIES
  { id: 'w11', name: 'Leather Tote',          emoji: '👜', category: 'accessories', color: 'Camel' },
  { id: 'w12', name: 'Wide-Brim Hat',         emoji: '👒', category: 'accessories', color: 'Straw' },
  { id: 'w13', name: 'Cat-Eye Sunglasses',    emoji: '🕶️', category: 'accessories', color: 'Tortoise' },
  // OUTERWEAR
  { id: 'w14', name: 'Camel Trench Coat',     emoji: '🧥', category: 'outerwear',   color: 'Camel' },
  { id: 'w15', name: 'Cosy Knit Scarf',       emoji: '🧣', category: 'outerwear',   color: 'Cream' },
];

/** Days of the week for the planner */
const DAYS = [
  { key: 'mon', label: 'Mon', date: 11 },
  { key: 'tue', label: 'Tue', date: 12 },
  { key: 'wed', label: 'Wed', date: 13 },
  { key: 'thu', label: 'Thu', date: 14 },
  { key: 'fri', label: 'Fri', date: 15 },
  { key: 'sat', label: 'Sat', date: 16 },
  { key: 'sun', label: 'Sun', date: 17 },
];

/** Pre-filled sample planner outfits */
const DEFAULT_PLANNER = {
  mon: { name: 'Office Chic',    top: 'w01', bottom: 'w05', shoes: 'w08', acc: 'w11' },
  wed: { name: 'Casual Day',     top: 'w04', bottom: 'w05', shoes: 'w09', acc: 'w12' },
  fri: { name: 'Evening Glam',   top: 'w03', bottom: 'w05', shoes: 'w08', acc: 'w11' },
};

/** Style inspiration lookbook */
const INSPIRATION_CARDS = [
  {
    id: 'i01',
    name: 'Sunday Brunch',
    desc: 'Relaxed and effortless — a floral dress, straw hat, and strappy sandals for a lazy weekend morning.',
    emojis: ['🌸','👗','👒'],
    tags: ['Casual', 'Weekend'],
    bg: 'inspo-bg--1',
    liked: false,
  },
  {
    id: 'i02',
    name: 'Power Office',
    desc: 'Command the boardroom with tailored trousers, a crisp blouse, block heels, and a structured tote.',
    emojis: ['💼','👚','👖'],
    tags: ['Office', 'Smart'],
    bg: 'inspo-bg--2',
    liked: false,
  },
  {
    id: 'i03',
    name: 'Golden Hour',
    desc: 'Warm-toned ensemble for a magical evening — nude pumps, pleated skirt, and cat-eye sunnies.',
    emojis: ['✨','👠','🕶️'],
    tags: ['Evening', 'Glam'],
    bg: 'inspo-bg--3',
    liked: false,
  },
  {
    id: 'i04',
    name: 'City Explorer',
    desc: 'Comfortable yet stylish city look: white sneakers, high-rise jeans, a classic tee, and a tote bag.',
    emojis: ['🏙️','👟','👜'],
    tags: ['Casual', 'Street'],
    bg: 'inspo-bg--4',
    liked: false,
  },
  {
    id: 'i05',
    name: 'Autumn Layers',
    desc: 'Embrace the season with a camel trench, cozy scarf, and warm tones that feel like a warm hug.',
    emojis: ['🍂','🧥','🧣'],
    tags: ['Autumn', 'Layered'],
    bg: 'inspo-bg--5',
    liked: false,
  },
  {
    id: 'i06',
    name: 'Beach Luxe',
    desc: 'Effortlessly chic beach day — sundress, wide-brim hat, strappy sandals, and oversized sunnies.',
    emojis: ['🌊','👙','👒'],
    tags: ['Summer', 'Vacation'],
    bg: 'inspo-bg--6',
    liked: false,
  },
];

/* ═══════════════════════════════════════════════════
   2. HELPERS
═══════════════════════════════════════════════════ */

/** Show a toast notification */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/** Load data from localStorage with a fallback */
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/** Save data to localStorage */
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn('localStorage unavailable');
  }
}

/** Find a wardrobe item by id */
function findItem(id) {
  return WARDROBE_ITEMS.find(item => item.id === id) || null;
}

/** Get emoji for a wardrobe item id (returns '' if not found) */
function emojiOf(id) {
  if (!id) return '';
  const item = findItem(id);
  return item ? item.emoji : '';
}

/** Build a readable emoji string for an outfit */
function outfitEmojis(outfit) {
  if (!outfit) return '';
  return [outfit.top, outfit.bottom, outfit.shoes, outfit.acc]
    .map(emojiOf)
    .filter(Boolean)
    .join(' ');
}

/* ═══════════════════════════════════════════════════
   3. NAVBAR
═══════════════════════════════════════════════════ */

function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = navLinks.querySelectorAll('.nav-link');

  /* Scroll — add background + highlight active section */
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled background
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Hamburger toggle */
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  /* Close mobile menu on link click */
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

/* ═══════════════════════════════════════════════════
   4. WARDROBE
═══════════════════════════════════════════════════ */

function initWardrobe() {
  const grid      = document.getElementById('wardrobeGrid');
  const filterBar = document.getElementById('filterBar');

  /** Render all wardrobe cards */
  function renderCards() {
    grid.innerHTML = '';
    WARDROBE_ITEMS.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'clothing-card reveal';
      card.dataset.category = item.category;
      card.style.transitionDelay = `${idx * 40}ms`;

      card.innerHTML = `
        <span class="card-emoji">${item.emoji}</span>
        <span class="card-name">${item.name}</span>
        <div class="card-badges">
          <span class="badge badge--category">${capitalise(item.category)}</span>
          <span class="badge badge--color">${item.color}</span>
        </div>
        <button class="card-add-btn" data-id="${item.id}">+ Add to Outfit</button>
      `;

      /* "Add to Outfit" sets the builder selectors */
      card.querySelector('.card-add-btn').addEventListener('click', e => {
        e.stopPropagation();
        addToBuilder(item);
      });

      grid.appendChild(card);
    });

    // Trigger reveal for newly added cards
    observeReveal();
  }

  /** Filter cards by category */
  function applyFilter(filter) {
    const cards = grid.querySelectorAll('.clothing-card');
    cards.forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  /** Filter button clicks */
  filterBar.addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyFilter(btn.dataset.filter);
  });

  renderCards();
}

/** Capitalise first letter */
function capitalise(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ═══════════════════════════════════════════════════
   5. WEEKLY PLANNER
═══════════════════════════════════════════════════ */

// Planner state — persisted in localStorage
let plannerData = loadFromStorage('ss_planner', { ...DEFAULT_PLANNER });
let activeDayKey = null; // which day is being edited in the modal

function initPlanner() {
  const grid = document.getElementById('plannerGrid');
  renderPlannerGrid(grid);
  initPlannerModal();
}

function renderPlannerGrid(grid) {
  grid.innerHTML = '';

  DAYS.forEach(day => {
    const outfit  = plannerData[day.key] || null;
    const hasOutfit = !!outfit;

    const col = document.createElement('div');
    col.className = `planner-day reveal ${hasOutfit ? 'has-outfit' : ''}`;
    col.dataset.day = day.key;

    let previewHTML = '';
    if (hasOutfit) {
      previewHTML = `
        <div class="day-outfit-preview">
          <div class="day-emoji-row">${emojiOf(outfit.top)}</div>
          <div class="day-emoji-row">${emojiOf(outfit.bottom)}</div>
          <div class="day-emoji-row">${emojiOf(outfit.shoes)}</div>
          ${outfit.acc ? `<div class="day-emoji-row">${emojiOf(outfit.acc)}</div>` : ''}
          <div class="day-outfit-name">${outfit.name || 'My Outfit'}</div>
        </div>
      `;
    } else {
      previewHTML = `
        <div class="day-outfit-preview" style="opacity:0.3; font-size:2rem; flex:1; display:flex; align-items:center;">
          👗
        </div>
      `;
    }

    col.innerHTML = `
      <span class="day-label">${day.label}</span>
      <span class="day-date">${day.date}</span>
      ${previewHTML}
      <div class="day-add-btn ${hasOutfit ? 'editing' : ''}">${hasOutfit ? '✎' : '+'}</div>
    `;

    col.addEventListener('click', () => openPlannerModal(day));
    grid.appendChild(col);
  });

  observeReveal();
}

function initPlannerModal() {
  const overlay    = document.getElementById('plannerModal');
  const closeBtn   = document.getElementById('modalClose');
  const cancelBtn  = document.getElementById('modalCancel');
  const saveBtn    = document.getElementById('modalSave');

  // Populate modal dropdowns
  populateModalDropdowns();

  // Live preview update
  ['modalTop','modalBottom','modalShoes','modalAccessory'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateModalPreview);
  });

  closeBtn.addEventListener('click',  closePlannerModal);
  cancelBtn.addEventListener('click', closePlannerModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closePlannerModal();
  });

  saveBtn.addEventListener('click', () => {
    const top  = document.getElementById('modalTop').value;
    const bot  = document.getElementById('modalBottom').value;
    const shoe = document.getElementById('modalShoes').value;
    const acc  = document.getElementById('modalAccessory').value;

    if (!top && !bot && !shoe) {
      showToast('Pick at least one item! 👆');
      return;
    }

    // Build a default name from items
    const topItem = findItem(top);
    const name = topItem ? `${topItem.name} Look` : 'My Look';

    plannerData[activeDayKey] = { name, top, bottom: bot, shoes: shoe, acc };
    saveToStorage('ss_planner', plannerData);

    // Re-render planner
    renderPlannerGrid(document.getElementById('plannerGrid'));
    closePlannerModal();
    showToast(`Outfit saved to ${activeDayKey.charAt(0).toUpperCase() + activeDayKey.slice(1)}! 📅`);
  });
}

function populateModalDropdowns() {
  const categories = {
    modalTop:       'tops',
    modalBottom:    'bottoms',
    modalShoes:     'shoes',
    modalAccessory: 'accessories',
  };

  Object.entries(categories).forEach(([selectId, cat]) => {
    const sel = document.getElementById(selectId);
    // Clear all but the placeholder
    while (sel.options.length > 1) sel.remove(1);

    WARDROBE_ITEMS
      .filter(item => item.category === cat || item.category === 'outerwear')
      .forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.emoji} ${item.name}`;
        sel.appendChild(opt);
      });
  });
}

function openPlannerModal(day) {
  activeDayKey = day.key;

  document.getElementById('modalTitle').textContent = `Plan your outfit for ${day.label}`;
  const overlay = document.getElementById('plannerModal');

  // Pre-fill if outfit exists
  const existing = plannerData[day.key];
  document.getElementById('modalTop').value       = existing?.top    || '';
  document.getElementById('modalBottom').value    = existing?.bottom || '';
  document.getElementById('modalShoes').value     = existing?.shoes  || '';
  document.getElementById('modalAccessory').value = existing?.acc    || '';

  updateModalPreview();
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closePlannerModal() {
  document.getElementById('plannerModal').classList.remove('open');
  document.body.style.overflow = '';
  activeDayKey = null;
}

function updateModalPreview() {
  const top  = document.getElementById('modalTop').value;
  const bot  = document.getElementById('modalBottom').value;
  const shoe = document.getElementById('modalShoes').value;
  const acc  = document.getElementById('modalAccessory').value;

  const emojis = [top, bot, shoe, acc].map(emojiOf).filter(Boolean).join(' ');
  const el = document.getElementById('modalPreviewEmojis');

  if (emojis) {
    el.textContent = emojis;
    el.classList.add('has-emojis');
  } else {
    el.textContent = 'Pick items above to preview 👆';
    el.classList.remove('has-emojis');
  }
}

/* ═══════════════════════════════════════════════════
   6. OUTFIT BUILDER
═══════════════════════════════════════════════════ */

// Saved outfits state
let savedOutfits = loadFromStorage('ss_savedOutfits', []);

function initBuilder() {
  populateBuilderDropdowns();

  // Listen for select changes → update live preview
  ['selectTop','selectBottom','selectShoes','selectAccessory'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateBuilderPreview);
  });

  // Outfit name input
  document.getElementById('outfitName').addEventListener('input', () => {
    const name = document.getElementById('outfitName').value.trim();
    document.getElementById('previewName').textContent = name || 'Your Outfit';
  });

  // Save button
  document.getElementById('saveOutfitBtn').addEventListener('click', saveBuilderOutfit);

  // Clear button
  document.getElementById('clearOutfitBtn').addEventListener('click', clearBuilder);

  // Render any existing saved outfits
  renderSavedOutfits();
}

function populateBuilderDropdowns() {
  const mapping = {
    selectTop:       ['tops', 'outerwear'],
    selectBottom:    ['bottoms'],
    selectShoes:     ['shoes'],
    selectAccessory: ['accessories'],
  };

  Object.entries(mapping).forEach(([selectId, cats]) => {
    const sel = document.getElementById(selectId);
    while (sel.options.length > 1) sel.remove(1);

    WARDROBE_ITEMS
      .filter(item => cats.includes(item.category))
      .forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        opt.textContent = `${item.emoji} ${item.name}`;
        sel.appendChild(opt);
      });
  });
}

function updateBuilderPreview() {
  const top  = document.getElementById('selectTop').value;
  const bot  = document.getElementById('selectBottom').value;
  const shoe = document.getElementById('selectShoes').value;
  const acc  = document.getElementById('selectAccessory').value;

  // Update mannequin slots
  const previewTop    = document.getElementById('previewTop');
  const previewBottom = document.getElementById('previewBottom');
  const previewShoes  = document.getElementById('previewShoes');
  const previewAcc    = document.getElementById('previewAcc');

  previewTop.textContent    = top  ? emojiOf(top)  : '👕';
  previewBottom.textContent = bot  ? emojiOf(bot)  : '👖';
  previewShoes.textContent  = shoe ? emojiOf(shoe) : '👟';
  previewAcc.textContent    = acc  ? emojiOf(acc)  : '—';

  // Add/remove empty class for styling
  [
    [previewTop,    top],
    [previewBottom, bot],
    [previewShoes,  shoe],
    [previewAcc,    acc],
  ].forEach(([el, val]) => {
    el.classList.toggle('empty', !val);
  });

  // Animate mannequin on change
  const mannequin = document.getElementById('mannequin');
  mannequin.style.transform = 'scale(1.04)';
  setTimeout(() => { mannequin.style.transform = ''; }, 200);
}

function saveBuilderOutfit() {
  const name  = document.getElementById('outfitName').value.trim() || 'My Outfit';
  const top   = document.getElementById('selectTop').value;
  const bot   = document.getElementById('selectBottom').value;
  const shoe  = document.getElementById('selectShoes').value;
  const acc   = document.getElementById('selectAccessory').value;

  if (!top && !bot && !shoe) {
    showToast('Choose at least one clothing item! 🛍️');
    return;
  }

  const outfit = {
    id:     `out_${Date.now()}`,
    name,
    top,
    bottom: bot,
    shoes:  shoe,
    acc,
  };

  savedOutfits.unshift(outfit);
  saveToStorage('ss_savedOutfits', savedOutfits);
  renderSavedOutfits();
  showToast(`"${name}" saved to your collection ✦`);
}

function clearBuilder() {
  ['selectTop','selectBottom','selectShoes','selectAccessory'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('outfitName').value = '';
  document.getElementById('previewTop').textContent    = '👕';
  document.getElementById('previewBottom').textContent = '👖';
  document.getElementById('previewShoes').textContent  = '👟';
  document.getElementById('previewAcc').textContent    = '—';
  document.getElementById('previewName').textContent   = 'Your Outfit';
}

function renderSavedOutfits() {
  const list = document.getElementById('savedOutfitsList');
  list.innerHTML = '';

  if (savedOutfits.length === 0) {
    list.innerHTML = '<p class="empty-state">No saved outfits yet. Build one above! 🎨</p>';
    return;
  }

  savedOutfits.forEach(outfit => {
    const item = document.createElement('div');
    item.className = 'saved-outfit-item reveal';
    item.innerHTML = `
      <span class="saved-outfit-emojis">${outfitEmojis(outfit)}</span>
      <span class="saved-outfit-name">${outfit.name}</span>
      <span class="saved-outfit-delete" data-id="${outfit.id}" title="Remove">✕</span>
    `;

    item.querySelector('.saved-outfit-delete').addEventListener('click', e => {
      const id = e.target.dataset.id;
      savedOutfits = savedOutfits.filter(o => o.id !== id);
      saveToStorage('ss_savedOutfits', savedOutfits);
      renderSavedOutfits();
      showToast('Outfit removed.');
    });

    list.appendChild(item);
  });

  observeReveal();
}

/* ═══════════════════════════════════════════════════
   7. STYLE INSPIRATION
═══════════════════════════════════════════════════ */

// Like state — persisted
let likedCards = loadFromStorage('ss_liked', {});

function initInspiration() {
  renderInspirationCards();
}

function renderInspirationCards() {
  const grid = document.getElementById('inspirationGrid');
  grid.innerHTML = '';

  INSPIRATION_CARDS.forEach((card, idx) => {
    const isLiked = !!likedCards[card.id];

    const el = document.createElement('div');
    el.className = `inspo-card reveal`;
    el.style.transitionDelay = `${idx * 60}ms`;

    el.innerHTML = `
      <div class="inspo-card-visual ${card.bg}">
        ${card.emojis.map(e => `<span>${e}</span>`).join('')}
      </div>
      <div class="inspo-card-body">
        <div class="inspo-card-tags">
          ${card.tags.map(t => `<span class="inspo-tag inspo-tag--mood">${t}</span>`).join('')}
        </div>
        <h3 class="inspo-card-name">${card.name}</h3>
        <p class="inspo-card-desc">${card.desc}</p>
        <div class="inspo-card-actions">
          <button class="try-btn" data-card-id="${card.id}">Try This Look</button>
          <button class="like-btn ${isLiked ? 'liked' : ''}" data-card-id="${card.id}"
                  aria-label="Like this look" title="${isLiked ? 'Unlike' : 'Like'}">
            ${isLiked ? '❤️' : '🤍'}
          </button>
        </div>
      </div>
    `;

    // Like button
    el.querySelector('.like-btn').addEventListener('click', e => {
      const btn = e.currentTarget;
      const id  = btn.dataset.cardId;
      likedCards[id] = !likedCards[id];
      saveToStorage('ss_liked', likedCards);
      btn.classList.toggle('liked', likedCards[id]);
      btn.textContent = likedCards[id] ? '❤️' : '🤍';
      btn.title       = likedCards[id] ? 'Unlike' : 'Like';
      if (likedCards[id]) showToast('Added to your favourites ♥');
    });

    // "Try This Look" — scroll to builder and pre-select matching items
    el.querySelector('.try-btn').addEventListener('click', () => {
      tryInspirationLook(card);
    });

    grid.appendChild(el);
  });

  observeReveal();
}

/**
 * Pre-populate the builder with items that best match
 * the inspiration card's emoji/category hints.
 */
function tryInspirationLook(card) {
  // Simple heuristic: pick first item from each category
  const categoryMap = {
    tops:        'selectTop',
    bottoms:     'selectBottom',
    shoes:       'selectShoes',
    accessories: 'selectAccessory',
  };

  ['tops','bottoms','shoes','accessories'].forEach(cat => {
    const item = WARDROBE_ITEMS.find(i => i.category === cat);
    if (item) {
      document.getElementById(categoryMap[cat]).value = item.id;
    }
  });

  // Set the outfit name
  document.getElementById('outfitName').value = card.name;
  document.getElementById('previewName').textContent = card.name;

  updateBuilderPreview();

  // Smooth scroll to builder
  document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`Loading "${card.name}" into the builder ✨`);
}

/* ═══════════════════════════════════════════════════
   8. SCROLL REVEAL
═══════════════════════════════════════════════════ */

/**
 * Uses IntersectionObserver to animate elements with class "reveal"
 * when they enter the viewport.
 */
let revealObserver = null;

function observeReveal() {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
  }

  // Observe only new, unobserved elements
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

/* ═══════════════════════════════════════════════════
   WARDROBE → BUILDER bridge
═══════════════════════════════════════════════════ */

/**
 * Called when user clicks "Add to Outfit" on a wardrobe card.
 * Sets the matching builder dropdown and scrolls to builder.
 */
function addToBuilder(item) {
  const catMap = {
    tops:        'selectTop',
    bottoms:     'selectBottom',
    shoes:       'selectShoes',
    accessories: 'selectAccessory',
    outerwear:   'selectTop', // treat outerwear as a top layer
  };

  const selectId = catMap[item.category];
  if (selectId) {
    document.getElementById(selectId).value = item.id;
    updateBuilderPreview();
    document.getElementById('builder').scrollIntoView({ behavior: 'smooth', block: 'start' });
    showToast(`${item.emoji} "${item.name}" added to your outfit builder!`);
  }
}

/* ═══════════════════════════════════════════════════
   9. INIT
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initWardrobe();
  initPlanner();
  initBuilder();
  initInspiration();
  observeReveal(); // initial pass for elements already in DOM

  // Trigger mannequin style on load
  document.getElementById('mannequin').style.transition = 'transform 0.2s ease';
});
