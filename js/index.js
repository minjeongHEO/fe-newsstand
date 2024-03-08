function navCreate() {
  let navHtml = '';
  for (let index = 0; index < 2; index++) {
    navHtml += `<div class="nav-contents-container">
      <div class="nav-contents-press-name">연합 뉴스</div>
      <div class="nav-contents-headline">'면허정지'에도 꿈쩍않는 전공의…대학들은 "2천명 이상 증...</div>
    </div>`;
  }
  const target = document.getElementById('nav-container');
  target.innerHTML = navHtml;
}

function mainNewsCreate() {
  let mainNewsHtml = '';
  for (let itemIdx = 0; itemIdx < 24; itemIdx++) {
    mainNewsHtml += `<li>
    <a href="#" class="media-subscription-news-view">
    <img src="https://s.pstatic.net/static/newsstand/2020/logo/light/0604/057.png" height="20" alt="MBN" class="news_logo" />
    </a>
    </li>`;
  }
  const target = document.getElementById('press-logo-container');
  target.innerHTML = mainNewsHtml;
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
