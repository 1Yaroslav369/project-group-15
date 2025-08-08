import axios from "axios";


const BASE_URL = 'https://furniture-store.b.goit.study/api';
const categoryButtons = document.querySelectorAll('.category-card');
const furnitureList = document.querySelector('.furniture-list');
const loadMoreButton = document.querySelector('.load-more-button');
const loader = document.querySelector('.loader');

let currentCategoryId = '';
let currentPage = 1;

export function showLoader() {
     loader.classList.remove('hidden');
     
}

export function hideLoader() {
     loader.classList.add('hidden');
     
}

async function fetchFurniture(categoryId = '', page = 1, limit = 8) {
     
     showLoader();
     try {
          const url = categoryId
          ? `${BASE_URL}/furnitures?category=${categoryId}&limit=${limit}&page=${page}`
          : `${BASE_URL}/furnitures?limit=${limit}&page=${page}`;
          
        
          
          const response = await axios.get(url);
    const data = response.data;
          
          renderFurniture(data.furnitures, page === 1);
     } catch (error) {
          console.error('Помилка при отриманні меблів:', error);
     } finally {
          hideLoader();
     }
     
}

function renderFurniture(furnitureArray, replace = true) {
     const markup = furnitureArray
     .map(item => {
          const colorCircles = item.color
          .map(
               color => `<span class="furniture-color-circle" style="background-color: ${color};"></span>`
          )
          .join('');
          
          return `
          <li class="furniture-card">
          <img src="${item.images[0]}" alt="${item.name}" class="furniture-image" />
          <h3 class="furniture-name">${item.name}</h3>
          <div class="furniture-colors">${colorCircles}</div>
          <p class="furniture-price">${item.price} грн.</p>
          <button type="button">Детальніше</button>
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

async function fetchCategoriesIds() {
     try {
          const response = await fetch(`${BASE_URL}/categories`);
          const data = await response.json();
          const categories = data; 
          
          const categoryButtons = document.querySelectorAll('.category-card');
          
          categoryButtons.forEach(btn => {
               const name = btn.dataset.name;
               const matched = categories.find(cat => cat.name === name);
               if (matched) {
                    btn.dataset.id = matched._id;
               }
          });
     } catch (error) {
          console.error('Помилка при підставці ID категорії:', error);
     }
     
}

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

// зпгрузити ще

loadMoreButton.addEventListener('click', () => {
     currentPage += 1;
     fetchFurniture(currentCategoryId, currentPage);
     
});


async function init() {
await fetchCategoriesIds();
setupCategoryFilter();
fetchFurniture(); // початкове завантаження всіх меблів

}

init();





