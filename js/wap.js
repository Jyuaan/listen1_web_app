document.addEventListener("DOMContentLoaded", () => {
  let insert = document.createElement('span');
  insert.innerText = '三';
  insert.classList.add('icon');
  insert.addEventListener('click', () => {
    document.getElementsByClassName("sidebar")[0].classList.toggle('wapopen');
  })
  let insertpoint = document.getElementsByClassName('li-back')[0];
  insertpoint.parentNode.insertBefore(insert, insertpoint);
  insert = document.createElement('div');
  insert.innerHTML = "<svg><use xlink:href='images/feather-sprite.svg#chevron-down'></use></svg>";
  insert.children[0].addEventListener('click', () => {
    document.getElementsByClassName('footer')[0].classList.toggle('wapopen');
    document.getElementsByClassName('songdetail-wrapper')[0].classList.toggle('wapopen');
  });
  document.getElementsByClassName('right-control')[0].appendChild(insert);
})