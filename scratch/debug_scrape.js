const axios = require('axios');

async function testFetch() {
  try {
    const getRes = await axios.get('http://www.educationboardresults.gov.bd/');
    const htmlText = getRes.data;
    
    // Get ALL regex matches
    const regex = /(\d+)\s*\+\s*(\d+)/g;
    let matches = [];
    let match;
    while ((match = regex.exec(htmlText)) !== null) {
      matches.push(match[0]);
    }
    
    console.log("All Regex matches:", matches);

  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFetch();
