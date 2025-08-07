import axios from 'axios';
import 'izitoast/dist/css/iziToast.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const closeModalBtn = document.querySelector('.modal-close-btn');
const modal = document.querySelector('.modal-overlay');
const form = document.querySelector('.modal-form');

closeModalBtn.addEventListener('click', hideModal);
modal.addEventListener('click', event => {
  if (event.target === modal) {
    hideModal();
  }
});
document.addEventListener('keydown', handleEscapeKey);

function hideModal() {
  modal.classList.remove('is-open');
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    hideModal();
  }
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  const data = {
    email: form.elements['user-email'].value,
    phone: form.elements['phone'].value,
    modelId: '682f9bbf8acbdf505592ac36',
    color: '#1212ca',
    comment: form.elements['user-comment'].value,
  };
  try {
    const response = await axios.post(
      'https://furniture-store.b.goit.study/api/orders',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    iziToast.success({
      title: 'OK',
      message: 'Замовлення успішно відправлено!',
      position: 'topRight',
    });
    hideModal();
    form.reset();
  } catch (error) {
    console.error('Помилка відправки:', error);
    iziToast.error({
      title: 'Error',
      message: error.response.data.message,
      position: 'topRight',
    });
  }
});
