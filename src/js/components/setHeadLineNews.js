import { readJsonFile } from './getJsonFile.js';

const NUMBER_OF_HEADLINE_SECTION = 2;

/** 헤드라인 뉴스 생성 */
export async function setHeadLineNews() {
  const jsonData = await readJsonFile('headlinesData');
  // const obj = JSON.parse(jsonData); //JSON.parse(): JSON 문자열을 JavaScript 객체로 변환(jsonData는 이미 객체임)
  let headLineHtml = '';

  jsonData.slice(0, jsonData.length / NUMBER_OF_HEADLINE_SECTION);
  jsonData.slice(jsonData.length / NUMBER_OF_HEADLINE_SECTION);

  for (let index = 0; index < NUMBER_OF_HEADLINE_SECTION; index++) {
    headLineHtml += `<div class="nav-contents-container">
      <div class="nav-contents-press-name">연합 뉴스</div>
      <div class="nav-contents-headline">'면허정지'에도 꿈쩍않는 전공의…대학들은 "2천명 이상 증...</div>
    </div>`;
  }

  const target = document.getElementById('nav-container');
  target.innerHTML = headLineHtml;
}
