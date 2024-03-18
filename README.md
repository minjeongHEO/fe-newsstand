# fe-newsstand

`#html` `#css` `#event` `#html`

`npm install -g live-server` 설치

`live-server` 명령어로 실행

## 구현 내용

### ✨ 레이아웃

🗓 week 1

- [x] flex적용한 부분 grid로 수정하기
- [x] 반복되는 태그작업을 jsx문법처럼 가독성 있게 수정하기
- [x] 상단 로고 및 시간

🗓 week 2

- [x] 전체 카테고리 리스트보기 (5page)
- [x] 레이아웃 다시 잡기
- [x] BEM 적용해보기

🗓 week 3📌

- [x] 그리드 타입 - 전체 언론사 - 구독하기 (mouse hover)
- [ ] 그리드 타입 - 전체 언론사 - 해지하기 (mouse hover)

- [ ] 리스트 타입 - 전체 언론사 - 구독하기 시 스낵바
- [ ] 리스트 타입 - 내가 구독한 언론사 - 해지하기 시 얼럿창

- [ ] 카테고리 추가영역 노출 처리 (9page)

### 🔧 기능

🗓 week 1

- [x] 언론사 데이터 크롤링  
       `npm init -y`  
       `npm i puppeteer`  
       다음 페이지를 클릭해서 모든 언론사 정보를 크롤링한다.
- [x] 롤링 뉴스 데이터 크롤링
      3초 단위로 뉴스 데이터를 크롤링하여, 총 5개 받아온다.
- [x] 크롤링 데이터 json 파일 생성  
       `node src/js/crawling/getJsonFile.js`  
       해당 파일을 실행하여 크롤링한 데이터를 json파일로 생성한다.
- [x] 날짜 데이터
- [x] 언론사 그리드 스와이퍼 작업

🗓 week 2

- [x] 배열의 고차함수를 적극 사용해본다.
- [x] 나만의 reduce 함수를 직접 만들어서 활용해본다.
- [x] 객체리터럴이나 클래스를 활용하기보다는 (작고 명확한)함수를 활용한 개발을 시도한다.
- [x] 전체 카테고리 데이터 - json파일 생성
- [x] 전체 카테고리 데이터 - 화살표 버튼 기반 이동 (7page)
- [x] 전체 카테고리 데이터 - 프로그래스바 효과 (6page)
- [x] 전체 카테고리 데이터 - 자동 이동 (7page)

🗓 week 3📌

- [ ] 그리드 타입 - 전체 언론사 - 구독하기(4page)
- [ ] 그리드 타입 - 전체 언론사 - 해지하기(4page)

- [ ] 리스트 타입 - 전체 카테고리 - 카테고리 버튼 기반 이동 (7page)
- [ ] 리스트 타입 - 전체 언론사 - 구독하기 (스낵바)  
       1. '내가 구독한 언론사에 추가되었습니다.' 라는 스낵바가 5초 유지  
       2. 즉시 내가 구독한 언론사 탭의 리스트 보기 화면으로 이동
- [ ] 리스트 타입 - 내가 구독한 언론사 - 해지하기(얼럿창)  
       1. '(언론사이름)을(를) 구독해지하시겠습니까?' 라는 alert  
       2. -예, 해지합니다 -아니오  
       3. 예 해지합니다 선택 시 즉시 구독이 해지되고,목록의 다음 순서 언론사가 바로 나타난다.

- [ ] 헤드라인 롤링(2page)
- [ ] 전역 변수,상수를 구분해서 선언하도록 네이밍 수정하기

## 🤔 실수 및 고민 사항

- 3초에 한번씩 롤링되는 뉴스데이터를 크롤링 해오려는데 중복된 데이터를 받아오는 경우  
  : contentsHeader(뉴스 헤드라인 내용)을 기준으로 중복을 제거해줬다.

   <br>

- setInterval 실행 시 데이터가 10개면 반복을 멈춰야하는 조건에

  ```js
  if (allResultDatas.length === 10) {
    break; // 반복 종료
  }
  ```

  setInterval 내에서 비동기 작업을 처리할 때, 그 작업들이 완료되기 전에 setInterval의 다음 반복이 시작될 수 있었다.

  🔽

  ```js
  if (allResultDatas.length >= 10) {
    break; // 반복 종료
  }
  ```

  <br>

- document.getElementsByClassName 메서드를 사용할 때 .appendChild()가 적용이 안됐다.

  .appendChild()는 단일 노드(요소)에만 적용될 수 있다.

  document.getElementsByClassName 메서드는 단일 요소가 아니라 HTMLCollection을 반환한다. HTMLCollection은 유사 배열 객체로, 조건에 맞는 모든 요소를 배열 형태로 반환.

  따라서, .appendChild() 메서드는 HTMLCollection에 직접 적용될 수 없었다.

  ```js
  document.getElementsByClassName('nav-container').appendChild(container);
  ```

  🔽

  ```js
  document.getElementsByClassName('nav-container')[0].appendChild(container);

  document.getElementById('nav-container').appendChild(container);
  ```

- CSS 선택자 중 nth-child(N) = 부모안에 모든 요소 중 N번째 요소

  요소를 하나하나 지정하지 않고도 배수로도 선택 할 수 있었다.

  ```css
  ul.press-logo-container > li:nth-child(6n) {
    border-right: solid 1px #d2dae0; /* 6의 배수 아이템에 오른쪽 테두리 적용 */
  }
  ```

  <br>

- innerHTML은 함수처럼 사용이 아니라, 할당해야 한다.

  ```js
  target.innerHTML(navHtml);
  ```

  🔽

  ```js
  target.innerHTML = navHtml;
  ```

  <br>

- 이벤트 버블링과 상위 태그 노드

  ```html
  <div id="angle-right">
    <i class="fi fi-rr-angle-right"></i>
    화살표를 클릭했을 때 해당 태그의 id값을 콜백 값으로 얻어오기 위해서 event.target을 사용했는데,
  </div>
  ```

  화살표 구조는 이렇고,

  `document.getElementById('angle-right')`에 click 이벤트를 지정해놨다.

  i 태그가 클릭 되어도, 이벤트 버블링으로 인해서 click이벤트가 실행되지만, 상위 div 태그의 id 속성 값을 가져오지 못했다.

  그래서 `event.target.parentNode` 를 사용하여 id값을 가져올 수 있었다.

- [`Intl.DateTimeFormat`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat)  
   : 언어에 맞는 날짜 및 시간 서식을 적용하기 위한 객체이다.

  ```js
  function dateCreate() {
    const date = new Date();
    const today = new Intl.DateTimeFormat('ko-KR', {
      dateStyle: 'medium',
      weekday: 'long', // 'narrow', 'short', 'long' 중 하나
      timeZone: 'Asia/Seoul',
    }).format(date);
  }
  ```

  🔽

  ```js
  function dateCreate() {
    const date = new Date();
    const today = new Intl.DateTimeFormat('ko-KR', {
      weekday: 'long', // 'narrow', 'short', 'long' 중 하나
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Seoul',
    }).format(date);
  }
  ```

  요일을 가져올 때 오류난 점

  dateStyle 옵션과 weekday 옵션을 함께 사용하는 것은 일부 브라우저나 환경에서 제한될 수 있다.

  `dateStyle` 옵션을 사용하면 년, 월, 일을 포함한 날짜의 전체 스타일을 지정하는 반면,

  `weekday`, `year`, `month`, `day` 등의 옵션을 직접 지정하면 더 세부적인 컨트롤이 가능합니다.  
   하지만, dateStyle과 이러한 세부적인 옵션들을 동시에 사용하려고 하면 충돌이 발생한다.

  <br>

- 템플릿 리터럴을 사용하여 HTML 문자열을 생성한 후 DOM에 추가하고 싶을 때

  생성한 문자열을 직접적으로 appendChild로 사용할 수는 없지만, `innerHTML` 속성이나 `insertAdjacentHTML` 메서드를 통해 간접적으로 DOM에 추가할 수 있다.

  이 방법들은 문자열을 HTML 요소로 파싱하고 해당 위치에 삽입해 준다.

  다만, innerHTML을 사용할 경우 기존에 해당 요소에 있던 내용을 대체하게 되므로,  
  새로운 요소를 추가하고자 할 때는 `insertAdjacentHTML`로 기존 내용을 유지하면서 지정된 위치에 새 HTML을 추가할 수 있다.

  (beforebegin, afterbegin, beforeend, afterend 중 속성 선택)

  - <b>beforebegin:</b>

    대상 엘리먼트의 바로 앞에, 즉 현재 엘리먼트가 속한 부모 엘리먼트의 자식으로 삽입되기 전에 위치.  
     예를 들어, 현재 엘리먼트가 `<p>` 태그라면, 이 옵션을 사용하면 `<p>` 태그 바로 앞에 새로운 내용이 추가.

  - <b>afterbegin:</b>

    대상 엘리먼트의 내부에서 가장 첫 번째 자식으로 삽입.  
     예를 들어, 현재 엘리먼트 내부에 여러 자식 엘리먼트가 있다면, 이 옵션을 사용하면 가장 첫 번째 자식 엘리먼트로 새로운 내용이 추가.

  - <b>beforeend:</b>

    대상 엘리먼트의 내부에서 가장 마지막 자식으로 삽입.  
     예를 들어, 현재 엘리먼트의 가장 마지막에 새로운 내용을 추가하고 싶을 때 이 옵션을 사용.

  - <b>afterend:</b>

    대상 엘리먼트의 바로 뒤에, 즉 현재 엘리먼트가 속한 부모 엘리먼트의 자식으로서, 현재 엘리먼트 다음에 위치.  
     예를 들어, 현재 엘리먼트가 `<p>` 태그라면, 이 옵션을 사용하면 `<p>` 태그 바로 뒤에 새로운 내용이 추가.

    ```js
    const pressNameHtml = `<li style="background-color:yellow">
          <a href="" target="_blank"></a>
        </li>`;

    const pressNameUlTarget = document.querySelector(`.nav-contents-container section1 ul`);
    // 기존 내용에 추가
    pressNameUlTarget.innerHTML += pressNameHtml;
    ```

    🔽 `insertAdjacentHTML` 사용

    ```js
    const pressNameHtml = `<li style="background-color:yellow">
          <a href="" target="_blank"></a>
        </li>`;

    const pressNameUlTarget = document.querySelector(`.nav-contents-container section1 ul`);
    // 'beforeend' 위치에 새 HTML 추가 (기존 내용 유지)
    pressNameUlTarget.insertAdjacentHTML('beforeend', pressNameHtml);
    ```

  - 여기서는 beforeend를 사용하여 ul 요소의 마지막 자식으로 새 li 요소를 추가하는 방식을 선택했다.
  - 이 방법을 통해 기존 내용을 유지하면서 새로운 내용을 추가할 수 있다.

<br>

- 같은 뎁스(레벨)의 형제 요소를 찾기 위한 방법

  바로 nextSibling을 사용해서 모든 형제 요소를 찾은 뒤 적용하려고 했는데,

  ```js
  const activatedCategory = document.querySelector('.category');

  activatedCategory.nextSibling.forEach((e) => {
    e.classList.romove('category-select');
  });
  ```

  `nextSibling`은 단일 요소를 참조하기 때문에 forEach 메서드를 직접 사용할 수 없었다.

  🔽

  그렇기 때문에, 부모요소(`parentNode`)에서 모든 자식요소(`children`)를 가져와서 적용해야한다.

  ```js
  const activatedCategory = document.querySelector('.category');
  const siblings = Array.from(activatedCategory.parentNode.children);
  siblings.forEach((sibling) => {
    if (sibling !== activatedCategory) sibling.classList.remove('category-select');
  });
  ```

  <br>

- JavaScript로 직접 가상 요소의(`::after`) 스타일을 변경할 수 없다.

  <br>

- 전체 카테고리 데이터 json파일 생성

  ```js
  let img = document.querySelector('.MediaNewsView-module__news_logo___LwMpl > img');
  let imgLink = document.querySelector('.MediaNewsView-module__news_logo___LwMpl');
  let imgTime = document.querySelector('.MediaNewsView-module__time___fBQhP');
  let mainImgLink = document.querySelector('.MediaNewsView-module__desc_left___jU94v > a');
  let mainImg = document.querySelector('.ImgView-module__content_img___QA0gl > img');
  let headLines = [];
  let headLineTag = '.MediaNewsView-module__desc_item___OWjz3 > a';
  document.querySelectorAll(headLineTag).forEach((value) => {
    headLines.push({
      link: value.href,
      headline: value.textContent,
    });
  });
  ```

  ```js
  {"imgSrc":img.src, "imgName":img.alt, "imgLink":imgLink.href, "imgTime":imgTime.textContent, "mainImgLink":mainImgLink.href , "mainImgSrc":mainImg.src, "mainImgHeadLine":mainImg.alt, "headLines":headLines}
  ```

  브라우저에서 위의 코드를 사용하여 페이지 각각의 데이터를 얻어와서 json형식으로 만들어줬다.  
  `/src/json/categoryNewsData.json`

## 📚

- BEM, SMACSS 적용해보기
- CSS 함수도 활용해보기
- 반응형 화면 구현해보기
- 작은 하위 함수로 나누면서 짜기
- 파일이름은 동사는 별로..
- 단위를 em, rem 을 골고루 활용해보고, rem을 좀더 많이 사용해본다.
- 케이뱅크/현대카드 사이트 참조
- 날짜생성함수를 return하는 함수로 변경해보기
