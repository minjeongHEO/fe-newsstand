import { readJsonFile } from './getJsonFile.js';

/**
 * [x] 리스너 위임하는 방법으로 변경
 * [ ] 그리드,리스트 탭 클릭 => 버그
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
  if (target.id === 'list-tab') setNewsDataGrid();
  if (target.id === 'grid-tab') setPressDataGrid();
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

  if (DATA.PAGE_IN_GRID === 1) {
    leftTarget.style.visibility = 'hidden';
  } else if (DATA.PAGE_IN_GRID === DATA.NUMBER_OF_PAGE_IN_GRID) {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'hidden';
  } else {
    leftTarget.style.visibility = 'visible';
    Righttarget.style.visibility = 'visible';
  }
};

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

const drawPressDataHtml = async () => {
  let mainNewsHtml = '';
  mainNewsHtml += `<div id="angle-left">
                      <i class="fi fi-rr-angle-left"></i>
                    </div>`;

  mainNewsHtml += `<ul class="press-logo-container" id="press-logo-container">`;

  for (const pressObj of DATA.JSON_ARR_PER_PAGE[DATA.PAGE_IN_GRID - 1]) {
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

const drawNewsDataHtml = async () => {
  let mainNewsHtml = '';
  mainNewsHtml += `<div id="angle-left">
                      <i class="fi fi-rr-angle-left"></i>
                    </div>`;
  mainNewsHtml += `
              <div class="listview-container">
                <div class="category-bar">
                  <div class="category-select">종합/경제</div>
                  <div>방송/통신</div>
                  <div>IT</div>
                  <div>영자지</div>
                  <div>스포츠/연예</div>
                  <div>매거진/전문지</div>
                  <div>지역</div>
                </div>

                <div class="news-container">
                  <div class="news-logo">
                    <a target="_blank" href="https://newsstand.naver.com/032" class="MediaNewsView-module__news_logo___LwMpl">
                      <img src="https://s.pstatic.net/static/newsstand/2020/logo/light/0604/032.png" height="20" width="auto" alt="경향신문" />
                    </a>
                    <span class="MediaNewsView-module__news_text___hi3Xf">
                      <span class="MediaNewsView-module__time___fBQhP">03월 13일 19:10 직접 편집</span>
                    </span>
                    <button type="button" class="MediaNewsView-module__btn_cancel____bfsE" aria-pressed="false">
                      <span class="blind">구독취소</span>
                    </button>
                  </div>
                  <div class="news-datas">
                    <div class="main-news">
                      <a
                        target="_blank"
                        href="https://www.khan.co.kr/politics/politics-general/article/202403131857001/?nv=stand&amp;utm_source=naver&amp;utm_medium=portal_news&amp;utm_content=240313&amp;utm_campaign=newsstand_top_imageC"
                        class="main-img MediaNewsView-module__link_thumb___rmMr4"
                      >
                          <img
                            src="https://s.pstatic.net/dthumb.phinf/?src=%22https%3A%2F%2Fs.pstatic.net%2Fstatic%2Fnewsstand%2F2024%2F0313%2Farticle_img%2Fnew_main%2F9001%2F191606_001.jpg%22&amp;type=nf312_208&amp;service=navermain"
                            alt="“목소리 자신 있으면 20대로”···이혜훈 측 ‘여론조사 거짓응답 의혹’ 선관위 조사"
                          />
                      </a>
                      <a class="main-headline">공공병원 月1800만원 준다는데 19명 모집에 2명 지원</a>
                    </div>

                    <ul class="sub-news">
                      <li>
                        <a
                          target="_blank"
                          href="https://www.khan.co.kr/national/national-general/article/202403131500011/?nv=stand&amp;utm_source=naver&amp;utm_medium=portal_news&amp;utm_content=240313&amp;utm_campaign=newsstand_top_thumb1C"
                          class="MediaNewsView-module__link_item___x0z7x"
                          >“정몽규는 나가고, 관중석은 비우자” 태국전 보이콧 여론 '들썩'ddssdfsdfsdfsdfsdfsdfsdfsdfsd
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank" href="" class="">dd
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank" href="" class="">dd
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank" href="" class="">dd
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank" href="" class="">dd
                        </a>
                      </li>
                      <li>
                        <a
                          target="_blank" href="" class="">dd
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>`;

  mainNewsHtml += `<div id="angle-right">
                    <i class="fi fi-rr-angle-right"></i>
                  </div>`;

  const target = document.querySelector('.press-news-container');

  target.innerHTML = mainNewsHtml;
};

/** 뉴스 데이터 그리드 생성 TAB_TYPE: 'list' */
const setNewsDataGrid = async () => {
  excuteEventDelegation();
  await drawNewsDataHtml();
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
  DATA.JSON_ARR_PER_PAGE = await divideDataByPage(jsonShuffleData);
};
