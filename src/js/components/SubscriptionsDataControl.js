export class SubscriptionsDataControl {
  constructor(jsonDataByCategory) {
    this.collectNewsData = this.collectNewsData(jsonDataByCategory);
    this.subscriptonsData;
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
  fetchSubscriptionsData() {
    fetch('http://localhost:3000/subscriptions')
      .then((response) => response.json())
      .then((data) => {
        this.subscriptonsData = data.subscriptions;
      })
      .catch((error) => console.error('Error:', error));
  }

  //구독할 데이터 exist check
  // checkIfExistData(pressName) {
  //   let existResult = false;
  //   this.subscriptonsData.map(e=>)
  //   this.subscriptonsData.includes()

  //   return existResult;
  // }

  //구독할 데이터 insert

  //구독해제할 데이터 delete
}
