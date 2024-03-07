function navCreate() {
  for (let index = 0; index < 2; index++) {
    let container = document.createElement('div');
    let newsBrand = document.createElement('div');
    let newsHeadLine = document.createElement('div');
    container.className = 'nav-contents-container';
    newsBrand.className = 'nav-contents-press-name';
    newsHeadLine.className = 'nav-contents-headline';
    newsBrand.innerHTML = '연합 뉴스';
    newsHeadLine.innerHTML = `'면허정지'에도 꿈쩍않는 전공의…대학들은 "2천명 이상 증...`;

    container.appendChild(newsBrand);
    container.appendChild(newsHeadLine);

    document.getElementById('nav-container').appendChild(container);
  }
}

function mainNewsCreate() {
  for (let itemIdx = 0; itemIdx < 24; itemIdx++) {
    let pressListTag = document.createElement('li');

    let aTag = document.createElement('a');
    aTag.href = '#';
    aTag.className = 'media-subscription-news-view';

    let imgTag = document.createElement('img');
    imgTag.src = 'https://s.pstatic.net/static/newsstand/2020/logo/light/0604/057.png';
    imgTag.height = '20';
    imgTag.alt = 'MBN';
    imgTag.className = 'news_logo';

    aTag.appendChild(imgTag);

    pressListTag.appendChild(aTag);
    document.getElementById('press-logo-container').appendChild(pressListTag);
  }
}

async function readJsonFile(fileName) {
  const filePath = `./${fileName}.json`;
  const response = await fetch(filePath);
  const jsonData = await response.json();

  return jsonData; //object (json)
}

async function headlineNewsCreate() {
  const jsonData = await readJsonFile('headlinesData');
  // const obj = JSON.parse(jsonData); //여기서 에러... 왜?
  for (pressObj of jsonData) {
    //for in 으로는 인덱스 값 추출?
    console.log('pressObj.newsName: ', pressObj.newsName);
  }
}

async function pressLogoCreate() {
  const jsonData = await readJsonFile('pressData');
}

navCreate();
mainNewsCreate();
headlineNewsCreate();
