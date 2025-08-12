import axios from 'axios';
import { getCachedFurniture } from './furniture-list.js';
import { openOrderModal } from './order-modal.js';

const furniture = document.querySelector('.modal-furniture');
const modalCloseBtn = document.querySelector('.btn-close-modal');
const modalContent = document.querySelector('.content-modal-form');

export function getFurnitureById(id) {
  const item = getCachedFurniture().find(f => f._id === id);
  if (item) {
    openModal(item);
  }
}

function openModal(item) {
  modalContent.innerHTML = createModalMarkup(item);
  furniture.classList.remove('is-hidden');

  document.body.style.overflow = 'hidden';

  $(modalContent)
    .find('.raty')
    .raty({
      readOnly: true,
      half: true,
      starType: 'i',
      score: function () {
        return $(this).attr('data-score');
      },
    });

  const colorBtns = modalContent.querySelectorAll('.color-btn');
  const mainImage = modalContent.querySelector('.main-image');

  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedImage = btn.dataset.img;
      if (selectedImage && mainImage) mainImage.src = selectedImage;
    });
  });

  modalCloseBtn.addEventListener('click', closeModal);
  furniture.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscClose);
}

function closeModal() {
  furniture.classList.add('is-hidden');

  if (!document.querySelector('.modal-overlay.is-open')) {
    document.body.style.overflow = '';
  }

  modalCloseBtn.removeEventListener('click', closeModal);
  furniture.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscClose);
}

function handleOutsideClick(e) {
  if (e.target === furniture) closeModal();
}

function handleEscClose(e) {
  if (e.key === 'Escape' && !furniture.classList.contains('is-hidden'))
    closeModal();
}

document.addEventListener('click', e => {
  if (e.target.closest('.btn-order')) {
    openOrderModal();
  }
});

export function createModalMarkup(item) {
  const colorsMarkup = Array.isArray(item.color)
    ? item.color
        .map(
          (color, idx) =>
            `<button 
              class="color-btn${idx === 0 ? ' active' : ''}" 
              style="background-color:${color};" 
              data-color="${color}" 
              data-img="${item.colorImages?.[color] || item.images?.[0]}"
            ></button>`
        )
        .join('')
    : '';

  const images = Array.isArray(item.images) ? item.images.slice(0, 3) : [];
  const galleryMarkup = images
    .map((img, idx) => {
      if (idx === 0) {
        return `<img src="${img}" alt="${item.name}" class="main-image gallery-image" />`;
      }
      return `<img src="${img}" alt="${item.name}" class="thumb-image gallery-image" />`;
    })
    .join('');

  return `
    <div class="gallery">${galleryMarkup}</div>
    <div class="name-details">
      <h2 class="name">${item.name}</h2>
      <p class="type">${item.type}</p>
      <div class="details">
        <p class="price">${item.price} грн</p>
        <div class="raty" data-score="${item.rate || 0}"></div>
        <div class="colors">
          <span>Колір</span>
          <div class="color-list">${colorsMarkup}</div>
        </div>
        <p class="description">${item.description}</p>
        <p class="sizes">Розміри: ${item.sizes}</p>
        <button class="btn-order" type="button">Перейти до замовлення</button>
      </div>
    </div>
  `;
}
