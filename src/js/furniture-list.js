import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getFurnitureById } from './furniture-details-modal.js';

const BASE_URL = 'https://furniture-store.b.goit.study/api';
const categoryButtons = document.querySelectorAll('.category-card');
const furnitureList = document.querySelector('.furniture-list');
const loadMoreButton = document.querySelector('.load-more-button');
const loader = document.querySelector('.loader');

let currentCategoryId = '';
let currentPage = 1;
let cachedFurniture = [];

// Показ/скрытие лоадера
export function showLoader() {
  loader.classList.remove('hidden');
}
export function hideLoader() {
  loader.classList.add('hidden');
}

// Получение мебели с API
async function fetchFurniture(categoryId = '', page = 1, limit = 8) {
  showLoader();
  try {
    const url = categoryId
      ? `${BASE_URL}/furnitures?category=${categoryId}&limit=${limit}&page=${page}`
      : `${BASE_URL}/furnitures?limit=${limit}&page=${page}`;

    const response = await axios.get(url);
    const data = response.data;

    if (page === 1) {
      cachedFurniture = [...data.furnitures];
    } else {
      cachedFurniture = [...cachedFurniture, ...data.furnitures];
    }

    if (!data.furnitures || data.furnitures.length === 0) {
      iziToast.info({
        title: 'Увага',
        message: 'Більше товарів цієї категорії немає в наявності',
        position: 'topRight',
      });
      loadMoreButton.disabled = true;
      return;
    }

    renderFurniture(data.furnitures, page === 1);

    loadMoreButton.disabled = data.furnitures.length < limit;
  } catch (error) {
    console.error('Помилка при отриманні меблів:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити меблі. Спробуйте ще раз.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

// Рендеринг списка мебели
function renderFurniture(furnitureArray, replace = true) {
  const markup = furnitureArray
    .map(item => {
      const colorCircles = item.color
        .map(
          color =>
            `<span class="furniture-color-circle" style="background-color: ${color};"></span>`
        )
        .join('');

      return `
        <li class="furniture-card" data-id="${item._id}">
          <img src="${item.images[0]}" alt="${item.name}" class="furniture-image" />
          <h3 class="furniture-name">${item.name}</h3>
          <div class="furniture-colors">${colorCircles}</div>
          <p class="furniture-price">${item.price} грн.</p>
          <button type="button" class="details-btn">Детальніше</button>
        </li>
      `;
    })
    .join('');

  if (replace) {
    furnitureList.innerHTML = markup;
  } else {
    furnitureList.insertAdjacentHTML('beforeend', markup);
  }
}

// Получение ID категорий
async function fetchCategoriesIds() {
  try {
    const response = await fetch(`${BASE_URL}/categories`);
    const categories = await response.json();

    categoryButtons.forEach(btn => {
      const name = btn.dataset.name;
      const matched = categories.find(cat => cat.name === name);
      if (matched) {
        btn.dataset.id = matched._id;
      }
    });
  } catch (error) {
    console.error('Помилка при підставці ID категорії:', error);
    iziToast.error({
      title: 'Помилка',
      message: 'Не вдалося завантажити категорії. Спробуйте ще раз.',
      position: 'topRight',
    });
  }
}

// Настройка фильтра категорий
function setupCategoryFilter() {
  categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
      categoryButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentCategoryId = button.dataset.id || '';
      currentPage = 1;
      fetchFurniture(currentCategoryId, currentPage);
    });
  });
}

// Загрузка ещё
loadMoreButton.addEventListener('click', () => {
  currentPage += 1;
  fetchFurniture(currentCategoryId, currentPage);
});

// Кнопка "Детальніше"
furnitureList.addEventListener('click', event => {
  const detailsBtn = event.target.closest('.details-btn');
  if (detailsBtn) {
    const card = detailsBtn.closest('.furniture-card');
    const furnitureId = card?.dataset.id;
    if (furnitureId) {
      getFurnitureById(furnitureId);
    }
  }
});

// Экспорт кэша
export function getCachedFurniture() {
  return cachedFurniture;
}

// Инициализация
async function init() {
  await fetchCategoriesIds();
  setupCategoryFilter();
  fetchFurniture();
}

init();
