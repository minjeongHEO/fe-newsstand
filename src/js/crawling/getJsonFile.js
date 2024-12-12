import ManageFile from './ManageFile.js';
import ScrapeDatas from './ScrapeDatas.js';

import { promises as fs } from 'fs';

const file = async () => {
  // press(언론사), headlines(뉴스 헤드라인)
  // new ManageFile('press').createFile();
  // new ManageFile('headlines').createFile();

  // 새로운 뉴스 데이터 수집 및 저장
  try {
    const scraper = new ScrapeDatas();
    const newsData = await scraper.scrapeNewsData();

    await fs.writeFile('./src/json/news.json', JSON.stringify(newsData, null, 2), 'utf8');

    console.log('News data has been successfully collected and saved to news.json');
  } catch (error) {
    console.error('Error while collecting news data:', error);
  }
};

file();
