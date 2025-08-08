

const BASE_URL = 'https://furniture-store.b.goit.study/api/';

const categoryContainer = document.querySelector('.category-filter');
const furnitureContainer = document.querySelector('.furniture-container');
const loader = document.querySelector('.loader');

export function showLoader() {
     loader.classList.remove('hidden');
     
}

export function hideLoader() {
     loader.classList.add('hidden');
     
}

// Функція для отримання категорій
async function fetchCategories() {
  const res = await fetch(`${BASE_URL}categories`);
  if (!res.ok) throw new Error('Помилка завантаження категорій');
  return res.json();
}