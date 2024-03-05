// const puppeteer = require('puppeteer');
import * as puppeteer from 'puppeteer';

const URL = 'https://www.naver.com/';

async function scrapeDynamicImages(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

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

  let allResults = [];
  //다음 버튼을 찾아서, 페이지를 넘김
  const nextButtonSelector = '.ContentPagingView-module__btn_next___ZBhby';

  while (currentPage <= totalPages) {
    allResults = allResults.concat(await collectData());

    currentPage++; // 다음 페이지로 넘어가기 위해 현재 페이지 번호 증가

    // console.log(allResults);
    // console.log(allResults.length);
    // console.log('---------------------------------');

    await page.click(nextButtonSelector);

    // console.log(allResults);
  }

  browser.close();
  return allResults;
}

scrapeDynamicImages(URL).then((data) => console.log(data));
// scrapeDynamicHeadLine;
