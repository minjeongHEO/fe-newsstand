import { readJsonFile } from './getJsonFile.js';

let PAGE_IN_GRID = 1;
let JSON_ARR_PER_PAGE = null;
const NUMBER_OF_PAGE_IN_GRID = 4;
const CONTENTS_PER_PAGE = 24;

function pageClick(event) {
  let target = event.target;

  // id가 없을 경우
  if (target.id !== null || target.id === '') {
    target = target.parentNode;
  }

  if (target.id === 'angle-right') {
    if (PAGE_IN_GRID === NUMBER_OF_PAGE_IN_GRID) return;
    PAGE_IN_GRID++;
  }

  if (target.id === 'angle-left') {
    if (PAGE_IN_GRID === 0) return;
    PAGE_IN_GRID--;
  }

  setPressDataGrid();
}

/** click이벤트 리스너 생성 */
function addClickEvents() {
  const angleRight = document.getElementById('angle-right');
  const angleLeft = document.getElementById('angle-left');

  angleRight.addEventListener('click', pageClick);
  angleLeft.addEventListener('click', pageClick);
}

/** 페이지 별 화살표 처리 */
function arrowHandlingByPage() {
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');

  if (PAGE_IN_GRID === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (PAGE_IN_GRID === NUMBER_OF_PAGE_IN_GRID) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
}

/** 랜덤한 언론사 데이터를 페이지 별로 나누기 */
async function divideDataByPage(jsonShuffleData) {
  let jsonArrPerPage = [];

  for (let i = 0; i < jsonShuffleData.length; i += CONTENTS_PER_PAGE) {
    let dataPerPage = jsonShuffleData.slice(i, i + CONTENTS_PER_PAGE);
    if (jsonArrPerPage.length >= NUMBER_OF_PAGE_IN_GRID) {
      return jsonArrPerPage;
    }
    jsonArrPerPage.push(dataPerPage);
  }

  return jsonArrPerPage;
}

async function dataShuffle(jsonArray) {
  return jsonArray.sort(() => Math.random() - 0.5);
}

/** 언론사 데이터 그리드 생성 */
export async function setPressDataGrid() {
  addClickEvents();
  arrowHandlingByPage();

  let mainNewsHtml = '';
  for (const pressObj of JSON_ARR_PER_PAGE[PAGE_IN_GRID - 1]) {
    mainNewsHtml += `<li>
      <a href="#" class="media-subscription-news-view">
      <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="news_logo" />
      </a>
      </li>`;
  }

  const target = document.getElementById('press-logo-container');
  target.innerHTML = mainNewsHtml;
}

async function initGridData(params) {
  const jsonArray = await readJsonFile('pressData');
  const jsonShuffleData = await dataShuffle(jsonArray);
  JSON_ARR_PER_PAGE = await divideDataByPage(jsonShuffleData);
}

// 페이지 로드 시 초기화 함수 호출
window.onload = async () => {
  await initGridData();
  await setPressDataGrid(); // 첫 페이지 데이터 로딩
};
