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

/** 헤드라인 뉴스 생성 */
export async function setHeadLineNews() {
  const jsonData = await readJsonFile('headlinesData');
  const divideJsonData = await divideDataByGrid(jsonData);
  debugger;

  let headLineHtml = '';
  // divideJsonData.length 만큼이 섹션 수
  for (const jsonData of divideJsonData) {
    headLineHtml += `<div class="nav-contents-container left">
                      <div class="nav-contents-press-name">
                        <ul class="banner_list">`;

    for (const newsData of jsonData) {
      headLineHtml += `<li>
                        <a href="${newsData.newsLink}" target="_blank">${newsData.newsName}</a>
                      </li>`;
    }
    headLineHtml += `</ul>
                  </div>
                  <div class="nav-contents-headline">
                    <ul class="banner_list">`;
    for (const newsData of jsonData) {
      headLineHtml += `<li>
                        <a href="${newsData.contentsLink}" target="_blank">${newsData.contentsHeader}</a>
                        </li>`;
    }
    headLineHtml += `</ul>
                    </div>
                  </div>`;
  }

  const target = document.getElementById('nav-container');
  target.innerHTML = headLineHtml;

  // removeLeftNews();
  // createLeftNews(jsonDataLeft);
}
