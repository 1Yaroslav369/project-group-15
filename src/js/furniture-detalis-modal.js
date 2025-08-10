import axios from "axios";

const API_URL = "https://furniture-store.b.goit.study/api";
const furniture = document.querySelector(".modal-furniture");
const modalContainer = document.querySelector(".modal-form-container");
const modalCloseBtn = document.querySelector(".btn-close-modal");
const modalContent = document.querySelector(".content-modal-form");
const box = document.querySelector(".example");

//
// box.addEventListener("click", openModal);
//
// console.log("Card clicked, id:", id);

// box.addEventListener("click", () => {
//   const id = box.dataset.id; 
//   if (id) {
//     getFurnitureById(id);
//   }
// });

export async function getFurnitureById(id) {
  try {
    const { data } = await axios.get(`${API_URL}/furniture/${id}`);
      openModal(data);
      console.log("API response:", data);
  } catch (error) {
    console.error("Помилка завантаження меблів:", error);
    }
    
}


function openModal(item) {
    // console.log("Item received:", item);
  modalContent.innerHTML = createModalMarkup(item);
  furniture.classList.remove("is-hidden");

    if (window.$ && $.fn.raty) {
    $('.raty').raty({
      readOnly: true,
      half: true,
      starType: 'i',
      score() {
        return $(this).attr('data-score');
      },
    });
    }

    const colorBtns = modalContent.querySelectorAll('.color-btn');
  colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      colorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
    
    
    modalCloseBtn.addEventListener("click", closeModal)
    furniture.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscClose);
}

function closeModal() {
    // document.body.style.overflow = 'auto';

    furniture.classList.add("is-hidden");

    modalCloseBtn.removeEventListener("click", closeModal)
    furniture.removeEventListener("click", handleOutsideClick);
    document.removeEventListener("keydown", handleEscClose);

//     const orderBtn = modalContent.querySelector(".btn-order");
//   if (orderBtn) {
//     orderBtn.addEventListener("click", () => {
//       closeModal();
//       openOrderModal();
//     });
}

function handleOutsideClick(e) {
    if (e.target === furniture) {
    closeModal();
    }
}

function handleEscClose(e) {
  if (e.key === 'Escape' && !furniture.classList.contains('is-hidden')) {
    closeModal();
  }
}


export function createModalMarkup(item) {
    const colorsMarkup = Array.isArray(item.colors)
        ? item.colors.map((color, idx) =>
            `<button class="color-btn${idx === 0 ? ' active' : ''}" style="background-color:${color};" data-color="${color}"></button>`
        )
            .join("")
        : "";

  const images = Array.isArray(item.images) ? item.images.slice(0, 3) : [];
  const galleryMarkup = images.map((img, idx) => {
    if (idx === 0) {
      return `<img src="${img}" alt="${item.name}" class="main-image gallery-image" />`;
    }
    return `<img src="${img}" alt="${item.name}" class="thumb-image gallery-image" />`;
  }).join("")

  return `
    <div class="modal-content-inner">
      <div class="gallery">${galleryMarkup}</div>
      <h2>${item.name}</h2>
      <p class="type">${item.type}</p>
      <p class="price">${item.price} грн</p>
      <div class="raty" data-score="${item.rating || 0}"></div>
      <span>${item.rating || "Немає оцінки"}</span>
      <div class="colors">
        <span>Колір</span>
        <div class="color-list">${colorsMarkup}</div>
      </div>
      <p class="description">${item.description}</p>
      <p class="sizes">Розміри: ${item.sizes}</p>
      <button class="btn-order" type="submit">Перейти до замовлення</button>
    </div>
  `;
}
