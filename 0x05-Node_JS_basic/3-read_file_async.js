const fs = require('fs');

function countStudents(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(new Error('Cannot load the database'));
      } else {
        const lines = data.trim().split('\n').filter(line => line);

        const totalStudents = lines.length - 1;
        console.log(`Number of students: ${totalStudents}`);

        const fields = {};
        for (let i = 1; i < lines.length; i++) {
          const [firstName, , , field] = lines[i].split(',');
          if (!fields[field]) {
            fields[field] = [];
          }
          fields[field].push(firstName);
        }

        for (const field in fields) {
          console.log(`Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}`);
        }

        resolve();
      }
    });
  });
}

module.exports = countStudents;
