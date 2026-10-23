const pickupDate = new Date('2026-10-24T18:30:00-04:00');

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

const opening = document.getElementById('opening');
const skipIntro = document.getElementById('skipIntro');
const loveFloatLayer = document.getElementById('loveFloatLayer');
let introFinished = false;
let introRevealTimer;
let loveTimer;

const pad = (value) => String(value).padStart(2, '0');

function updateCountdown() {
  const remaining = pickupDate.getTime() - Date.now();
  if (remaining <= 0) {
    document.getElementById('countdown').innerHTML = '<div><strong>NOW</strong><small>pickup</small></div>';
    return;
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
}

updateCountdown();
setInterval(updateCountdown, 1000);

const photos = [...document.querySelectorAll('.loop-photo')];
const dots = [...document.querySelectorAll('.photo-dots button')];
let currentPhoto = 0;
let photoTimer;

function showPhoto(index) {
  currentPhoto = index;
  photos.forEach((photo, photoIndex) => photo.classList.toggle('active', photoIndex === index));
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
}

function startPhotoLoop() {
  clearInterval(photoTimer);
  photoTimer = setInterval(() => showPhoto((currentPhoto + 1) % photos.length), 1900);
}

const lovePhrases = ['عاشقتم', 'ASHEGHETAM', 'I love you'];
const loveColors = ['#ff665f', '#7867e6', '#e9558f', '#cf7600'];

function makeLoveNote() {
  const note = document.createElement('span');
  note.className = 'love-float';
  note.setAttribute('aria-hidden', 'true');
  note.textContent = lovePhrases[Math.floor(Math.random() * lovePhrases.length)];
  note.style.setProperty('--love-x', `${12 + Math.random() * 76}%`);
  note.style.setProperty('--love-y', `${14 + Math.random() * 70}%`);
  note.style.setProperty('--love-color', loveColors[Math.floor(Math.random() * loveColors.length)]);
  note.style.setProperty('--love-size', `${22 + Math.round(Math.random() * 22)}px`);
  note.style.setProperty('--love-rotate', `${-8 + Math.random() * 16}deg`);
  note.style.setProperty('--love-duration', `${2.5 + Math.random() * 1.1}s`);
  loveFloatLayer.appendChild(note);
  note.addEventListener('animationend', () => note.remove(), { once: true });
}

function scheduleLoveNote() {
  makeLoveNote();
  loveTimer = setTimeout(scheduleLoveNote, 1300 + Math.random() * 1700);
}

function startLoveNotes() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || loveTimer) return;
  loveTimer = setTimeout(scheduleLoveNote, 650);
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    showPhoto(Number(dot.dataset.photo));
    startPhotoLoop();
  });
});

function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  clearTimeout(introRevealTimer);
  opening.classList.add('reveal');
  setTimeout(() => {
    opening.classList.add('finished');
    document.body.classList.remove('intro-running');
    startPhotoLoop();
    startLoveNotes();
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 30 : 1450);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  finishIntro();
} else {
  introRevealTimer = setTimeout(finishIntro, 1900);
}

skipIntro.addEventListener('click', finishIntro);

function readChoice(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function saveChoice(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Choice still works for this visit. */ }
}

function selectStudy(value) {
  document.querySelectorAll('.choice').forEach((choice) => {
    const selected = choice.dataset.study === value;
    choice.classList.toggle('active', selected);
    choice.setAttribute('aria-pressed', String(selected));
  });
}

document.querySelectorAll('.choice').forEach((choice) => {
  choice.addEventListener('click', () => {
    selectStudy(choice.dataset.study);
    saveChoice('odn-study', choice.dataset.study);
  });
});

selectStudy(readChoice('odn-study') || 'starbucks');

function selectFood(value) {
  document.querySelectorAll('.food-choice').forEach((choice) => {
    const selected = choice.dataset.food === value;
    choice.classList.toggle('active', selected);
    choice.setAttribute('aria-pressed', String(selected));
  });
}

const savedFood = readChoice('odn-food');
if (savedFood) selectFood(savedFood);

const summaryModal = document.getElementById('summaryModal');
const summaryButton = document.getElementById('summaryButton');
const modalClose = document.getElementById('modalClose');
const modalOkay = document.getElementById('modalOkay');
const restaurantModal = document.getElementById('restaurantModal');
const restaurantClose = document.getElementById('restaurantClose');
const restaurantChoices = [...document.querySelectorAll('.restaurant-choice')];
const beforeRestaurant = document.getElementById('beforeRestaurant');
const afterModal = document.getElementById('afterModal');
const afterClose = document.getElementById('afterClose');
const afterOkay = document.getElementById('afterOkay');

function openSummaryModal() {
  summaryModal.hidden = false;
  modalClose.focus();
}

function closeSummaryModal() {
  summaryModal.hidden = true;
  summaryButton.focus();
}

function openRestaurantModal() {
  restaurantModal.hidden = false;
  restaurantClose.focus();
}

function closeRestaurantModal() {
  restaurantModal.hidden = true;
  document.querySelector('[data-food="before"]').focus();
}

function openAfterModal() {
  afterModal.hidden = false;
  afterClose.focus();
}

function closeAfterModal() {
  afterModal.hidden = true;
  document.querySelector('[data-food="after"]').focus();
}

function selectRestaurant(value) {
  let selectedLabel = '';
  restaurantChoices.forEach((choice) => {
    const selected = choice.dataset.restaurant === value;
    choice.classList.toggle('active', selected);
    choice.setAttribute('aria-pressed', String(selected));
    choice.textContent = selected ? 'Selected ✓' : 'Select';
    if (selected) selectedLabel = choice.dataset.label;
  });

  beforeRestaurant.hidden = !selectedLabel;
  beforeRestaurant.textContent = selectedLabel ? `Selected: ${selectedLabel}` : '';
}

restaurantChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    selectRestaurant(choice.dataset.restaurant);
    saveChoice('odn-restaurant', choice.dataset.restaurant);
    setTimeout(closeRestaurantModal, 220);
  });
});

const savedRestaurant = readChoice('odn-restaurant');
if (savedRestaurant) selectRestaurant(savedRestaurant);

document.querySelectorAll('.food-choice').forEach((choice) => {
  choice.addEventListener('click', () => {
    const food = choice.dataset.food;
    selectFood(food);
    saveChoice('odn-food', food);
    if (food === 'before') openRestaurantModal();
    if (food === 'after') openAfterModal();
  });
});

summaryButton.addEventListener('click', openSummaryModal);
modalClose.addEventListener('click', closeSummaryModal);
modalOkay.addEventListener('click', closeSummaryModal);
summaryModal.addEventListener('click', (event) => { if (event.target === summaryModal) closeSummaryModal(); });

restaurantClose.addEventListener('click', closeRestaurantModal);
restaurantModal.addEventListener('click', (event) => { if (event.target === restaurantModal) closeRestaurantModal(); });

afterClose.addEventListener('click', closeAfterModal);
afterOkay.addEventListener('click', closeAfterModal);
afterModal.addEventListener('click', (event) => { if (event.target === afterModal) closeAfterModal(); });

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  if (!restaurantModal.hidden) closeRestaurantModal();
  else if (!afterModal.hidden) closeAfterModal();
  else if (!summaryModal.hidden) closeSummaryModal();
});
