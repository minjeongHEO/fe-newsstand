// const puppeteer = require('puppeteer');
import * as puppeteer from 'puppeteer';
import { setInterval } from 'timers/promises';

export default class ScrapeDatas {
  constructor() {
    this.url = 'https://www.naver.com/';
  }

  async collectPressData(page) {
    return await page.evaluate(() => {
      const pressDatas = [];
      const PRESS_IMG_TAG =
        '.MediaSubscriptionView-module__subscription_group___peb21 > .MediaSubscriptionView-module__subscription_box___z8NuT > a > img';
      document.querySelectorAll(PRESS_IMG_TAG).forEach((img) => {
        pressDatas.push({
          src: img.src,
          alt: img.alt,
        });
      });
      return pressDatas;
    });
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

    let allResultDatas = [];
    //다음 버튼을 찾아서, 페이지를 넘김
    const nextButtonSelector = '.ContentPagingView-module__btn_next___ZBhby';

    while (currentPage <= totalPages) {
      allResultDatas = allResultDatas.concat(await this.collectPressData(page));

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

      if (allResultDatas.length >= 10) {
        break; // 반복 종료
      }

      console.log(1);
    }

    browser.close();
    return allResultDatas;
  }

  async scrapeNewsData() {
    const browser = await puppeteer.launch({
      headless: false, // 브라우저 화면을 볼 수 있도록 설정
    });
    const page = await browser.newPage();
    await page.goto(this.url);

    // 리스트형 보기로 전환
    await page.waitForSelector('.ContentPagingView-module__btn_view_list___j7eNR');
    await page.click('.ContentPagingView-module__btn_view_list___j7eNR');
    // await page.waitForTimeout(1000); // 전환 대기
    await new Promise((resolve) => setTimeout(resolve, 1000)); // waitForTimeout 대신 사용

    let allNews = {
      subscribe: [],
      news: [],
    };

    try {
      // 모든 카테고리 순회
      while (true) {
        let currentPage = 1;

        // 현재 카테고리의 전체 페이지 수와 카테고리명 가져오기
        const { totalPages, categoryName } = await page.evaluate(() => {
          const totalSpan = document.querySelector('.ContentPagingView-module__total___HUvt2');
          const totalText = totalSpan.textContent;
          const totalPages = parseInt(totalText.split('/')[1], 10);
          const categoryName = document.querySelector('.ContentPagingView-module__point___U2tUD').textContent.replaceAll('언론사 뉴스', '').trim();
          return { totalPages, categoryName };
        });

        console.log(`Scraping category: ${categoryName}, Total pages: ${totalPages}`);

        // 현재 카테고리의 모든 페이지 순회
        while (currentPage <= totalPages) {
          console.log(`Processing page ${currentPage} of ${totalPages}`);

          // 요소들이 로드될 때까지 대기
          await page
            .waitForSelector('.MediaNewsView-module__news_logo___LwMpl > img', { timeout: 5000 })
            .catch(() => console.log('Logo image not found'));
          await page.waitForSelector('.MediaNewsView-module__time___fBQhP', { timeout: 5000 }).catch(() => console.log('Time element not found'));
          await page
            .waitForSelector('.ImgView-module__content_img___QA0gl > img', { timeout: 5000 })
            .catch(() => console.log('Main image not found'));

          const newsData = await page.evaluate(() => {
            try {
              const categoryName = document
                .querySelector('.ContentPagingView-module__point___U2tUD')
                ?.textContent.replaceAll('언론사 뉴스', '')
                .trim();
              const img = document.querySelector('.MediaNewsView-module__news_logo___LwMpl > img');
              const imgLink = document.querySelector('.MediaNewsView-module__news_logo___LwMpl');
              const imgTime = document.querySelector('.MediaNewsView-module__time___fBQhP');
              const mainImgLink = document.querySelector('.MediaNewsView-module__desc_left___jU94v > a');
              const mainImg = document.querySelector('.ImgView-module__content_img___QA0gl > img');

              // 필요한 요소들이 모두 존재하는지 확인
              if (!img || !imgTime || !mainImg || !mainImgLink) {
                console.log('Some elements are missing');
                return null;
              }

              let sideNews = [];
              document.querySelectorAll('.MediaNewsView-module__desc_item___OWjz3 > a').forEach((value) => {
                sideNews.push({
                  href: value.href,
                  title: value.textContent,
                });
              });

              return {
                id: Math.random().toString(16).slice(2, 6),
                category: categoryName,
                pressName: img.alt,
                logoImageSrc: img.src,
                editedTime: imgTime.textContent,
                headline: {
                  thumbnailSrc: mainImg.src,
                  title: mainImg.alt,
                  href: mainImgLink.href,
                },
                sideNews: sideNews,
              };
            } catch (error) {
              console.log('Error in evaluate:', error);
              return null;
            }
          });

          // newsData가 유효한 경우에만 추가
          if (newsData) {
            allNews.news.push(newsData);
          }

          // 다음 페이지로 이동
          if (currentPage < totalPages) {
            await page.waitForSelector('.ContentPagingView-module__btn_next___ZBhby');
            await page.click('.ContentPagingView-module__btn_next___ZBhby');
            // await page.waitForTimeout(2000); // 페이지 로드 대기 시간 증가
          }
          currentPage++;
        }

        // 마지막 카테고리("지역") 체크
        const currentCategory = await page.evaluate(() => {
          return document.querySelector('.ContentPagingView-module__point___U2tUD').textContent.replaceAll('언론사 뉴스', '').trim();
        });

        if (currentCategory === '지역') break;

        // 다음 카테고리로 이동
        await page.waitForSelector('.ContentPagingView-module__btn_next___ZBhby');
        await page.click('.ContentPagingView-module__btn_next___ZBhby');
        // await page.waitForTimeout(2000);
      }
    } catch (error) {
      console.error('Scraping error:', error);
    } finally {
      await browser.close();
    }

    return allNews;
  }
}

/**
 * *1)
 * page.evaluate() 함수 내에서 전역 변수에 값을 할당하는 작업이 불가능한 이유는, page.evaluate()가 페이지 내의 샌드박스 환경, 즉 브라우저 컨텍스트에서 실행되기 때문입니다.
 * 이는 page.evaluate() 내부에서 실행되는 코드가 실제 브라우저의 환경에서 동작하는 것과 같으며, Node.js 환경이나 Puppeteer 스크립트의 변수에 직접 접근할 수 없다는 것을 의미합니다.
 * 즉, page.evaluate()는 별도의 환경에서 실행되므로, 이 함수 내부에서 Node.js의 전역 변수나 함수에 접근하거나 수정하는 것은 기술적으로 불가능합니다.
 */
