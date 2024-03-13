import { readJsonFile } from './getJsonFile.js';

/**
 * [ ] 그리드,리스트 탭 클릭
 * [ ] 리스너 위임하는 방법으로 변경
 *
 */

const DATA = {
  PAGE_IN_GRID: 1,
  JSON_ARR_PER_PAGE: null,
  NUMBER_OF_PAGE_IN_GRID: 4,
  CONTENTS_PER_PAGE: 24,
  TAB_TYPE: 'grid', //grid, list
};

const gridSectionEvents = (e) => {
  switch (DATA.TAB_TYPE) {
    case 'grid':
      if (e.target.parentNode.id === 'angle-right') {
        if (DATA.PAGE_IN_GRID === DATA.NUMBER_OF_PAGE_IN_GRID) return;
        DATA.PAGE_IN_GRID++;
      }

      if (e.target.parentNode.id === 'angle-left') {
        if (DATA.PAGE_IN_GRID === 0) return;
        DATA.PAGE_IN_GRID--;
      }

      setPressDataGrid();

      break;

    case 'list':
      break;

    default:
      break;
  }
};

const tabSectionEvents = (e) => {
  const target = e.target.parentNode;
  if (target.id === 'list-tab') console.log('리스트그려라');
  if (target.id === 'grid-tab') setPressDataGrid();
};

const clickEvent = (e) => {
  // if (e.target. === "svg.press-container__view-icon") gridSectionEvents();
  // if (e.target === "svg.press-container__view-icon") tabSectionEvents();

  // e.target의 상위 노드들 중에서 section태그의 클래스 이름이'press-container'  인지 확인
  if (e.target.closest('section.main-tab-section-container')) tabSectionEvents(e); //탭 이벤트들
  if (e.target.closest('section.press-container')) gridSectionEvents(e); //그리드 내에서의 이벤트들
};

/** 이벤트 위임 */
function excuteEventDelegation() {
  const container = document.querySelector('.main-container');
  container.addEventListener('click', clickEvent);
}

/** 페이지 별 화살표 처리 */
function arrowHandlingByPage() {
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');

  if (DATA.PAGE_IN_GRID === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (DATA.PAGE_IN_GRID === DATA.NUMBER_OF_PAGE_IN_GRID) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
}

/** 랜덤한 언론사 데이터를 페이지 별로 나누기 */
async function divideDataByPage(jsonShuffleData) {
  const totalPages = Math.ceil(jsonShuffleData.length / DATA.CONTENTS_PER_PAGE);
  const pagesToGenerate = Math.min(totalPages, DATA.NUMBER_OF_PAGE_IN_GRID); //실제 페이지 수가 최대 페이지 수보다 작을 수 있으므로

  const jsonArrPerPage = Array.from({ length: pagesToGenerate }, (_, index) => {
    const start = index * DATA.CONTENTS_PER_PAGE;
    return jsonShuffleData.slice(start, start + DATA.CONTENTS_PER_PAGE);
  });

  return jsonArrPerPage;
}

async function dataShuffle(jsonArray) {
  return jsonArray.sort(() => Math.random() - 0.5);
}

/** 언론사 데이터 그리드 생성 */
export async function setPressDataGrid() {
  excuteEventDelegation();

  arrowHandlingByPage();

  let mainNewsHtml = '';
  for (const pressObj of DATA.JSON_ARR_PER_PAGE[DATA.PAGE_IN_GRID - 1]) {
    mainNewsHtml += `<li>
      <a href="#" class="media-subscription-news-view">
      <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="news_logo" />
      </a>
      </li>`;
  }

  const target = document.getElementById('press-logo-container');
  target.innerHTML = mainNewsHtml;
}

/** 페이지 초기화 작업 */
export async function initGridData(params) {
  const jsonArray = await readJsonFile('pressData');
  const jsonShuffleData = await dataShuffle(jsonArray);
  DATA.JSON_ARR_PER_PAGE = await divideDataByPage(jsonShuffleData);
}
