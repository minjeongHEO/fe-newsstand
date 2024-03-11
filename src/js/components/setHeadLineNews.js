import { readJsonFile } from './getJsonFile.js';

const NUMBER_OF_HEADLINE_SECTION = 2;

function createLeftNews(jsonDataLeft) {
  setInterval(() => {
    // 'nav-contents-press-name' 클래스를 가진 요소의 하위에서 첫 번째 'ul' 태그
    let nameUlTag = document.querySelector('.nav-contents-press-name ul');
    let headlineUlTag = document.querySelector('.nav-contents-headline ul');

    // 새로운 'li' 요소 생성
    let newNameLi = document.createElement('li');
    let newHeadlineLi = document.createElement('li');

    // 'li' 요소에 스타일과 내용 설정
    newNameLi.style.backgroundColor = 'green';
    newHeadlineLi.style.backgroundColor = 'green';
    newNameLi.innerHTML = `<a href="${jsonDataLeft[3].newsLink}" target="_blank">33333333${jsonDataLeft[3].newsName}</a>`;
    newHeadlineLi.innerHTML = `<a href="${jsonDataLeft[3].contentsLink}" target="_blank">33333333${jsonDataLeft[3].contentsHeader}</a>`;

    // 생성한 'li' 요소를 'ul' 요소에 추가
    nameUlTag.appendChild(newNameLi);
    headlineUlTag.appendChild(newHeadlineLi);
  }, 2000);
}

function removeLeftNews() {
  setInterval(() => {
    // 'nav-contents-press-name' 클래스를 가진 요소의 하위에서 첫 번째 'ul' 태그
    let nameUlTag = document.querySelector('.nav-contents-press-name ul');
    let headlineUlTag = document.querySelector('.nav-contents-headline ul');

    // 'ul' 태그의 첫 번째 'li' 태그
    let firstNameLiTag = nameUlTag.querySelector('li');
    let firstHeadLineLiTag = headlineUlTag.querySelector('li');

    // 있다면 삭제
    if (firstNameLiTag) nameUlTag.removeChild(firstNameLiTag);
    if (firstHeadLineLiTag) headlineUlTag.removeChild(firstHeadLineLiTag);
  }, 2000);
}

// function removeRightNews(params) {
//   setInterval(() => {
//     // 'nav-contents-press-name' 클래스를 가진 요소의 하위에서 첫 번째 'ul' 태그를 찾음
//     let ulTag = document.querySelector('.nav-contents-press-name ul');

//     // 'ul' 태그의 첫 번째 'li' 태그를 찾음
//     let firstLiTag = ulTag.querySelector('li');

//     // 'ul' 태그로부터 첫 번째 'li' 태그를 삭제
//     if (firstLiTag) ulTag.removeChild(firstLiTag);
//   }, 5000);
// }

/** 헤드라인 뉴스 생성 */
export async function setHeadLineNews() {
  const jsonData = await readJsonFile('headlinesData');
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
