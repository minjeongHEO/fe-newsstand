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

  // const leftGridData = divideJsonData[0];
  // const rightgridData = divideJsonData[1];

  let headLineHtml = '';

  const jsonDataLeft = jsonData.slice(0, jsonData.length / NUMBER_OF_HEADLINE_SECTION);
  const jsonDataRight = jsonData.slice(jsonData.length / NUMBER_OF_HEADLINE_SECTION);

  // for (let index = 0; index < NUMBER_OF_HEADLINE_SECTION; index++) {
  headLineHtml += `<div class="nav-contents-container left">
        <div class="nav-contents-press-name">
          <ul class="banner_list">
            <li>
              <a href="${jsonDataLeft[0].newsLink}" target="_blank">${jsonDataLeft[0].newsName}</a>
            </li>
            <li style="background-color: yellow;">
              <a href="${jsonDataLeft[1].newsLink}" target="_blank">${jsonDataLeft[1].newsName}</a>
            </li>
          </ul>
        </div>
        <div class="nav-contents-headline">
          <ul class="banner_list">
            <li>
              <a href="${jsonDataLeft[0].contentsLink}" target="_blank">${jsonDataLeft[0].contentsHeader}</a>
            </li>
            <li style="background-color: yellow;">
              <a href="${jsonDataLeft[1].contentsLink}" target="_blank">${jsonDataLeft[1].contentsHeader}</a>
            </li>
          </ul>
        </div>
      </div>`;
  // }

  headLineHtml += `<div class="nav-contents-container right">
      <div class="nav-contents-press-name">
        <ul class="banner_list">
          <li>
            <a href="${jsonDataRight[0].newsLink}" target="_blank">${jsonDataRight[0].newsName}</a>
          </li>
          <li>
            <a href="${jsonDataRight[1].newsLink}" target="_blank">${jsonDataRight[1].newsName}</a>
          </li>
        </ul>
      </div>
      <div class="nav-contents-headline">
        <ul class="banner_list">
          <li>
            <a href="${jsonDataRight[0].contentsLink}" target="_blank">${jsonDataRight[0].contentsHeader}</a>
          </li>
          <li>
            <a href="${jsonDataRight[1].contentsLink}" target="_blank">${jsonDataRight[1].contentsHeader}</a>
          </li>
        </ul>
      </div>
    </div>`;

  const target = document.getElementById('nav-container');
  target.innerHTML = headLineHtml;

  removeLeftNews();
  createLeftNews(jsonDataLeft);
}
