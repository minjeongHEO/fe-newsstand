import { readJsonFile } from './getJsonFile.js';

let TAB_TYPE = 'grid'; //grid, list

const GRID_DATA = {
  PAGE_IN_GRID: 1,
  MAXIMUM_PAGE_IN_GRID: 4,
  JSON_ARR_PER_PAGE: null,
  CONTENTS_PER_PAGE: 24,
};

const LIST_DATA = {
  JSON_DATA: null,
  CATEGORY: [],
  CURRENT_CATE_IDX: 0,
  MAXIMUM_PAGE_PER_CATEGORY: [],
  PAGE_IN_LIST: 1,
  GAUGE_INTERVALS: {},
};

const clearFillGaugeInterval = () => {
  if (LIST_DATA.GAUGE_INTERVALS) {
    clearInterval(LIST_DATA.GAUGE_INTERVALS);
  }
};

const runFillGaugeInterval = () => {
  LIST_DATA.GAUGE_INTERVALS = setInterval(() => {
    document.querySelector('#angle-right i').click();
  }, 3000);
};

const listViewPagingControls = async (direction) => {
  if (direction === 'right') {
    LIST_DATA.PAGE_IN_LIST++;
  }
  if (direction === 'left') {
    LIST_DATA.PAGE_IN_LIST--;
  }

  // 1.지금 해당 카테고리가 뭔지
  const currentCategoryIndex = LIST_DATA.CURRENT_CATE_IDX;

  // 2.그 카테고리의 max 페이지 수는 뭔지
  const maxPage = LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY[currentCategoryIndex];

  if (LIST_DATA.PAGE_IN_LIST < 1) {
    //전카테로
    LIST_DATA.CURRENT_CATE_IDX = currentCategoryIndex === 0 ? LIST_DATA.CATEGORY.length - 1 : currentCategoryIndex - 1;
    LIST_DATA.PAGE_IN_LIST = LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY[LIST_DATA.CURRENT_CATE_IDX]; // 이전 카테고리의 마지막 페이지로 설정
  }
  if (LIST_DATA.PAGE_IN_LIST > maxPage) {
    LIST_DATA.CURRENT_CATE_IDX = currentCategoryIndex >= LIST_DATA.CATEGORY.length - 1 ? 0 : currentCategoryIndex + 1;
    LIST_DATA.PAGE_IN_LIST = 1;
  }
};

const gridSectionEvents = async (e) => {
  switch (TAB_TYPE) {
    case 'grid':
      if (e.target.parentNode.id === 'angle-right') {
        if (GRID_DATA.PAGE_IN_GRID === GRID_DATA.MAXIMUM_PAGE_IN_GRID) return;
        GRID_DATA.PAGE_IN_GRID++;
      }
      if (e.target.parentNode.id === 'angle-left') {
        if (GRID_DATA.PAGE_IN_GRID === 0) return;
        GRID_DATA.PAGE_IN_GRID--;
      }

      setPressDataGrid();
      break;

    case 'list':
      if (e.target.parentNode.id === 'angle-right') {
        await listViewPagingControls('right');
      }
      if (e.target.parentNode.id === 'angle-left') {
        await listViewPagingControls('left');
      }

      setNewsDataList();
      break;

    default:
      break;
  }
};

const tabSectionEvents = (e) => {
  if (e.target.closest('div#list-tab')) {
    TAB_TYPE = 'list';
    document.querySelector('#list-tab path').classList.replace('grid-option', 'grid-option-select');
    document.querySelector('#grid-tab path').classList.replace('grid-option-select', 'grid-option');
    GRID_DATA.PAGE_IN_GRID = 1;
    LIST_DATA.PAGE_IN_LIST = 1;
    setNewsDataList();
  }
  if (e.target.closest('div#grid-tab')) {
    TAB_TYPE = 'grid';
    document.querySelector('#grid-tab path').classList.replace('grid-option', 'grid-option-select');
    document.querySelector('#list-tab path').classList.replace('grid-option-select', 'grid-option');
    GRID_DATA.PAGE_IN_GRID = 1;
    LIST_DATA.PAGE_IN_LIST = 1;
    setPressDataGrid();
  }
};

const clickEvent = (e) => {
  if (e.target.closest('section.main-tab-section-container')) tabSectionEvents(e); //탭 이벤트들
  if (e.target.closest('section.press-news-container')) gridSectionEvents(e); //그리드 내에서의 이벤트들
};

/** 이벤트 위임 */
const excuteEventDelegation = () => {
  const container = document.querySelector('.main-container');
  container.addEventListener('click', clickEvent);
};

/** 페이지 별 화살표 처리 */
const arrowHandlingByPage = () => {
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');

  if (GRID_DATA.PAGE_IN_GRID === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (GRID_DATA.PAGE_IN_GRID === GRID_DATA.MAXIMUM_PAGE_IN_GRID) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
};

/** 랜덤한 언론사 데이터를 페이지 별로 나누기 */
async function divideDataByPage(jsonShuffleData) {
  const totalPages = Math.ceil(jsonShuffleData.length / GRID_DATA.CONTENTS_PER_PAGE);
  const pagesToGenerate = Math.min(totalPages, GRID_DATA.MAXIMUM_PAGE_IN_GRID); //실제 페이지 수가 최대 페이지 수보다 작을 수 있으므로

  const jsonArrPerPage = Array.from({ length: pagesToGenerate }, (_, index) => {
    const start = index * GRID_DATA.CONTENTS_PER_PAGE;
    return jsonShuffleData.slice(start, start + GRID_DATA.CONTENTS_PER_PAGE);
  });

  return jsonArrPerPage;
}

async function dataShuffle(jsonArray) {
  return jsonArray.sort(() => Math.random() - 0.5);
}

/** 언론사 데이터 생성 */
const drawPressDataHtml = async () => {
  let mainNewsHtml = '';
  mainNewsHtml += `<div id="angle-left">
                      <i class="fi fi-rr-angle-left"></i>
                    </div>`;

  mainNewsHtml += `<ul class="press-logo-container" id="press-logo-container">`;

  for (const pressObj of GRID_DATA.JSON_ARR_PER_PAGE[GRID_DATA.PAGE_IN_GRID - 1]) {
    mainNewsHtml += `<li>
                      <a href="#" class="media-subscription-news-view">
                      <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="news_logo" />
                      </a>
                      </li>`;
  }
  mainNewsHtml += `</ul>`;
  mainNewsHtml += `<div id="angle-right">
                    <i class="fi fi-rr-angle-right"></i>
                  </div>`;

  const target = document.querySelector('.press-news-container');

  target.innerHTML = mainNewsHtml;
};

/** 카테고리 바 */
const drawCategoryDataHtml = async (jsonData) => {
  let mainCategoryHtml = '';
  mainCategoryHtml += `<div id="angle-left">
                        <i class="fi fi-rr-angle-left"></i>
                      </div>`;

  mainCategoryHtml += `<div class="listview-container">
                        <div class="category-bar">`;
  for (const [idx, categoryObj] of jsonData.entries()) {
    if (idx == LIST_DATA.CURRENT_CATE_IDX) {
      mainCategoryHtml += `<div class="category${idx}">
                              <span>${categoryObj.categoryName} ${LIST_DATA.PAGE_IN_LIST}/${
        LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY[LIST_DATA.CURRENT_CATE_IDX]
      }</span>
                          </div>`;
    } else {
      mainCategoryHtml += `<div class="category${idx}">${categoryObj.categoryName}</div>`;
    }
  }

  mainCategoryHtml += `</div>
                      </div>`;

  mainCategoryHtml += `<div id="angle-right">
                        <i class="fi fi-rr-angle-right"></i>
                      </div>`;

  const target = document.querySelector('.press-news-container');
  target.innerHTML = mainCategoryHtml;
};

/** 카테고리 별 언론사 뉴스 */
const drawNewsDataHtml = async (currentJsonData) => {
  const currentPageData = currentJsonData.news[LIST_DATA.PAGE_IN_LIST - 1];

  let mainNewsHtml = '';
  mainNewsHtml += `
                  <div class="news-container">
                    <div class="news-logo">
                      <a target="_blank" href="${currentPageData.pressImgLink}" class="MediaNewsView-module__news_logo___LwMpl">
                        <img src="${currentPageData.pressImg}" height="20" width="auto" alt="${currentPageData.pressName}" />
                      </a>
                      <span class="MediaNewsView-module__news_text___hi3Xf">
                        <span class="MediaNewsView-module__time___fBQhP">${currentPageData.newsTime}</span>
                      </span>
                      <button type="button" class="MediaNewsView-module__btn_cancel____bfsE" aria-pressed="false">
                        <span class="blind">구독취소</span>
                      </button>
                    </div>

                    <div class="news-datas">
                      <div class="main-news">
                        <a target="_blank" href="${currentPageData.mainImgLink}" class="main-img MediaNewsView-module__link_thumb___rmMr4">
                          <img src="${currentPageData.mainImgSrc}" alt="${currentPageData.mainHeadLine}"/>
                        </a>
                        <a class="main-headline">${currentPageData.mainHeadLine}</a>
                      </div>
                      
                      <ul class="sub-news">`;

  mainNewsHtml += currentPageData.headLines.reduce((acc, cur, idx) => {
    return (acc += `<li>
                      <a target="_blank" href="${cur.link}" class="MediaNewsView-module__link_item___x0z7x">
                        ${cur.headline}
                      </a>
                    </li>`);
  }, '');

  mainNewsHtml += `<li><a>${currentPageData.pressName} 언론사에서 직접 편집한 뉴스입니다.</a></li>`;
  mainNewsHtml += `</ul>
                    </div>
                  </div>`;

  mainNewsHtml += `<div id="angle-right">
                      <i class="fi fi-rr-angle-right"></i>
                    </div>`;

  const target = document.querySelector('.listview-container');
  target.insertAdjacentHTML('beforeend', mainNewsHtml);
};

/** 활성화된 카테고리 확인 후 적용 */
const applyActivatedCategory = () => {
  const activatedCategory = document.querySelector(`.category${LIST_DATA.CURRENT_CATE_IDX}`);
  const siblings = Array.from(activatedCategory.parentNode.children);

  siblings.forEach((sibling) => {
    if (sibling !== activatedCategory) sibling.classList.remove('category-select');
  });

  activatedCategory.classList.add('category-select');
};

/** 뉴스 데이터 리스트 생성 TAB_TYPE: 'list' */
const setNewsDataList = async () => {
  try {
    LIST_DATA.JSON_DATA = LIST_DATA.JSON_DATA === null ? await readJsonFile('categoryNewsData') : LIST_DATA.JSON_DATA;
    LIST_DATA.CATEGORY = LIST_DATA.CATEGORY.length === 0 ? LIST_DATA.JSON_DATA.map((cur) => cur.categoryName) : LIST_DATA.CATEGORY;
    LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY =
      LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY.length === 0 ? LIST_DATA.JSON_DATA.map((cur) => cur.news.length) : LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY;

    clearFillGaugeInterval();
    runFillGaugeInterval();
    await drawCategoryDataHtml(LIST_DATA.JSON_DATA);
    applyActivatedCategory();

    await drawNewsDataHtml(LIST_DATA.JSON_DATA[LIST_DATA.CURRENT_CATE_IDX]);
  } catch (error) {
    console.error(error);
  }
};

/** 언론사 데이터 그리드 생성 TAB_TYPE: 'grid' */
export const setPressDataGrid = async () => {
  excuteEventDelegation();
  await drawPressDataHtml();
  arrowHandlingByPage();
};

/** 페이지 초기화 작업 */
export const initGridData = async () => {
  const jsonArray = await readJsonFile('pressData');
  const jsonShuffleData = await dataShuffle(jsonArray);
  GRID_DATA.JSON_ARR_PER_PAGE = await divideDataByPage(jsonShuffleData);
};
