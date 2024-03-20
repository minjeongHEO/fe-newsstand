export class SubscriptionsDataControl {
  constructor(jsonDataByCategory) {
    this.collectNewsData = this.collectNewsData(jsonDataByCategory);
  }

  //언론사 데이터만 뽑기
  collectNewsData(jsonDataByCategory) {
    const newsData = jsonDataByCategory
      .reduce((acc, newsByCategory) => {
        acc.push(newsByCategory.news);
        return acc;
      }, [])
      .flat();

    return newsData;
  }

  //구독한 데이터 select all

  //구독할 데이터exist

  //구독할 데이터 insert

  //구독해제할 데이터 delete
}
