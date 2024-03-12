import { readJsonFile } from './getJsonFile.js';

const NUMBER_OF_HEADLINE_SECTION = 2;

/** 헤드라인 데이터를 섹션 수 별로 나누기 */
async function divideDataByGrid(jsonData) {
  const jsonDataPerGrid = jsonData.reduce(
    (acc, cur, idx) => {
      const elementPerGrid = Math.floor(jsonData.length / NUMBER_OF_HEADLINE_SECTION);
      // 현재 요소의 인덱스를 사용하여 속할 섹션을 계산
      const sectionIdx = Math.floor(idx / elementPerGrid);
      acc[sectionIdx].push(cur);
      return acc;
    },
    Array.from({ length: NUMBER_OF_HEADLINE_SECTION }, () => [])
  );
  return jsonDataPerGrid;
}

function drawHtml(divideJsonData) {
  let headLineHtml = '';
  // divideJsonData.length 만큼이 섹션 수
  for (const [idx, jsonData] of divideJsonData.entries()) {
    headLineHtml += `<div class="nav-contents-container section${idx + 1}">
                      <div class="nav-contents-press-name">
                        <ul class="banner_list">`;

    headLineHtml += Array.from({ length: 2 }).reduce((acc, cur, idx) => {
      return (acc += `<li>
                <a href="${jsonData[idx].newsLink}" target="_blank">${jsonData[idx].newsName}</a>
              </li>`);
    }, '');

    headLineHtml += `</ul>
                  </div>
                  <div class="nav-contents-headline">
                    <ul class="banner_list">`;

    headLineHtml += Array.from({ length: 2 }).reduce((acc, cur, idx) => {
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

/** 헤드라인 뉴스 생성 */
export async function setHeadLineNews() {
  const jsonData = await readJsonFile('headlinesData');
  const divideJsonData = await divideDataByGrid(jsonData);
  drawHtml(divideJsonData);

  // removeLeftNews();
  // createLeftNews(jsonDataLeft);
}
