export class SubscriptionsDataControl {
  constructor(jsonDataByCategory) {
    this.collectNewsData = this.collectNewsData(jsonDataByCategory);
    this.subscriptonsData = [];
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
  async fetchSubscriptionsData() {
    try {
      const response = await fetch('http://localhost:3000/subscriptions');
      const subscriptionsData = await response.json();
      this.subscriptonsData = subscriptionsData;
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * 구독할 데이터 exist check
   * @param {*string} pressName
   * @returns true 이미 존재(구독중)
   * @returns false
   */
  async checkIfExistData(pressName) {
    await this.fetchSubscriptionsData();
    return this.subscriptonsData.map((e) => e.pressName).includes(pressName);
  }

  //구독할 데이터 insert
  async insertSubscriptionsData(pressName, subscriptionData) {
    if (!this.checkIfExistData(pressName)) {
      const response = await fetch('http://localhost:3000/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      await response.json();
    }
  }

  //구독해제할 데이터 delete
}
