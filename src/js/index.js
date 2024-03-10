import { setDate } from './components/setDate.js';
import { setHeadLineNews } from './components/setHeadLineNews.js';
import { initGridData, setPressDataGrid } from './components/setPressDataGrid.js';

window.onload = async () => {
  try {
    setDate();
    setHeadLineNews();
    await initGridData();
    await setPressDataGrid();
  } catch (error) {
    console.error(error);
  }
};
