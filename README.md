# fe-newsstand

`#html` `#css` `#event` `#html`

`npm install -g live-server` 설치  
`live-server` 명령어로 실행

## 구현 내용

### ✨ 레이아웃

- [ ] flex적용한 부분 grid로 수정하기
- [ ] 반복되는 태그작업을 jsx문법처럼 가독성 있게 수정하기
- [ ] 상단 로고 및 시간
- [ ] 반응형으로 구현하기

### 🔧 기능

- [x] 언론사 데이터 크롤링  
       `npm init -y`  
       `npm i puppeteer`  
       다음 페이지를 클릭해서 모든 언론사 정보를 크롤링한다.
- [x] 롤링 뉴스 데이터 크롤링
      3초 단위로 뉴스 데이터를 크롤링하여, 총 5개 받아온다.
- [x] 크롤링 데이터 json 파일 생성하기
      `node js/getJsonFile.js`
      해당 파일을 실행하여 크롤링한 데이터를 json파일로 생성한다.

## 🤔 실수 및 고민 사항

- 3초에 한번씩 롤링되는 뉴스데이터를 크롤링 해오려는데 중복된 데이터를 받아오는 경우  
  : contentsHeader(뉴스 헤드라인 내용)을 기준으로 중복을 제거해줬다.
- setInterval 실행 시 데이터가 5개면 반복을 멈춰야하는 조건에

  ```js
  if (allResultDatas.length === 5) {
    break; // 반복 종료
  }
  ```

  setInterval 내에서 비동기 작업을 처리할 때, 그 작업들이 완료되기 전에 setInterval의 다음 반복이 시작될 수 있었다.

  🔽

  ```js
  if (allResultDatas.length >= 5) {
    break; // 반복 종료
  }
  ```

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

- innerHTML은 함수처럼 사용이 아니라, 할당해야 한다.

  ```js
  target.innerHTML(navHtml);
  ```

  🔽

  ```js
  target.innerHTML = navHtml;
  ```

- 이벤트 버블링과 상위 태그 노드

  ```html
  <div id="angle-right">
    <i class="fi fi-rr-angle-right"></i>
  </div>
  ```

  화살표 구조는 이렇고,

  `document.getElementById('angle-right')`에 click 이벤트를 지정해놨다.

  화살표를 클릭했을 때 해당 태그의 id값을 콜백 값으로 얻어오기 위해서 event.target을 사용했는데,

  i 태그가 클릭 되어도, 이벤트 버블링으로 인해서 click이벤트가 실행되지만, 상위 div 태그의 id 속성 값을 가져오지 못했다.

  그래서 `event.target.parentNode` 를 사용하여 id값을 가져올 수 있었다.

## 📚

- [ ] BEM, SMACSS 적용해보기
- [ ] 반응형 화면 구현해보기
- [ ] 작은 하위 함수로 나누면서 짜기
