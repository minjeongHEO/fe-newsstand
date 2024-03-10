/**
 * json데이터 fetch
 * @param {string} fileName - 'pressData'(언론사), 'headlinesData'(뉴스 헤드라인)
 * @returns {object} json 데이터
 */
export async function readJsonFile(fileName) {
  const filePath = `../src/json/${fileName}.json`;
  const response = await fetch(filePath);
  const jsonData = await response.json();

  return jsonData;
}
