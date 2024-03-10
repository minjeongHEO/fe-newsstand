import { setDate } from './components/setDate.js';
import { setHeadLineNews } from './components/setHeadLineNews.js';
import { setPressDataGrid } from './components/setPressDataGrid.js';

try {
  setDate();
  setHeadLineNews();
  setPressDataGrid();
} catch (error) {
  console.error(error);
}
