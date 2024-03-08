const PAGE = { gridPage: 1 };
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

/** */
async function divideByPage() {
  const jsonData = await readJsonFile('pressData');
  let jsonArrPerPage = [];

  for (let i = 0; i < jsonData.length; i += 24) {
    let dataPerPage = jsonData.slice(i, i + 24);
    jsonArrPerPage.push(dataPerPage);
  }

  return jsonArrPerPage;
}

function arrowHandlingByPage() {
  debugger;
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');
  if (PAGE.gridPage === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (PAGE.gridPage === 4) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
}

/** */
async function mainNewsCreate() {
  arrowHandlingByPage();
  let mainNewsHtml = '';
  let gridPage = PAGE.gridPage === undefined ? 1 : PAGE.gridPage;
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

/** json데이터 fetch */
async function readJsonFile(fileName) {
  const filePath = `./${fileName}.json`;
  const response = await fetch(filePath);
  const jsonData = await response.json();

  return jsonData; //object (json)
}

async function headlineNewsCreate() {
  const jsonData = await readJsonFile('headlinesData');
  // const obj = JSON.parse(jsonData); //여기서 에러... 왜?
}

async function pressLogoCreate() {
  const jsonData = await readJsonFile('pressData');
}

function pageClick(event) {
  let page = PAGE.gridPage;
  let target = event.target;

  // id가 없을 경우
  if (target.id !== null || target.id === '') {
    target = target.parentNode;
  }

  if (target.id === 'angle-right') {
    if (PAGE.gridPage === 4) {
      return;
    }
    PAGE.gridPage = page + 1;
  }

  if (target.id === 'angle-left') {
    if (PAGE.gridPage === 0) {
      return;
    }
    PAGE.gridPage = page - 1;
  }

  mainNewsCreate();
}

function clickEvents() {
  const angleRight = document.getElementById('angle-right');
  const angleLeft = document.getElementById('angle-left');

  angleRight.addEventListener('click', (event) => pageClick(event));
  angleLeft.addEventListener('click', (event) => pageClick(event));

  // angleRight.addEventListener('click', function (event) {
  //   pageClick(event);
  // });
  // angleLeft.addEventListener('click', function (event) {
  //   pageClick(event);
  // });
}

navCreate();
mainNewsCreate();
headlineNewsCreate();
clickEvents();
