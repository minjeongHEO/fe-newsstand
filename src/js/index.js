import { setDate } from './components/setDate.js';
import { setHeadLineNews } from './components/setHeadLineNews.js';

try {
  setDate();
  setHeadLineNews();
} catch (error) {
  console.error(error);
}
