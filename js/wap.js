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
  insertpoint = $('.settings-title:last')[0];
  insert = document.createElement('div');
  insert.classList.add('settings-title');
  insert.innerHTML = '<span>测试功能</span>';
  insertpoint.parentNode.insertBefore(insert, insertpoint);
  insert = document.createElement('div');
  insert.classList.add('settings-content');
  let btn = document.createElement('button');
  btn.innerText = '引用外部JavaScript';
  btn.addEventListener('click', waibujs);
  insert.appendChild(btn);
  insertpoint.parentNode.insertBefore(insert, insertpoint);
})

function waibujs() {
  var prom = prompt('引用外部JavaScript，重启后生效。', localStorage.getItem('js') && localStorage.getItem('js').split('"')[1]);
  if (prom != null) {
    localStorage.setItem('js', '"' + prom + '"');
  }
}
try {
  document.write("<script type='text/javascript' src=" + localStorage.getItem('js') + "></script>");
} catch (e) {}
