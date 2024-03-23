import { readJsonFile } from './getJsonFile.js';
const ROLLING_DATA = {
  NUMBER_OF_SECTION: 2,
  INTERVALS: {}, // 인터벌 ID를 저장하기 위한 객체
  TAG_IDX: [],
  DIVIDE_JSON: null,
};

/** 헤드라인 데이터를 섹션 수 별로 나누기 */
function divideDataByGrid(jsonData) {
  const jsonDataPerGrid = jsonData.reduce(
    (acc, cur, idx) => {
      const elementPerGrid = Math.floor(jsonData.length / ROLLING_DATA.NUMBER_OF_SECTION);
      // 현재 요소의 인덱스를 사용하여 속할 섹션을 계산
      const sectionIdx = Math.floor(idx / elementPerGrid);
      acc[sectionIdx].push(cur);
      return acc;
    },
    Array.from({ length: ROLLING_DATA.NUMBER_OF_SECTION }, () => [])
  );
  return jsonDataPerGrid;
}

/** html 그리기 */
const makeHeadLineHTML = (divideJsonData) => {
  let headLineHtml = Array.from({ length: divideJsonData.length }).reduce((acc, cur, idx) => {
    acc += `<div class="headline__contents section${idx + 1}">
              <div class="headline__press_name">
                <div class="headline__rolling_box">
                  <div class="pre_text">
                    <a href="${divideJsonData[idx][0].newsLink}" target="_blank">${divideJsonData[idx][0].newsName}</a>
                  </div>
                  <div class="cur_text">
                    <a href="${divideJsonData[idx][1].newsLink}" target="_blank">${divideJsonData[idx][1].newsName}</a>
                  </div>
                  <div class="next_text">
                    <a href="${divideJsonData[idx][2].newsLink}" target="_blank">${divideJsonData[idx][2].newsName}</a>
                  </div>
                </div>
              </div>
              <div class="headline__news">
                <div class="headline__rolling_box">
                  <div class="pre_text">
                    <a href="${divideJsonData[idx][0].contentsLink}" target="_blank">${divideJsonData[idx][0].contentsHeader}</a>
                  </div>
                  <div class="cur_text">
                    <a href="${divideJsonData[idx][1].contentsLink}" target="_blank">${divideJsonData[idx][1].contentsHeader}</a>
                  </div>
                  <div class="next_text">
                    <a href="${divideJsonData[idx][2].contentsLink}" target="_blank">${divideJsonData[idx][2].contentsHeader}</a>
                  </div>
                </div>
              </div>
            </div>`;
    ROLLING_DATA.TAG_IDX[idx] = 3;
    return acc;
  }, '');

  const target = document.querySelector('.headline__container');
  target.innerHTML = headLineHtml;
};

const clearAnimationClass = () => {
  document.querySelectorAll('.pre_text').forEach((e) => e.classList.remove('text_move_up'));
  document.querySelectorAll('.cur_text').forEach((e) => e.classList.remove('text_move_up'));
  document.querySelectorAll('.next_text').forEach((e) => e.classList.remove('text_move_up'));
};

const addAnimationClass = () => {
  // QUERY_SELECT_TARGET.ALL_PRE_TEXT.forEach((e) => e.classList.add('text_move_up'));
  document.querySelectorAll('.pre_text').forEach((e) => e.classList.add('text_move_up'));
  document.querySelectorAll('.cur_text').forEach((e) => e.classList.add('text_move_up'));
  document.querySelectorAll('.next_text').forEach((e) => e.classList.add('text_move_up'));
};

const removeHeadLine = (section) => {
  document.querySelectorAll(`.section${section + 1} .headline__rolling_box`).forEach((rollingBox) => {
    // 첫 번째 자식 요소가 존재하는 경우에만 삭제를 시도.
    // if (rollingBox.firstChild) {
    if (rollingBox.firstElementChild) {
      // rollingBox.removeChild(rollingBox.firstChild);
      rollingBox.removeChild(rollingBox.firstElementChild);
    }
    // rollingBox.removeChild(); //이러니까 삭제안됌
    //removeChild 메소드를 사용할 때는 삭제하고자 하는 자식 노드의 참조를 인자로 전달해야 함.
  });
};

const addHeadLine = (section) => {
  const divideJsonData = ROLLING_DATA.DIVIDE_JSON;
  const pressHTML = `<div class="next_text">
                        <a href="${divideJsonData[section][ROLLING_DATA.TAG_IDX[section] % 5].newsLink}" target="_blank">
                          ${divideJsonData[section][ROLLING_DATA.TAG_IDX[section] % 5].newsName}
                        </a>
                      </div>`;
  const pressTarget = document.querySelector(`.section${section + 1} .headline__press_name .headline__rolling_box`);
  pressTarget.insertAdjacentHTML('beforeend', pressHTML);

  const headlineHTML = `<div class="next_text">
                          <a href="${divideJsonData[section][ROLLING_DATA.TAG_IDX[section] % 5].contentsLink}" target="_blank">
                            ${divideJsonData[section][ROLLING_DATA.TAG_IDX[section] % 5].contentsHeader}
                          </a>
                        </div>`;
  const headlineTarget = document.querySelector(`.section${section + 1} .headline__news .headline__rolling_box`);
  headlineTarget.insertAdjacentHTML('beforeend', headlineHTML);
  ROLLING_DATA.TAG_IDX[section]++;
};

const changeClassName = (section) => {
  document.querySelectorAll(`.section${section + 1} .headline__rolling_box`).forEach((rollingBox) => {
    // 첫 번째 div의 클래스 이름을 'pre_text'로 변경
    if (rollingBox.children[0]) {
      rollingBox.children[0].className = 'pre_text';
    }
    // 두 번째 div의 클래스 이름을 'cur_text'로 변경
    if (rollingBox.children[1]) {
      rollingBox.children[1].className = 'cur_text';
    }
    // 세 번째 div의 클래스 이름을 'next_text'로 유지 혹은 변경
    if (rollingBox.children[2]) {
      rollingBox.children[2].className = 'next_text';
    }
  });
};

/** 헤드라인 뉴스 생성 */
export const setHeadLineNews = async () => {
  try {
    const jsonData = await readJsonFile('headlinesData');
    const divideJsonData = divideDataByGrid(jsonData);
    ROLLING_DATA.DIVIDE_JSON = divideJsonData;

    makeHeadLineHTML(divideJsonData);
    console.log(1);

    setInterval(() => {
      addAnimationClass();
      setTimeout(() => {
        clearAnimationClass();
        removeHeadLine(0);
        removeHeadLine(1);
        addHeadLine(0);
        addHeadLine(1);
        changeClassName(0);
        changeClassName(1);
      }, 3000);
    }, 4000);
  } catch (error) {
    console.error(error);
  }
};
