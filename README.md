# fe-newsstand

## `#html` `#css` `#event` `#html`

### 🔧 설치

`npm install -g live-server` : live-server 설치  
`live-server` : 명령어로 실행

---

`npm install json-server` : json-server 설치  
`subscribeNewsData.json` : 파일 생성 후 초기 구조 설정  
 ex)

```js
  {
    "subscriptions": []
  }
```

`npx json-server db.json`(`npx json-server ./src/json/subscribeNewsData.json`) : json-server를 실행

![image](https://github.com/codesquad-members-2024/fe-newsstand/assets/96780693/63a22d80-b224-4fce-8690-1dd50900efcf)

`http://localhost:3000/subscriptions` 주소를 통해 구독 데이터에 접근할 수 있다.

VSC Live Server 자동 렌더링 비활성화 셋팅 [🔎](https://kku-jun.tistory.com/47)  
![image](https://github.com/codesquad-members-2024/fe-newsstand/assets/96780693/888075c5-f6cf-4cb3-a611-4430752b76eb)  
`subscribeNewsData.json`파일이 갱신될 때 마다 화면이 재렌더링 되는 걸 해결할 수 있다.

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
- [x] 리스트 타입 - 전체 언론사 - 구독하기 시 스낵바
- [x] 리스트 타입 - 내가 구독한 언론사 - 해지하기 시 얼럿창
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

- [x] 리스트 타입 - 전체 카테고리 - 카테고리 버튼 기반 이동 (7page)
- [ ] 리스트 타입 - 전체 언론사 - 구독하기 (스낵바)  
       1. '내가 구독한 언론사에 추가되었습니다.' 라는 스낵바가 5초 유지  
       2. 즉시 내가 구독한 언론사 탭의 리스트 보기 화면으로 이동
- [ ] 리스트 타입 - 내가 구독한 언론사 - 해지하기(얼럿창)  
       1. '(언론사이름)을(를) 구독해지하시겠습니까?' 라는 alert  
       2. -예, 해지합니다 -아니오  
       3. 예 해지합니다 선택 시 즉시 구독이 해지되고,목록의 다음 순서 언론사가 바로 나타난다.

- [ ] 헤드라인 롤링(2page)
- [ ] 전역 변수,상수를 구분해서 선언하도록 네이밍 수정하기

<br>

## 🤔 실수 및 고민 사항

📓 [Wiki Link](https://github.com/minjeongHEO/fe-newsstand/wiki/%5BNews-Stand%5D-%EC%8B%A4%EC%88%98,-%EA%B3%A0%EB%AF%BC-%EC%82%AC%ED%95%AD,-%EA%B0%9C%EB%85%90-%EC%A0%95%EB%A6%AC-%F0%9F%93%93)

<br>

## 📚

- BEM, SMACSS 적용해보기
- CSS 함수도 활용해보기
- 반응형 화면 구현해보기
- 작은 하위 함수로 나누면서 짜기
- 파일이름은 동사는 별로..
- 단위를 em, rem 을 골고루 활용해보고, rem을 좀더 많이 사용해본다.
- 케이뱅크/현대카드 사이트 참조
- 날짜생성함수를 return하는 함수로 변경해보기
