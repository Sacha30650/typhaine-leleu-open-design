const captions = [
  'Écoute et présence','Au cœur du lien','Un toucher juste','Connexion profonde',
  'Soin énergétique','Confiance partagée','Rencontre sensible','Douceur du vivant',
  'Apaisement','En harmonie','Une histoire unique','Présence authentique',
  'Au rythme de l’animal','Échange intuitif','Comprendre autrement','Équilibre',
  'Dans l’instant','Lien gardien-animal','Bienveillance','Sérénité retrouvée',
  'À l’écoute','Respect du vivant','Confiance','Ensemble'
];

const gallery = document.querySelector('#gallery-grid');
captions.forEach((caption, index) => {
  const button = document.createElement('button');
  button.className = 'gallery-item';
  button.type = 'button';
  button.dataset.index = String(index);
  button.setAttribute('aria-label', `Agrandir la photo : ${caption}`);
  const image = document.createElement('img');
  image.src = `assets/images/gallery-${String(index + 1).padStart(2, '0')}.webp`;
  image.alt = caption;
  image.loading = index < 4 ? 'eager' : 'lazy';
  button.append(image);
  gallery.append(button);
});

const more = document.querySelector('#gallery-more');
more.addEventListener('click', () => {
  const expanded = gallery.classList.toggle('expanded');
  more.innerHTML = expanded ? 'Réduire la galerie <span>−</span>' : 'Voir les 24 photos <span>＋</span>';
});

const lightbox = document.querySelector('#lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
gallery.addEventListener('click', event => {
  const item = event.target.closest('.gallery-item');
  if (!item) return;
  const index = Number(item.dataset.index);
  lightboxImage.src = `assets/images/gallery-${String(index + 1).padStart(2, '0')}.webp`;
  lightboxImage.alt = captions[index];
  lightboxCaption.textContent = captions[index];
  lightbox.showModal();
});
lightbox.querySelector('button').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  document.body.classList.remove('menu-open');
  toggle.setAttribute('aria-expanded', 'false');
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

const header = document.querySelector('.site-header');
const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 92);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

const heroPhoto = document.querySelector('#hero-photo');
const moveLens = event => {
  const rect = heroPhoto.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));
  heroPhoto.style.setProperty('--x', `${x}px`);
  heroPhoto.style.setProperty('--y', `${y}px`);
};
heroPhoto.addEventListener('pointermove', moveLens, { passive: true });
