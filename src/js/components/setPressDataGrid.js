import { readJsonFile } from './getJsonFile.js';
import { SubscriptionsDataControl } from './SubscriptionsDataControl.js';

let SubscriptionsControl;

//태그의 attribute로 넣어놓기
let TAB_TYPE = 'grid'; //grid, list
let SUBSCRIBE_TYPE = 'all'; //all, my

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

const MY_LIST_DATA = {
  JSON_DATA: null,
  CATEGORY: [],
  CURRENT_CATE_IDX: 0,
  PAGE_IN_LIST: 1,
  GAUGE_INTERVALS: {},
};

const clearAutoRenderIntervalAll = () => {
  if (LIST_DATA.GAUGE_INTERVALS) {
    clearInterval(LIST_DATA.GAUGE_INTERVALS);
  }
};

const clearAutoRenderIntervalMy = () => {
  if (MY_LIST_DATA.GAUGE_INTERVALS) {
    clearInterval(MY_LIST_DATA.GAUGE_INTERVALS);
  }
};

const clearFillGaugeInterval = () => {
  if (SUBSCRIBE_TYPE === 'all') clearAutoRenderIntervalAll();
  if (SUBSCRIBE_TYPE === 'my') clearAutoRenderIntervalMy();
};

const runFillGaugeInterval = () => {
  if (SUBSCRIBE_TYPE === 'all') {
    LIST_DATA.GAUGE_INTERVALS = setInterval(() => {
      document.querySelector('#angle-right i').click();
    }, 3000);
  } else if (SUBSCRIBE_TYPE === 'my') {
    MY_LIST_DATA.GAUGE_INTERVALS = setInterval(() => {
      document.querySelector('#angle-right i').click();
    }, 3000);
  }
};

const listViewPagingControls = (direction, sub) => {
  let currentCategoryIndex; // 1.지금 해당 카테고리가 뭔지

  if (SUBSCRIBE_TYPE === 'all') {
    if (direction === 'right') {
      LIST_DATA.PAGE_IN_LIST++;
    } else if (direction === 'left') {
      LIST_DATA.PAGE_IN_LIST--;
    }
    currentCategoryIndex = LIST_DATA.CURRENT_CATE_IDX;
  } else if (SUBSCRIBE_TYPE === 'my') {
    if (direction === 'right') {
      MY_LIST_DATA.PAGE_IN_LIST++;
    } else if (direction === 'left') {
      MY_LIST_DATA.PAGE_IN_LIST--;
    }
    // 1.지금 해당 카테고리가 뭔지
    currentCategoryIndex = LIST_DATA.CURRENT_CATE_IDX;
  }

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

const actionAfterSubscriptions = (target) => {
  switch (TAB_TYPE) {
    case 'grid':
      break;

    case 'list':
      target.innerText = 'x';
      target.setAttribute('aria-pressed', 'true');

      const snackbarTarget = document.querySelector('#media__subscribe_snackbar');
      snackbarTarget.classList.add('snackbar-animation');

      setTimeout(() => {
        snackbarTarget.classList.remove('snackbar-animation');
      }, 5000);

      // 내가 구독한 탭바로 이동하기
      document.querySelector('#my-press-tab').click();
      break;

    default:
      break;
  }
};

/**
 * 구독하기
 * @param {*} categoryIdx
 * @param {*} pageIdx
 * @param {*} pressName
 * @param {*} target
 */
const subscribe2Press = async (categoryIdx, pageIdx, pressName, target) => {
  let subscriptionData = '';
  let subscribeResult = { result: false, msg: '' };

  switch (TAB_TYPE) {
    case 'grid':
      subscriptionData = SubscriptionsControl.findSubscriptionsData(pressName);
      break;
    case 'list':
      subscriptionData = LIST_DATA.JSON_DATA[categoryIdx].news[pageIdx - 1];
      break;
  }

  if (subscriptionData) {
    subscribeResult = await SubscriptionsControl.insertSubscriptionsData(pressName, subscriptionData);
  }
  return subscribeResult;
};

const findPressName = (target) => {
  let imgElement;
  let pressName = '';

  switch (TAB_TYPE) {
    case 'grid':
      if (target.className === 'media__grid_type__subscribe_btn') {
        // 가장 가까운 .media__news_logo 요소 내의 img 요소 찾기
        imgElement = target.parentNode.querySelector('img');
      }
      break;

    case 'list':
      if (target.className === 'media__news_subscribe_btn') {
        // 가장 가까운 .media__news_logo 요소 내의 img 요소 찾기
        imgElement = target.closest('.media__news_logo').querySelector('img');
      }
      break;
  }
  // img 요소의 alt 속성 유효성 검사
  pressName = imgElement && imgElement.alt ? imgElement.alt : '';

  return pressName;
};

const gridSectionEventHandler = async (e) => {
  const { target } = e; // e.target을 target으로 해체 할당
  let pressName = '';

  switch (TAB_TYPE) {
    case 'grid':
      // * 화살표 클릭 이벤트
      if (target.parentNode.id === 'angle-right') {
        if (GRID_DATA.PAGE_IN_GRID === GRID_DATA.MAXIMUM_PAGE_IN_GRID) return;
        GRID_DATA.PAGE_IN_GRID++;
      }
      if (target.parentNode.id === 'angle-left') {
        if (GRID_DATA.PAGE_IN_GRID === 0) return;
        GRID_DATA.PAGE_IN_GRID--;
      }

      // * 구독하기 버튼 클릭 이벤트
      pressName = findPressName(target);
      if (pressName) {
        let { result, msg } = await subscribe2Press(LIST_DATA.CURRENT_CATE_IDX, LIST_DATA.PAGE_IN_LIST, pressName, target);
        console.log(result);
        console.log(msg);

        if (result) {
          SUBSCRIBE_TYPE = 'my';
          actionAfterSubscriptions(target);
        }
      }

      setPressDataGrid();
      break;

    case 'list':
      // * 화살표 클릭 이벤트
      if (target.parentNode.id === 'angle-right') listViewPagingControls('right');
      if (target.parentNode.id === 'angle-left') listViewPagingControls('left');

      // * 카테고리 클릭 이벤트
      const idPattern = /^category(\d+)$/;
      const match = idPattern.exec(target.id);
      if (match) {
        LIST_DATA.CURRENT_CATE_IDX = parseInt(match[1]); // 숫자로 변환하여 저장
        LIST_DATA.PAGE_IN_LIST = 1;
      }

      // * 구독하기 버튼 클릭 이벤트
      pressName = findPressName(target);
      if (pressName) {
        let { result, msg } = await subscribe2Press(LIST_DATA.CURRENT_CATE_IDX, LIST_DATA.PAGE_IN_LIST, pressName, target);
        console.log(result);
        console.log(msg);

        if (result) {
          SUBSCRIBE_TYPE = 'my';
          actionAfterSubscriptions(target);
          // setMyNewsDataList();
          return;
        }
      }

      setNewsDataList();
      break;

    default:
      break;
  }
};

const tabSectionEventHandler = (e) => {
  const { target } = e; // e.target을 target으로 해체 할당
  if (target.closest('div#list-tab')) {
    TAB_TYPE = 'list';
    document.querySelector('#list-tab path').classList.replace('grid-option', 'grid-option-select');
    document.querySelector('#grid-tab path').classList.replace('grid-option-select', 'grid-option');
    GRID_DATA.PAGE_IN_GRID = 1;
    LIST_DATA.PAGE_IN_LIST = 1;
    setNewsDataList();
  }

  if (target.closest('div#grid-tab')) {
    TAB_TYPE = 'grid';
    document.querySelector('#grid-tab path').classList.replace('grid-option', 'grid-option-select');
    document.querySelector('#list-tab path').classList.replace('grid-option-select', 'grid-option');
    GRID_DATA.PAGE_IN_GRID = 1;
    LIST_DATA.PAGE_IN_LIST = 1;
    setPressDataGrid();
  }

  if (target.id == 'all-press-tab') {
    if ((TAB_TYPE = 'list')) {
      LIST_DATA.PAGE_IN_GRID = 1;
      setNewsDataList();
    }
    if ((TAB_TYPE = 'grid')) {
    }
    const className = 'contents-select';
    applyActivatedCategory(target, className);
  }
  /************************ 구독 ***************************** */
  if (target.id == 'my-press-tab') {
    SUBSCRIBE_TYPE = 'my';

    const className = 'contents-select';
    applyActivatedCategory(target, className);

    if (TAB_TYPE == 'list') {
      MY_LIST_DATA.PAGE_IN_LIST = 1;
      setMyNewsDataList();
    }
    if (TAB_TYPE == 'grid') {
    }
  }
};

/** 이벤트 위임 */
const excuteEventDelegation = () => {
  const mediaContainer = document.querySelector('.media__container');
  const navContainer = document.querySelector('.nav__container');

  navContainer.addEventListener('click', tabSectionEventHandler);
  mediaContainer.addEventListener('click', gridSectionEventHandler);
};

/** 페이지 별 화살표 처리 */
const arrowHandlingByPage = () => {
  const leftTarget = document.getElementById('angle-left');
  const Righttarget = document.getElementById('angle-right');

  switch (TAB_TYPE) {
    case 'list':
      leftTarget.style.visibility = 'visible';
      Righttarget.style.visibility = 'visible';
      break;

    case 'grid':
      if (GRID_DATA.PAGE_IN_GRID === 1) {
        leftTarget.style.visibility = 'hidden';
      } else if (GRID_DATA.PAGE_IN_GRID === GRID_DATA.MAXIMUM_PAGE_IN_GRID) {
        leftTarget.style.visibility = 'visible';
        Righttarget.style.visibility = 'hidden';
      } else {
        leftTarget.style.visibility = 'visible';
        Righttarget.style.visibility = 'visible';
      }
      break;

    default:
      break;
  }
};

/** 랜덤한 언론사 데이터를 페이지 별로 나누기 */
const divideDataByPage = (jsonShuffleData) => {
  const totalPages = Math.ceil(jsonShuffleData.length / GRID_DATA.CONTENTS_PER_PAGE);
  const pagesToGenerate = Math.min(totalPages, GRID_DATA.MAXIMUM_PAGE_IN_GRID); //실제 페이지 수가 최대 페이지 수보다 작을 수 있으므로

  const jsonArrPerPage = Array.from({ length: pagesToGenerate }, (_, index) => {
    const start = index * GRID_DATA.CONTENTS_PER_PAGE;
    return jsonShuffleData.slice(start, start + GRID_DATA.CONTENTS_PER_PAGE);
  });

  return jsonArrPerPage;
};

/** (구독한) 카테고리 바 TAB_TYPE: 'list' */
const makeMyCategoryListHTML = (jsonData) => {
  let mainCategoryHtml = '';

  mainCategoryHtml += `<div class="media__category_bar">`;
  for (const [idx, categoryObj] of jsonData.entries()) {
    if (idx == MY_LIST_DATA.CURRENT_CATE_IDX) {
      mainCategoryHtml += `<div id="category${idx}">
                            <span>
                              ${categoryObj.pressName} 
                            </span>
                          </div>`;
    } else {
      mainCategoryHtml += `<div id="category${idx}">${categoryObj.pressName}</div>`;
    }
  }
  mainCategoryHtml += `</div>`;

  const target = document.querySelector('.media__by_type');
  target.innerHTML = mainCategoryHtml;
};

/** 카테고리 바 TAB_TYPE: 'list' */
const makeCategoryListHTML = (jsonData) => {
  let mainCategoryHtml = '';

  mainCategoryHtml += `<div class="media__category_bar">`;
  for (const [idx, categoryObj] of jsonData.entries()) {
    if (idx == LIST_DATA.CURRENT_CATE_IDX) {
      mainCategoryHtml += `<div id="category${idx}">
                            <span>
                              ${categoryObj.categoryName} ${LIST_DATA.PAGE_IN_LIST}/${LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY[LIST_DATA.CURRENT_CATE_IDX]}
                            </span>
                          </div>`;
    } else {
      mainCategoryHtml += `<div id="category${idx}">${categoryObj.categoryName}</div>`;
    }
  }
  mainCategoryHtml += `</div>`;

  const target = document.querySelector('.media__by_type');
  target.innerHTML = mainCategoryHtml;
};

/** (구독한) 카테고리 별 언론사 뉴스 */
const makeMyNewsListHTML = (currentPageData) => {
  let mainNewsHtml = '';
  // const currentPageData = currentJsonData.news[MY_LIST_DATA.PAGE_IN_LIST - 1];
  // news-container
  mainNewsHtml += `<div class="media__news_container"> 
                    <div class="media__news_logo">
                      <a target="_blank" href="${currentPageData.pressImgLink}" class="">
                        <img src="${currentPageData.pressImg}" height="20" width="auto" alt="${currentPageData.pressName}" />
                      </a>
                      <span class="media__news_time">${currentPageData.newsTime}</span>
                      <button type="button" class="media__news_subscribe_btn" aria-pressed="true">x</button>
                    </div>
                    <div class="media__news_datas">
                      <div class="media__news__main">
                        <a target="_blank" class="media__news__main__link" href="${currentPageData.mainImgLink}" >
                          <img src="${currentPageData.mainImgSrc}" alt="${currentPageData.mainHeadLine}"/>
                        </a>
                        <a target="_blank" class="media__news__main__head_line" href="${currentPageData.mainImgLink}"> ${currentPageData.mainHeadLine}</a>
                      </div>
                      
                      <ul class="media__news__sub">`;
  mainNewsHtml += currentPageData.headLines.reduce((acc, cur, idx) => {
    return (acc += `    <li>
                          <a target="_blank" href="${cur.link}" class="media__news__main__head_line"">
                            ${cur.headline}
                          </a>
                        </li>`);
  }, '');
  mainNewsHtml += `     <li>${currentPageData.pressName} 언론사에서 직접 편집한 뉴스입니다.</li>
                      </ul>
                    </div>
                  </div>`;

  // const target = document.querySelector('.listview-container');
  const target = document.querySelector('.media__by_type');
  target.insertAdjacentHTML('beforeend', mainNewsHtml);
};

/** 카테고리 별 언론사 뉴스 */
const makeNewsListHTML = (currentJsonData) => {
  let mainNewsHtml = '';
  let pressedStatus = 'false';
  const currentPageData = currentJsonData.news[LIST_DATA.PAGE_IN_LIST - 1];

  let subscribeBtn = '+ 구독하기';
  let findData = MY_LIST_DATA.CATEGORY.find((pressName) => pressName === currentPageData.pressName);
  if (findData) {
    subscribeBtn = 'x';
    pressedStatus = 'true';
  }

  // news-container
  mainNewsHtml += `<div class="media__news_container"> 
                    <div class="media__news_logo">
                      <a target="_blank" href="${currentPageData.pressImgLink}" class="">
                        <img src="${currentPageData.pressImg}" height="20" width="auto" alt="${currentPageData.pressName}" />
                      </a>
                      <span class="media__news_time">${currentPageData.newsTime}</span>
                      <button type="button" class="media__news_subscribe_btn" aria-pressed="${pressedStatus}">${subscribeBtn}</button>
                    </div>
                    <div class="media__news_datas">
                      <div class="media__news__main">
                        <a target="_blank" class="media__news__main__link" href="${currentPageData.mainImgLink}" >
                          <img src="${currentPageData.mainImgSrc}" alt="${currentPageData.mainHeadLine}"/>
                        </a>
                        <a target="_blank" class="media__news__main__head_line" href="${currentPageData.mainImgLink}"> ${currentPageData.mainHeadLine}</a>
                      </div>
                      
                      <ul class="media__news__sub">`;
  mainNewsHtml += currentPageData.headLines.reduce((acc, cur, idx) => {
    return (acc += `    <li>
                          <a target="_blank" href="${cur.link}" class="media__news__main__head_line"">
                            ${cur.headline}
                          </a>
                        </li>`);
  }, '');
  mainNewsHtml += `     <li>${currentPageData.pressName} 언론사에서 직접 편집한 뉴스입니다.</li>
                      </ul>
                    </div>
                  </div>`;

  // const target = document.querySelector('.listview-container');
  const target = document.querySelector('.media__by_type');
  target.insertAdjacentHTML('beforeend', mainNewsHtml);
};

/** 활성화된 카테고리 확인 후 적용 */
const applyActivatedCategory = (target, className) => {
  const activatedCategory = target;
  const siblings = Array.from(activatedCategory.parentNode.children);

  siblings.forEach((sibling) => {
    if (sibling !== activatedCategory) sibling.classList.remove(className);
  });
  activatedCategory.classList.add(className);
};

/** 데이터 랜덤으로 섞기 */
const dataShuffle = (jsonArray) => {
  return jsonArray.sort(() => Math.random() - 0.5);
};

/** 언론사 데이터 생성 */
const makePressGridHTML = () => {
  let mainNewsHtml = '';
  mainNewsHtml += `<ul class="media__grid_type__container">`;
  for (const pressObj of GRID_DATA.JSON_ARR_PER_PAGE[GRID_DATA.PAGE_IN_GRID - 1]) {
    mainNewsHtml += `<li>
                      <a href="#" class="media__subscription-news-view">
                        <img src="${pressObj.src}" height="20" alt="${pressObj.alt}" class="media__grid_type__news_logo" />
                      </a>
                      <button class="media__grid_type__subscribe_btn">+ 구독하기</button>
                      </li>`;
  }
  mainNewsHtml += `</ul>`;

  const target = document.querySelector('.media__by_type');
  target.innerHTML = mainNewsHtml;
};

const refetchSubsData = async () => {
  await SubscriptionsControl.fetchSubscriptionsData();
  MY_LIST_DATA.JSON_DATA = SubscriptionsControl.getSubscriptonsData();
  MY_LIST_DATA.CATEGORY = MY_LIST_DATA.JSON_DATA.map((cur) => cur.pressName);
};

/** (구독한)뉴스 데이터 리스트 생성 TAB_TYPE: 'list' */
const setMyNewsDataList = async () => {
  try {
    //1.구독한 데이터 새로 fetch
    await refetchSubsData();

    clearFillGaugeInterval();
    runFillGaugeInterval();

    makeMyCategoryListHTML(MY_LIST_DATA.JSON_DATA);

    const target = document.querySelector(`#category${MY_LIST_DATA.CURRENT_CATE_IDX}`);
    const className = 'category-select';
    applyActivatedCategory(target, className);

    makeMyNewsListHTML(MY_LIST_DATA.JSON_DATA[MY_LIST_DATA.CURRENT_CATE_IDX]);
    arrowHandlingByPage();
  } catch (error) {
    console.error(error);
  }
};

/** 뉴스 데이터 리스트 생성 TAB_TYPE: 'list' */
const setNewsDataList = async () => {
  try {
    LIST_DATA.CATEGORY = LIST_DATA.CATEGORY.length === 0 ? LIST_DATA.JSON_DATA.map((cur) => cur.categoryName) : LIST_DATA.CATEGORY;
    LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY =
      LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY.length === 0 ? LIST_DATA.JSON_DATA.map((cur) => cur.news.length) : LIST_DATA.MAXIMUM_PAGE_PER_CATEGORY;

    clearFillGaugeInterval();
    runFillGaugeInterval();

    makeCategoryListHTML(LIST_DATA.JSON_DATA);

    const target = document.querySelector(`#category${LIST_DATA.CURRENT_CATE_IDX}`);
    const className = 'category-select';
    applyActivatedCategory(target, className);

    await refetchSubsData();

    makeNewsListHTML(LIST_DATA.JSON_DATA[LIST_DATA.CURRENT_CATE_IDX]);
    arrowHandlingByPage();
  } catch (error) {
    console.error(error);
  }
};

/** 언론사 데이터 그리드 생성 TAB_TYPE: 'grid' */
export const setPressDataGrid = async () => {
  clearFillGaugeInterval();
  excuteEventDelegation();
  makePressGridHTML();
  arrowHandlingByPage();
};

/** 페이지 초기화 작업 */
export const initGridData = async () => {
  try {
    // 'pressData'(언론사)
    const jsonArray = await readJsonFile('pressData');
    const jsonShuffleData = dataShuffle(jsonArray);
    GRID_DATA.JSON_ARR_PER_PAGE = divideDataByPage(jsonShuffleData);

    // 'headlinesData'(뉴스 헤드라인)
    LIST_DATA.JSON_DATA = await readJsonFile('categoryNewsData');
    SubscriptionsControl = new SubscriptionsDataControl(LIST_DATA.JSON_DATA);

    // await SubscriptionsControl.deleteSubscriptionsData('프라임경제');
  } catch (error) {
    console.error(error);
  }
};
