
import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';



new Accordion('.accordion-container-FAQ', {
  duration: 900,
  showMultiple: false,
});

document.addEventListener('DOMContentLoaded', function () {
  const accordionItems = document.querySelectorAll('.FAQ-item');
  faqs.forEach(faq =>
    faq.addEventListener('click', () => {
      faq.classList.toggle('active');
    })
  );

  accordionItems.forEach(item => {
    const btn = item.querySelector('.FAQ-btn');
    const content = item.querySelector('.ac-panel');

    btn.addEventListener('click', function () {
      if (content.style.display === 'flex') {
        content.style.overflow = 'hidden';
      } else {
        content.style.display = 'flex';
      }
    });
  });
});
const faqs = document.querySelectorAll('.FAQ-item');