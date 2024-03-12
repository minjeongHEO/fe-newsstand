import { readJsonFile } from './getJsonFile.js';
const DATA = {
  NUMBER_OF_HEADLINE_SECTION: 2,
  ROLLING_DATA_COUNT: 2,
  ROLLING_DATA_IDX: [],
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
    headLineHtml += `<div class="nav-contents-container section${idx + 1}">
                      <div class="nav-contents-press-name">
                        <ul class="banner_list">`;

    headLineHtml += Array.from({ length: DATA.ROLLING_DATA_COUNT }).reduce((acc, cur, idx) => {
      return (acc += `<li>
                <a href="${jsonData[idx].newsLink}" target="_blank">${jsonData[idx].newsName}</a>
              </li>`);
    }, '');

    headLineHtml += `</ul>
                  </div>
                  <div class="nav-contents-headline">
                    <ul class="banner_list">`;

    headLineHtml += Array.from({ length: DATA.ROLLING_DATA_COUNT }).reduce((acc, cur, idx) => {
      return (acc += `<li>
                <a href="${jsonData[idx].contentsLink}" target="_blank">${jsonData[idx].contentsHeader}</a>
              </li>`);
    }, '');

    headLineHtml += `</ul>
                    </div>
                  </div>`;
  }

  const target = document.getElementById('nav-container');
  target.innerHTML = headLineHtml;
}

/** 헤드라인 태그 html 추가 */
function appendHtml(divideJsonData, sectionNum) {
  // setInterval(() => {
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
  // *1)
  pressNameUlTarget.insertAdjacentHTML('beforeend', pressNameHtml);
  headLineUlTarget.insertAdjacentHTML('beforeend', headLineHtml);
  // }, 500);
}

/** 헤드라인 뉴스 생성 */
export async function setHeadLineNews() {
  const jsonData = await readJsonFile('headlinesData');
  const divideJsonData = await divideDataByGrid(jsonData);
  drawHtml(divideJsonData);

  divideJsonData.forEach((_, idx) => {
    appendHtml(divideJsonData, idx);
  });
}

/**
 * *1)
 *  insertAdjacentHTML 메서드는 첫 번째 인자로 HTML 문자열을 삽입할 위치를 지정합니다
 * (beforebegin, afterbegin, beforeend, afterend 중 하나).
 * 여기서는 beforeend를 사용하여 ul 요소의 마지막 자식으로 새 li 요소를 추가하는 방식을 선택했습니다.
 * 이 방법을 통해 기존 내용을 유지하면서 새로운 내용을 추가할 수 있습니다
 */
