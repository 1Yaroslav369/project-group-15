import axios from "axios";

const API_URL = "https://furniture-store.b.goit.study/api";
const modalContainer = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal-close-btn");
const modalContent = document.querySelector(".modal-content");

// Функції для роботи з модалкою
function openModal(contentHTML) {
  modalContent.innerHTML = contentHTML;
  modalContainer.classList.remove("is-hidden");
  document.body.style.overflow = "hidden";

  document.addEventListener("keydown", handleEscClose);
  modalContainer.addEventListener("click", handleOutsideClick);
}

function closeModal() {
  modalContainer.classList.add("is-hidden");
  document.body.style.overflow = "";

  document.removeEventListener("keydown", handleEscClose);
  modalContainer.removeEventListener("click", handleOutsideClick);
}

function handleEscClose(e) {
  if (e.key === "Escape") {
    closeModal();
  }
}

function handleOutsideClick(e) {
  if (e.target === modalContainer) {
    closeModal();
  }
}

modalCloseBtn.addEventListener("click", closeModal);

// Функція для створення розмітки модалки
function createModalMarkup(item) {
  const colorsMarkup = item.colors
    .map(color => `<div class="color-option" style="background-color: ${color};"></div>`)
    .join("");

  return `
    <div class="product-details">
      <div class="product-gallery">
        <div class="main-image-container">
          <img src="${item.images[0]}" alt="${item.name}" class="main-image" />
        </div>
      </div>
      
      <div class="product-info">
        <h1 class="product-title">${item.name}</h1>
        <p class="product-type">${item.type}</p>
        
        <p class="product-price">${item.price.toLocaleString()} ГРН</p>
        
        <div class="color-section">
          <h3 class="section-title">Колір</h3>
          <div class="color-options">
            ${colorsMarkup}
          </div>
        </div>
        
        <div class="product-description">
          <p>${item.description}</p>
        </div>
        
        <div class="product-sizes">
          <p><strong>Розміри:</strong> ${item.sizes}</p>
        </div>
        
        <button class="order-btn">Перейти до замовлення</button>
      </div>
    </div>
  `;
}

// Функція для отримання даних про меблі
async function getFurnitureById(id) {
  try {
    const { data } = await axios.get(`${API_URL}/furniture/${id}`);
    return data;
  } catch (error) {
    console.error("Помилка завантаження меблів:", error);
    return null;
  }
}

// Ініціалізація обробників подій для елементів меблів
function initFurnitureItems() {
  document.querySelectorAll(".furniture-item").forEach(item => {
    item.addEventListener("click", async () => {
      const id = item.dataset.id;
      const furnitureData = await getFurnitureById(id);
      if (furnitureData) {
        const modalMarkup = createModalMarkup(furnitureData);
        openModal(modalMarkup);
      }
    });
  });
}

// Запуск при завантаженні сторінки
document.addEventListener("DOMContentLoaded", () => {
  initFurnitureItems();
});