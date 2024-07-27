const http = require('http');
const fs = require('fs');

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      } else {
        const lines = data.trim().split('\n').filter((line) => line);

        const totalStudents = lines.length - 1;
        let output = `Number of students: ${totalStudents}\n`;

        const fields = {};
        for (let i = 1; i < lines.length; i += 1) { // Fixed the no-plusplus error
          const [firstName, , , field] = lines[i].split(',');
          if (!fields[field]) {
            fields[field] = [];
          }
          fields[field].push(firstName);
        }

        for (const field in fields) {
          if (Object.prototype.hasOwnProperty.call(fields, field)) { // Fixed the guard-for-in error
            output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
          }
        }

        resolve(output.trim());
      }
    });
  });
}

const app = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello Holberton School!');
  } else if (req.url === '/students') {
    const databasePath = process.argv[2];
    countStudents(databasePath)
      .then((output) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(`This is the list of our students\n${output}`);
      })
      .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(error.message);
      });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

app.listen(1245);

module.exports = app;
