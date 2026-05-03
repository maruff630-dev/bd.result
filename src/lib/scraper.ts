import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedResult {
  name?: string;
  fatherName?: string;
  motherName?: string;
  board?: string;
  exam?: string;
  year?: string;
  roll?: string;
  reg?: string;
  gpa?: string;
  group?: string;
  status?: string;
  subjects: { name: string; grade: string; marks?: string }[];
  error?: string;
}

const TIMEOUT = 10000;

export async function fetchResultFromBoard(exam: string, year: string, board: string, roll: string, reg: string, retries = 3): Promise<ScrapedResult> {
  try {
    // 1. Get initial page to solve captcha and get session
    const getRes = await axios.get('http://www.educationboardresults.gov.bd/', {
      timeout: TIMEOUT,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });

    const htmlText = getRes.data;
    const match = htmlText.match(/(\d+)\s*\+\s*(\d+)/);
    let sum = '0';
    if (match) {
      sum = (parseInt(match[1]) + parseInt(match[2])).toString();
    }

    const cookies = getRes.headers['set-cookie'] ? getRes.headers['set-cookie'].map(c => c.split(';')[0]).join('; ') : '';

    // 2. Prepare POST data
    const formData = new URLSearchParams();
    formData.append('sr', '3'); // standard hidden field
    formData.append('et', ''); // often empty or unused
    formData.append('exam', exam);
    formData.append('year', year);
    formData.append('board', board);
    formData.append('roll', roll);
    formData.append('reg', reg);
    formData.append('value_s', sum);
    formData.append('button2', 'Submit');

    // 3. Post to result.php
    const postRes = await axios.post('http://www.educationboardresults.gov.bd/result.php', formData.toString(), {
      timeout: TIMEOUT,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': 'http://www.educationboardresults.gov.bd/',
        'Cookie': cookies,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      }
    });

    const $res = cheerio.load(postRes.data);
    const bodyText = $res('body').text();

    // Check for standard errors
    if (bodyText.includes('err=105') || postRes.data.includes('err=105') || postRes.data.includes('location.href="index.php"')) {
      return { error: 'Official result not found. Please check your credentials.', subjects: [] };
    }
    
    if (bodyText.includes('Not Found') || bodyText.includes('Invalid')) {
       return { error: 'Official result not found or invalid data.', subjects: [] };
    }

    // Parse the result page
    const resultData: ScrapedResult = {
      subjects: [],
      status: 'PASSED' // Default, will verify below
    };

    // The tables don't usually have clear IDs, so we parse by labels
    $res('table tr').each((i, row) => {
      const td1 = $res(row).find('td').eq(0).text().trim();
      const td2 = $res(row).find('td').eq(1).text().trim();
      const td3 = $res(row).find('td').eq(2).text().trim();
      const td4 = $res(row).find('td').eq(3).text().trim();

      // Basic Info Parsing
      if (td1.includes('Name') && !td1.includes('Father') && !td1.includes('Mother')) resultData.name = td2;
      else if (td3.includes('Name') && !td3.includes('Father') && !td3.includes('Mother')) resultData.name = td4;

      if (td1.includes('Father')) resultData.fatherName = td2;
      else if (td3.includes('Father')) resultData.fatherName = td4;

      if (td1.includes('Mother')) resultData.motherName = td2;
      else if (td3.includes('Mother')) resultData.motherName = td4;

      if (td1.includes('Board')) resultData.board = td2;
      else if (td3.includes('Board')) resultData.board = td4;

      if (td1.includes('Roll')) resultData.roll = td2;
      else if (td3.includes('Roll')) resultData.roll = td4;

      if (td1.includes('Registration')) resultData.reg = td2;
      else if (td3.includes('Registration')) resultData.reg = td4;

      if (td1.includes('GPA') || td1.includes('Result')) resultData.gpa = td2;
      else if (td3.includes('GPA') || td3.includes('Result')) resultData.gpa = td4;

      if (td1.includes('Group')) resultData.group = td2;
      else if (td3.includes('Group')) resultData.group = td4;
      
      // Look for subject marks parsing (typically 3-4 columns: Code, Subject, Grade/Marks)
      // Only parse rows where the first column is a subject code (numbers) or just the subject name
      if (td1 && td2 && !td1.includes('Name') && !td1.includes('Roll') && !td1.includes('Result') && !td1.includes('Code')) {
         // Often td1 is code, td2 is subject name, td3 is grade
         if (!isNaN(Number(td1)) && td2.length > 2) {
            resultData.subjects.push({
               name: td2,
               grade: td3 || td4 || '',
               marks: '' // Gov site usually doesn't show raw marks for all, only grades
            });
         } else if (td1.length > 2 && td2.length > 0 && !td1.includes(':')) {
           // Maybe td1 is subject, td2 is grade
           // Don't push generic layout table rows
         }
      }
    });

    if (!resultData.name && !resultData.roll) {
      // If we didn't find the result, let's check what page we actually got
      if (bodyText.includes('Select Examination') || $res('form').length > 0) {
        return { error: 'Session expired or CAPTCHA failed. Please try again.', subjects: [] };
      }
      if (bodyText.includes('Cloudflare') || bodyText.includes('Checking your browser')) {
        return { error: 'Official Board server is verifying the connection. Please try again in a few seconds.', subjects: [] };
      }
      return { error: 'Failed to parse official result data. Make sure you entered correct information.', subjects: [] };
    }

    if (resultData.gpa === '0.00' || resultData.gpa?.toUpperCase().includes('F') || resultData.gpa?.toUpperCase().includes('FAIL')) {
      resultData.status = 'FAILED';
    }

    return resultData;

  } catch (error: any) {
    if (retries > 0) {
      console.warn(`Scraping failed, retrying... (${retries} left)`, error.message);
      await new Promise(res => setTimeout(res, 1000));
      return fetchResultFromBoard(exam, year, board, roll, reg, retries - 1);
    }
    console.error('Final scraping error:', error);
    return { error: 'Education Board servers are currently busy or down. Please try again later.', subjects: [] };
  }
}
