import ManageFile from './ManageFile.js';

const file = () => {
  // press(언론사), headlines(뉴스 헤드라인)
  new ManageFile('press').createFile();
  new ManageFile('headlines').createFile();
};

file();
