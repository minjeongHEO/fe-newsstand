import { readJsonFile } from './getJsonFile.js';
const DATA = {
  NUMBER_OF_HEADLINE_SECTION: 2,
  ROLLING_DATA_COUNT: 2,
  ROLLING_DATA_IDX: [],
  INTERVALS: {}, // 인터벌 ID를 저장하기 위한 객체
};

/** 헤드라인 데이터를 섹션 수 별로 나누기 */
async function divideDataByGrid(jsonData) {
  const jsonDataPerGrid = jsonData.reduce(
    (acc, cur, idx) => {
      const elementPerGrid = Math.floor(jsonData.length / DATA.NUMBER_OF_HEADLINE_SECTION);
      // 현재 요소의 인덱스를 사용하여 속할 섹션을 계산
      const sectionIdx = Math.floor(idx / elementPerGrid);
      acc[sectionIdx].push(cur);
      return acc;
    },
    Array.from({ length: DATA.NUMBER_OF_HEADLINE_SECTION }, () => [])
  );
  return jsonDataPerGrid;
}

/** html 그리기 */
function drawHtml(divideJsonData) {
  let headLineHtml = '';
  // divideJsonData.length 만큼이 섹션 수
  for (const [idx, jsonData] of divideJsonData.entries()) {
    headLineHtml += `<div class="headline__contents section${idx + 1}">
                      <div class="contents__press_name">
                        <div class="contents__rolling_box">`;

    headLineHtml += Array.from({ length: DATA.ROLLING_DATA_COUNT }).reduce((acc, cur, idx) => {
      return (acc += `<a href="${jsonData[idx].newsLink}" target="_blank">${jsonData[idx].newsName}</a>`);
    }, '');

    headLineHtml += `   </div>
                      </div>
                      <div class="contents__head_line">
                        <div class="contents__rolling_box">`;
    headLineHtml += Array.from({ length: DATA.ROLLING_DATA_COUNT }).reduce((acc, cur, idx) => {
      return (acc += `<a href="${jsonData[idx].contentsLink}" target="_blank">${jsonData[idx].contentsHeader}</a>`);
    }, '');

    headLineHtml += ` </div>
                      </div>
                    </div>
                  </div>`;
  }

  const target = document.querySelector('.headline__container');
  target.innerHTML = headLineHtml;
}

/** 헤드라인 태그 html 추가 */
function appendHtml(divideJsonData, sectionNum) {
  if (DATA.ROLLING_DATA_IDX[sectionNum] == undefined) {
    DATA.ROLLING_DATA_IDX[sectionNum] = DATA.ROLLING_DATA_COUNT;
  } else {
    DATA.ROLLING_DATA_IDX[sectionNum]++;
  }

  if (DATA.ROLLING_DATA_IDX[sectionNum] >= divideJsonData[sectionNum].length) {
    DATA.ROLLING_DATA_IDX[sectionNum] = 0;
  }

  const pressNameHtml = `<li style="background-color:yellow">
      <a href="${divideJsonData[sectionNum][DATA.ROLLING_DATA_IDX[sectionNum]].newsLink}" target="_blank">${
    divideJsonData[sectionNum][DATA.ROLLING_DATA_IDX[sectionNum]].newsName
  }</a>
      </li>`;

  const headLineHtml = `<li style="background-color: yellow;">
                  <a href="${divideJsonData[sectionNum][DATA.ROLLING_DATA_IDX[sectionNum]].contentsLink}" target="_blank">${
    divideJsonData[sectionNum][DATA.ROLLING_DATA_IDX[sectionNum]].contentsHeader
  }</a>
                </li>`;

  const pressNameUlTag = `.nav-contents-container.section${sectionNum + 1} .nav-contents-press-name ul`;
  const pressNameUlTarget = document.querySelector(pressNameUlTag);

  const headLineUlTag = `.nav-contents-container.section${sectionNum + 1} .nav-contents-headline ul`;
  const headLineUlTarget = document.querySelector(headLineUlTag);

  pressNameUlTarget.insertAdjacentHTML('beforeend', pressNameHtml);
  headLineUlTarget.insertAdjacentHTML('beforeend', headLineHtml);
}

/** 헤드라인 태그 html 삭제 */
function removeHtml(sectionNum) {
  const pressNameUlTag = `.nav-contents-container.section${sectionNum + 1} .nav-contents-press-name ul`;
  const headLineUlTag = `.nav-contents-container.section${sectionNum + 1} .nav-contents-headline ul`;
  const pressNameUlTarget = document.querySelector(pressNameUlTag);
  const headLineUlTarget = document.querySelector(headLineUlTag);

  // 'ul' 태그의 첫 번째 'li' 태그
  let firstNameLiTag = pressNameUlTarget.querySelector('li');
  let firstHeadLineLiTag = headLineUlTarget.querySelector('li');

  // 있다면 삭제
  if (firstNameLiTag) pressNameUlTarget.removeChild(firstNameLiTag);
  if (firstHeadLineLiTag) headLineUlTarget.removeChild(firstHeadLineLiTag);
}

function applyRollingAnimation(sectionNum) {
  // 롤링 로직...
  const ulTag = `.nav-contents-container.section${sectionNum + 1} .banner_list`;
  const ulTarget = document.querySelectorAll(ulTag);
  ulTarget.forEach((value) => {
    value.classList.add('rolling_active');

    setTimeout(() => {
      value.classList.remove('rolling_active');
    }, 5000);
  });
}

/** 섹션별로 마우스 오버 시 인터벌 정지 */
function stopSectionInterval(sectionNum) {
  if (DATA.INTERVALS[sectionNum]) {
    clearInterval(DATA.INTERVALS[sectionNum].append);
    clearInterval(DATA.INTERVALS[sectionNum].remove);
    clearInterval(DATA.INTERVALS[sectionNum].animate);
  }
}

function toggleRollingAnimation(sectionNum, rollingPause) {
  const target = document.querySelector(`.nav-contents-container.section${sectionNum + 1}`);
  if (rollingPause) {
    target.classList.add('rolling_pause');
  } else {
    target.classList.remove('rolling_pause');
  }
}

/** 마우스 이벤트 리스너 설정 */
function setupMouseEvents(sectionNum) {
  const container = document.querySelector(`.nav-contents-container.section${sectionNum + 1}`);
  if (!container) return;

  container.addEventListener('mouseover', () => {
    stopSectionInterval(sectionNum); // 마우스 오버 시 인터벌 정지
    toggleRollingAnimation(sectionNum, true); // 마우스 오버 시 애니메이션 일시정지
  });

  container.addEventListener('mouseout', () => {
    startSectionInterval(sectionNum); // 마우스 아웃 시 인터벌 재시작
    toggleRollingAnimation(sectionNum, false); // 마우스 아웃 시 애니메이션 재개
  });
}

/** 섹션별로 인터벌 시작 */
function startSectionInterval(divideJsonData, sectionNum) {
  if (!DATA.INTERVALS[sectionNum]) DATA.INTERVALS[sectionNum] = {};

  // appendHtml 인터벌
  DATA.INTERVALS[sectionNum].append = setInterval(() => {
    appendHtml(divideJsonData, sectionNum);
  }, 5000);

  // removeHtml 인터벌
  DATA.INTERVALS[sectionNum].remove = setInterval(() => {
    removeHtml(sectionNum);
  }, 5000);

  // 롤링 애니메이션 인터벌
  DATA.INTERVALS[sectionNum].animate = setInterval(() => {
    applyRollingAnimation(sectionNum);
  }, 6000 + sectionNum * 1000); // 각 섹션별로 1초의 시간 차
}

/** 헤드라인 뉴스 생성 */
export const setHeadLineNews = async () => {
  try {
    const jsonData = await readJsonFile('headlinesData');
    const divideJsonData = await divideDataByGrid(jsonData);

    // drawHtml(divideJsonData);

    // divideJsonData.forEach((element, idx) => {
    //   startSectionInterval(divideJsonData, idx);
    //   setupMouseEvents(element,idx);
    // });
  } catch (error) {
    console.error(error);
  }
};
