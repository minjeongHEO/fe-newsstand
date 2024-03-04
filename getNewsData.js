fetch('https://www.naver.com/')
  .then((response) => response.text())
  .then((html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const images = doc.querySelectorAll('.MediaSubscriptionView-module__news_thumb___IA4y2 img');
    images.forEach((img) => {
      console.log('이미지 src:', img.src);
      console.log('이미지 이름:', img.alt);
    });
  })
  .catch((error) => console.log(error));
