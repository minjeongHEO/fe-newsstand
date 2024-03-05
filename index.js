function navCreate() {
  for (let index = 0; index < 2; index++) {
    let container = document.createElement('div');
    let newsBrand = document.createElement('div');
    let newsHeadLine = document.createElement('div');
    container.className = 'row-container';
    newsBrand.innerHTML = '연합 뉴스';
    newsHeadLine.innerHTML = `'면허정지'에도 꿈쩍않는 전공의…대학들은 "2천명 이상 증...`;

    container.appendChild(newsBrand);
    container.appendChild(newsHeadLine);

    document.getElementById('nav-container').appendChild(container);
  }
}

function mainNewsCreate() {
  for (let lineIdx = 0; lineIdx < 4; lineIdx++) {
    let outerDiv = document.createElement('div');
    let container = document.createElement('div');
    container.className = 'row-container';

    for (let itemIdx = 0; itemIdx < 6; itemIdx++) {
      let mediaBox = document.createElement('div');
      mediaBox.className = 'media-subscription-box';

      let aTag = document.createElement('a');
      aTag.href = '#';
      aTag.className = 'media-subscription-news-view';
      // aTag.setAttribute('aria-disabled', 'false'); // aria-disabled 속성 설정 ?

      let imgTag = document.createElement('img');
      imgTag.src = 'https://s.pstatic.net/static/newsstand/2020/logo/light/0604/057.png';
      imgTag.height = '20';
      imgTag.alt = 'MBN';
      imgTag.className = 'news_logo';

      aTag.appendChild(imgTag);
      mediaBox.appendChild(aTag);
      container.appendChild(mediaBox);
    }

    outerDiv.appendChild(container);
    document.getElementById('main-news-container').appendChild(outerDiv);
  }
}

navCreate();
mainNewsCreate();