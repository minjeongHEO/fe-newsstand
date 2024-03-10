import { promises as fs } from 'fs';
import ScrapeDatas from './ScrapeDatas.js';

export default class ManageFile {
  constructor(userFilterName) {
    this.divider = userFilterName; //press(언론사), headlines(뉴스 헤드라인)
    this.fileName = `${this.divider}Data.json`;
    this.scrapeData = []; //파싱한 파일 데이터
  }

  /** 새 파일로 생성하기 */
  async createFile() {
    try {
      const ScrapedDatas = new ScrapeDatas();

      if (this.divider === 'press') {
        this.scrapeData = await ScrapedDatas.scrapeDynamicImages();
      } else if (this.divider === 'headlines') {
        this.scrapeData = await ScrapedDatas.scrapeDynamicNews();
      }

      fs.writeFile(`./src/json/${this.fileName}`, JSON.stringify(this.scrapeData), (err) => {
        if (err) throw err;
      });
    } catch (error) {
      console.error('🧨createFile() Error : ' + error);
    }
  }
}
