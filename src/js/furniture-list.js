import axios from "axios";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { getFurnitureById } from './furniture-detalis-modal.js';

const BASE_URL = 'https://furniture-store.b.goit.study/api';
const categoryButtons = document.querySelectorAll('.category-card');
const furnitureList = document.querySelector('.furniture-list');
const loadMoreButton = document.querySelector('.load-more-button');
const loader = document.querySelector('.loader');

let currentCategoryId = '';
let currentPage = 1;
let cachedFurniture = [];

export function showLoader() {
     loader.classList.remove('hidden');
}

export function hideLoader() {
     loader.classList.add('hidden');
}
//отримуємо меблі з API
async function fetchFurniture(categoryId = '', page = 1, limit = 8) {
     
     showLoader();
     try {
          const url = categoryId
          ? `${BASE_URL}/furnitures?category=${categoryId}&limit=${limit}&page=${page}`
          : `${BASE_URL}/furnitures?limit=${limit}&page=${page}`;
          
          const response = await axios.get(url);
         const data = response.data;
         
         if (page === 1) {
  cachedFurniture = [...data.furnitures]; // якщо нова категорія або перше завантаження
} else {
  cachedFurniture = [...cachedFurniture, ...data.furnitures]; // додаємо до попередніх
}

          if (!data.furnitures || data.furnitures.length === 0) {
               iziToast.info({
                    title: 'Увага',
                    message: 'Більше товарів цієїкатегорії немає в наявності',
                    position: 'topRight'
               });
               loadMoreButton.disabled = true; // блокуємо кнопку
               return;
          }
          //відображаємо меблі
          renderFurniture(data.furnitures, page === 1);
          
          //блокуємо кнопку якщо немає більше товарів
          if (data.furnitures.length < limit) {
               loadMoreButton.disabled = true;
          } else {
               loadMoreButton.disabled = false;
          }

          } catch (error) {
          console.error('Помилка при отриманні меблів:', error);
          iziToast.error({
               title: 'Помилка',
               message: 'Не вдалося завантажити меблі. Спробуйте ще раз.',
               position: 'topRight'
          });
     } finally {
          hideLoader();
     }
}
// Рендеринг списку меблів
function renderFurniture(furnitureArray, replace = true) {
     const markup = furnitureArray
         .map(item => {
          const colorCircles = item.color
          .map(
               color => `<span class="furniture-color-circle" style="background-color: ${color};"></span>`
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
//отримання ID категорій у кнопки
async function fetchCategoriesIds() {
     try {
          const response = await fetch(`${BASE_URL}/categories`);
          const data = await response.json();
          const categories = data; 
          const categoryButtons = document.querySelectorAll('.category-card');
          // додаємо ID до кожної кнопки по її назві
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
               position: 'topRight'
          });
     }  
}
//Логіка перемикання категорій
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

// загрузити ще

loadMoreButton.addEventListener('click', () => {
     currentPage += 1;
     fetchFurniture(currentCategoryId, currentPage);
     
});

// кнопка детальніше
furnitureList.addEventListener('click', (event) => {
     const detailsBtn = event.target.closest('.details-btn');
     if (detailsBtn) {
          const card = detailsBtn.closest('.furniture-card');
          const furnitureId = card?.dataset.id;
          // console.log(`Кнопка "Детальніше" натиснута! ID: ${furnitureId}`);
         
         
         if (furnitureId) {
               openFurnitureModal(furnitureId);
          }
     }
     
});

function openFurnitureModal(id) {
    getFurnitureById(id);
}

export function getCachedFurniture() {
  return cachedFurniture;
}

async function init() {
await fetchCategoriesIds();
setupCategoryFilter();
fetchFurniture(); // початкове завантаження всіх меблів

}

init();




