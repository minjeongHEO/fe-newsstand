/** 날짜 생성 */
export function setDate() {
  const date = new Date();
  const today = new Intl.DateTimeFormat('ko-KR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  }).format(date);

  document.getElementById('header-date').innerHTML = today;
}
