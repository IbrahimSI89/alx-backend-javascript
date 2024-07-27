const fs = require('fs');

function countStudents(path) {
  try {
    const data = fs.readFileSync(path, 'utf8');
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
  } catch (err) {
    throw new Error('Cannot load the database');
  }
}

module.exports = countStudents;
