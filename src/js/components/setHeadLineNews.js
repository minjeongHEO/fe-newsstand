import { readJsonFile } from './getJsonFile.js';
const ROLLING_DATA = {
  NUMBER_OF_SECTION: 2,
  INTERVALS: {}, // 인터벌 ID를 저장하기 위한 객체
  TAG_IDX: [],
  DIVIDE_JSON: null,
  SETTIMEOUT: [],
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

const clearAnimationClass = (section) => {
  document.querySelectorAll(`.section${section + 1} .headline__rolling_box`).forEach((rollingBox) => {
    rollingBox.querySelectorAll('.pre_text').forEach((e) => e.classList.remove('text_move_up'));
    rollingBox.querySelectorAll('.cur_text').forEach((e) => e.classList.remove('text_move_up'));
    rollingBox.querySelectorAll('.next_text').forEach((e) => e.classList.remove('text_move_up'));
  });
};

const addAnimationClass = (section) => {
  document.querySelectorAll(`.section${section + 1} .headline__rolling_box`).forEach((rollingBox) => {
    rollingBox.querySelectorAll('.pre_text').forEach((e) => e.classList.add('text_move_up'));
    rollingBox.querySelectorAll('.cur_text').forEach((e) => e.classList.add('text_move_up'));
    rollingBox.querySelectorAll('.next_text').forEach((e) => e.classList.add('text_move_up'));
  });
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

function toggleRollingAnimation(section, rollingPause) {
  document.querySelectorAll(`.headline__contents.section${section + 1} .headline__rolling_box`).forEach((rollingBox) => {
    if (rollingPause) {
      if (rollingBox.children[0]) {
        rollingBox.children[0].classList.add('text_move_up_paused');
      }
      // 두 번째 div의 클래스 이름을 'cur_text'로 변경
      if (rollingBox.children[1]) {
        rollingBox.children[1].classList.add('text_move_up_paused');
      }
      // 세 번째 div의 클래스 이름을 'next_text'로 유지 혹은 변경
      if (rollingBox.children[2]) {
        rollingBox.children[2].classList.add('text_move_up_paused');
      }
    } else {
      if (rollingBox.children[0]) {
        rollingBox.children[0].classList.remove('text_move_up_paused');
      }
      // 두 번째 div의 클래스 이름을 'cur_text'로 변경
      if (rollingBox.children[1]) {
        rollingBox.children[1].classList.remove('text_move_up_paused');
      }
      // 세 번째 div의 클래스 이름을 'next_text'로 유지 혹은 변경
      if (rollingBox.children[2]) {
        rollingBox.children[2].classList.remove('text_move_up_paused');
      }
    }
  });
}

/** 마우스 이벤트 리스너 설정 */
function setupEventsHandler(section) {
  const container = document.querySelector(`.headline__contents.section${section + 1}`);
  if (!container) return;

  // 마우스 오버 시 롤링 정지
  container.addEventListener('mouseover', () => {
    stopRollingInterval(section); // 마우스 오버 시 인터벌 정지
    toggleRollingAnimation(section, true); // 애니메이션 일시정지 클래스 추가
  });

  // 마우스 아웃 시 롤링 재개
  container.addEventListener('mouseout', () => {
    runIntervalRolling(section); // 인터벌 재시작
    toggleRollingAnimation(section, false); // 애니메이션 일시정지 클래스 제거
  });
}

/** 섹션별로 마우스 오버 시 인터벌 정지 */
function stopRollingInterval(section) {
  // setInterval 중지
  if (ROLLING_DATA.INTERVALS[section]) {
    clearInterval(ROLLING_DATA.INTERVALS[section]);
  }
  // setTimeout 중지
  if (ROLLING_DATA.SETTIMEOUT[section]) {
    clearTimeout(ROLLING_DATA.SETTIMEOUT[section]);
  }
}

/** 롤링 */
const rolling = (section) => {
  addAnimationClass(section);

  ROLLING_DATA.SETTIMEOUT[section] = setTimeout(() => {
    clearAnimationClass(section);
    removeHeadLine(section);
    addHeadLine(section);
    changeClassName(section);
  }, 3000);
};

/** 인터벌 롤링 */
const runIntervalRolling = (section) => {
  // 이전에 설정된 인터벌이 있다면 중지
  if (ROLLING_DATA.INTERVALS[section]) {
    clearInterval(ROLLING_DATA.INTERVALS[section]);
  }

  const delay = section === 0 ? 0 : 1000; // 섹션 0은 지연 없음, 그 외는 1초 지연

  setTimeout(() => {
    ROLLING_DATA.INTERVALS[section] = setInterval(() => {
      rolling(section);
    }, 4000);
  }, delay);
};

/** 헤드라인 뉴스 생성 */
export const setHeadLineNews = async () => {
  try {
    const jsonData = await readJsonFile('headlinesData');
    const divideJsonData = divideDataByGrid(jsonData);
    ROLLING_DATA.DIVIDE_JSON = divideJsonData;

    makeHeadLineHTML(divideJsonData);

    runIntervalRolling(0);
    runIntervalRolling(1);

    setupEventsHandler(0);
    setupEventsHandler(1);
  } catch (error) {
    console.error(error);
  }
};
