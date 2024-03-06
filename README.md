# fe-newsstand

`#html` `#css` `#event` `#html`

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
       `node getJsonFile.js`  
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

## 📚

- [ ] BEM, SMACSS 적용해보기
- [ ] 반응형 화면 구현해보기
