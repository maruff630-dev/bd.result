const { fetchResultFromBoard } = require('./src/lib/scraper');

async function test() {
  const res = await fetchResultFromBoard('ssc', '2025', 'rajshahi', '177233', '2212820996');
  console.log(res);
}

test();
