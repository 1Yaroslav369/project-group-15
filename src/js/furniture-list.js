

const BASE_URL = 'https://furniture-store.b.goit.study/api/';


const loader = document.querySelector('.loader');




fetch('https://furniture-store.b.goit.study/api/categories')
  .then(res => {
    if (!res.ok) throw new Error('Статус відповіді не ОК');
    return res.json();
  })
  .then(data => console.log('Категорії:', data))
  .catch(err => console.error('Помилка:', err));



export function showLoader() {
     loader.classList.remove('hidden');
     
}

export function hideLoader() {
     loader.classList.add('hidden');
     
}