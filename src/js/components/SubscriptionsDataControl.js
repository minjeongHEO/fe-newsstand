export class SubscriptionsDataControl {
  constructor(jsonDataByCategory) {
    this.collectNewsData = this.collectNewsData(jsonDataByCategory);
    this.subscriptonsData = [];
  }

  getSubscriptonsData() {
    return this.subscriptonsData;
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
    let insertResult = { result: false, msg: '' };

    if (!(await this.checkIfExistData(pressName))) {
      const response = await fetch('http://localhost:3000/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      await response.json();

      // 저장 성공 여부 확인
      if (response.ok) {
        insertResult = { result: true, msg: 'Data saved successfully.' };
      } else {
        insertResult = { result: false, msg: 'Data save failure.' };
      }
    } else {
      insertResult = { result: false, msg: 'This is already subscribed data.' };
    }

    return insertResult;
  }

  //그리드 타입 - 해당 언론사 데이터 찾기
  findSubscriptionsData(pressNameToFind) {
    // return this.collectNewsData.find(({ pressName }) => pressName === pressNameToFind);
    let findData = this.collectNewsData.find(({ pressName }) => pressName === pressNameToFind);

    //예외!!!!!
    /**
     * findData가 undefined가 나오는 경우
     * 크롤링을 몇개 데이터만 해와서(전체 안해와서) 없는 언론사를 구독하기 할 경우 undefined가 떠서
     * 다른 예외처리 필요
     */
    if (!findData) {
      findData = {
        pressImg: '',
        pressName: pressNameToFind,
        pressImgLink: '',
        newsTime: '',
        mainImgLink: '',
        mainImgSrc: '',
        mainHeadLine: '',
        headLines: [],
      };
    }

    return findData;
  }

  //id값 조회
  async findId(pressNameToFind) {
    await this.fetchSubscriptionsData();
    const findItemObj = this.subscriptonsData.find(({ pressName }) => pressName === pressNameToFind);
    return findItemObj ? findItemObj.id : undefined;
  }

  //구독해제할 데이터 delete
  async deleteSubscriptionsData(pressNameToDelete) {
    //id값
    const idToDelete = await this.findId(pressNameToDelete);

    if ((await this.checkIfExistData(pressNameToDelete)) && idToDelete) {
      const response = await fetch(`http://localhost:3000/subscriptions/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // 삭제 성공 여부 확인
      if (response.ok) {
        console.log('Delete successful');
      } else {
        console.log('Delete failed');
      }
    }
  }
}
