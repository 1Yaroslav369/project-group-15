import { getDataFromAPI } from './dataFetch.js';
import '../css/feadback.css';

import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function normalizeRate(rate) {
  if (rate >= 3.3 && rate <= 3.7) return 3.5;
  if (rate >= 3.8 && rate <= 4.2) return 4;
  return Math.round(rate * 2) / 2;
}

function createSlides(feedbacks) {
  return feedbacks
    .map(({ descr, name, rate }) => {
      const normalizedRate = normalizeRate(rate);
      return `
      <div class="swiper-slide">
        <div class="feedback-card">
          <div class="raty" data-score="${normalizedRate}"></div>
          <p class="feedback-text">"${descr}"</p>
          <p class="feedback-name">${name}</p>
        </div>
      </div>
    `;
    })
    .join('');
}

getDataFromAPI('feedbacks', 1, 10)
  .then(data => {
    if (!data.feedbacks?.length) return;

    const feedbackFromApi = document.querySelector('.feedback-from-API');
    feedbackFromApi.innerHTML = createSlides(data.feedbacks);

    // зірочки
    $('.raty').raty({
      readOnly: true,
      half: true,
      starType: 'i',
      score() {
        return $(this).attr('data-score');
      },
    });

    const prevBtn = document.querySelector('#prev-btn');
    const nextBtn = document.querySelector('#next-btn');

    const swiper = new Swiper('.feedback-swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchOverflow: true,
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
      pagination: {
        el: '#feedback-dots',
        clickable: true,
        bulletClass: 'dot',
        bulletActiveClass: 'active',
        renderBullet: (i, className) => `<div class="${className}"></div>`,
      },
      on: {
        init() {
          updateArrows(this);
        },
        slideChange() {
          updateArrows(this);
        },
        resize() {
          updateArrows(this);
        },
      },
    });

    function updateArrows(sw) {
      prevBtn.classList.toggle('arrow-disabled', sw.isBeginning);
      nextBtn.classList.toggle('arrow-disabled', sw.isEnd);
    }
  })
  .catch(err => console.error('Помилка при отриманні відгуків:', err));
