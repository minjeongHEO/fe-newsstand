// const puppeteer = require('puppeteer');
import * as puppeteer from 'puppeteer';
import { setInterval } from 'timers/promises';

export default class ScrapeDatas {
  constructor() {
    this.url = 'https://www.naver.com/';
  }

  /** 언론사 데이터 크롤링 */
  async scrapeDynamicImages() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url);

    let currentPage = 1;
    const { totalPages } = await page.evaluate(() => {
      const totalSpan = document.querySelector('#newsstand .ContentPagingView-module__total___HUvt2');
      const totalText = totalSpan.textContent;
      const totalPages = parseInt(totalText.split('/')[1], 10); // 전체 페이지 수 추출
      return { totalPages };
    });

    let collectData = async () => {
      return await page.evaluate(() => {
        const data = [];
        document.querySelectorAll('.MediaSubscriptionView-module__subscription_group___peb21 > .MediaSubscriptionView-module__subscription_box___z8NuT > a > img').forEach((img) => {
          data.push({
            src: img.src,
            alt: img.alt,
          });
        });
        return data;
      });
    };

    let allResultDatas = [];
    //다음 버튼을 찾아서, 페이지를 넘김
    const nextButtonSelector = '.ContentPagingView-module__btn_next___ZBhby';

    while (currentPage <= totalPages) {
      allResultDatas = allResultDatas.concat(await collectData());

      currentPage++; // 다음 페이지로 넘어가기 위해 현재 페이지 번호 증가
      await page.click(nextButtonSelector);
    }

    browser.close();
    return allResultDatas;
  }

  /** 롤링 뉴스 데이터 크롤링 */
  async scrapeDynamicNews() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url);

    let allResultDatas = [];
    let contentsHeaderSet = new Set();

    for await (const _ of setInterval(3000)) {
      const data = await page.evaluate(() => {
        //*1)
        const contentNews = document.querySelector('.ContentHeaderSubView-module__news_media___YJm6A');
        const contentNewsHref = contentNews.href;
        const contentNewsText = contentNews.textContent;

        const contentHeader = document.querySelector('.ContentHeaderSubView-module__news_title___wuetX > a');
        const contentHeaderHref = contentHeader.href;
        const contentHeaderText = contentHeader.textContent;

        return {
          newsName: contentNewsText,
          newsLink: contentNewsHref,
          contentsHeader: contentHeaderText,
          contentsLink: contentHeaderHref,
        };
      });

      // 중복 데이터 검증
      if (!contentsHeaderSet.has(data.contentsHeader)) {
        allResultDatas.push(data); // 데이터 배열에 추가
        contentsHeaderSet.add(data.contentsHeader); // Set에 contentsHeader 값 추가
      }

      if (allResultDatas.length >= 5) {
        break; // 반복 종료
      }

      console.log(1);
    }

    browser.close();
    return allResultDatas;
  }
}

/**
 * *1)
 * page.evaluate() 함수 내에서 전역 변수에 값을 할당하는 작업이 불가능한 이유는, page.evaluate()가 페이지 내의 샌드박스 환경, 즉 브라우저 컨텍스트에서 실행되기 때문입니다.
 * 이는 page.evaluate() 내부에서 실행되는 코드가 실제 브라우저의 환경에서 동작하는 것과 같으며, Node.js 환경이나 Puppeteer 스크립트의 변수에 직접 접근할 수 없다는 것을 의미합니다.
 * 즉, page.evaluate()는 별도의 환경에서 실행되므로, 이 함수 내부에서 Node.js의 전역 변수나 함수에 접근하거나 수정하는 것은 기술적으로 불가능합니다.
 */
