import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const modal = document.querySelector('.modal-overlay');
const closeModalBtn = document.querySelector('.modal-close-btn');
const form = document.querySelector('.modal-form');

closeModalBtn.addEventListener('click', hideOrderModal);
modal.addEventListener('click', e => {
  if (e.target === modal) hideOrderModal();
});

export function openOrderModal() {
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleEscapeKey);
}

export function hideOrderModal() {
  modal.classList.remove('is-open');

  if (document.querySelector('.modal-furniture.is-hidden')) {
    document.body.style.overflow = '';
  }

  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') hideOrderModal();
}

form.addEventListener('submit', async e => {
  e.preventDefault();

  const data = {
    email: form.elements['user-email'].value,
    phone: form.elements['phone'].value,
    modelId: '682f9bbf8acbdf505592ac36',
    color: '#1212ca',
    comment: form.elements['user-comment'].value,
  };

  try {
    await axios.post('https://furniture-store.b.goit.study/api/orders', data, {
      headers: { 'Content-Type': 'application/json' },
    });

    iziToast.success({
      title: 'OK',
      message: 'Замовлення успішно відправлено!',
      position: 'topRight',
    });

    hideOrderModal();
    form.reset();
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: error.response?.data?.message || 'Помилка відправки замовлення',
      position: 'topRight',
    });
  }
});
