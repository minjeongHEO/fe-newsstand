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

async function divideByPage() {
  const jsonData = await readJsonFile('pressData');

  // json형태의 배열을 어떻게 자를지?
  // page 에 따라서 인덱스값 다르게 받는다
  let jsonArrPerPage = [];

  for (let i = 0; i < jsonData.length; i += 24) {
    let dataPerPage = jsonData.slice(i, i + 24);
    jsonArrPerPage.push(dataPerPage);
  }
  return jsonArrPerPage;
}

async function mainNewsCreate(page) {
  let mainNewsHtml = '';
  let gridPage = page === undefined ? 1 : page;
  let jsonArrPerPage = await divideByPage();

  for (pressObj of jsonArrPerPage[gridPage - 1]) {
    mainNewsHtml += `<li>
      <a href="#" class="media-subscription-news-view">
      <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="news_logo" />
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
