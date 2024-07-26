Let's go through each task step-by-step. First, ensure that you have all the necessary files in place, including `package.json`, `babel.config.js`, `.eslintrc.js`, and `database.csv`. Make sure to run `npm install` to set up your environment.

### Task 0: Executing basic JavaScript with Node.js

1. **Create `0-console.js`**:
   ```javascript
   // 0-console.js
   function displayMessage(message) {
     console.log(message);
   }

   module.exports = displayMessage;
   ```

2. **Create `0-main.js` to test**:
   ```javascript
   // 0-main.js
   const displayMessage = require('./0-console');

   displayMessage("Hello NodeJS!");
   ```

3. **Run the test**:
   ```bash
   node 0-main.js
   ```

   **Expected output**:
   ```
   Hello NodeJS!
   ```

### Task 1: Using Process stdin

1. **Create `1-stdin.js`**:
   ```javascript
   // 1-stdin.js
   process.stdout.write("Welcome to Holberton School, what is your name?\n");

   process.stdin.on('data', (data) => {
     process.stdout.write(`Your name is: ${data.toString()}`);
     process.stdin.end();
   });

   process.stdin.on('end', () => {
     console.log("This important software is now closing");
   });
   ```

2. **Run the script**:
   ```bash
   node 1-stdin.js
   ```

   **Expected interactions**:
   ```
   Welcome to Holberton School, what is your name?
   (You type: Bob)
   Your name is: Bob
   This important software is now closing
   ```

### Task 2: Reading a file synchronously with Node.js

1. **Create `2-read_file.js`**:
   ```javascript
   // 2-read_file.js
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
   ```

2. **Create `2-main_0.js` to test**:
   ```javascript
   // 2-main_0.js
   const countStudents = require('./2-read_file');

   countStudents("nope.csv");
   ```

3. **Create `2-main_1.js` to test**:
   ```javascript
   // 2-main_1.js
   const countStudents = require('./2-read_file');

   countStudents("database.csv");
   ```

4. **Run the tests**:
   ```bash
   node 2-main_0.js
   node 2-main_1.js
   ```

   **Expected output for `2-main_0.js`**:
   ```
   Error: Cannot load the database
   ```

   **Expected output for `2-main_1.js`**:
   ```
   Number of students: 10
   Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
   Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
   ```

### Task 3: Reading a file asynchronously with Node.js

1. **Create `3-read_file_async.js`**:
   ```javascript
   // 3-read_file_async.js
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
   ```

2. **Create `3-main_0.js` to test**:
   ```javascript
   // 3-main_0.js
   const countStudents = require('./3-read_file_async');

   countStudents("nope.csv")
     .then(() => {
       console.log("Done!");
     })
     .catch((error) => {
       console.log(error);
     });
   ```

3. **Create `3-main_1.js` to test**:
   ```javascript
   // 3-main_1.js
   const countStudents = require('./3-read_file_async');

   countStudents("database.csv")
     .then(() => {
       console.log("Done!");
     })
     .catch((error) => {
       console.log(error);
     });
   console.log("After!");
   ```

4. **Run the tests**:
   ```bash
   node 3-main_0.js
   node 3-main_1.js
   ```

   **Expected output for `3-main_0.js`**:
   ```
   Error: Cannot load the database
   ```

   **Expected output for `3-main_1.js`**:
   ```
   After!
   Number of students: 10
   Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
   Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
   Done!
   ```

### Task 4: Create a small HTTP server using Node's HTTP module

1. **Create `4-http.js`**:
   ```javascript
   // 4-http.js
   const http = require('http');

   const app = http.createServer((req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/plain' });
     res.end('Hello Holberton School!');
   });

   app.listen(1245);

   module.exports = app;
   ```

2. **Start the server**:
   ```bash
   node 4-http.js
   ```

3. **Test the server**:
   ```bash
   curl localhost:1245 && echo ""
   curl localhost:1245/any_endpoint && echo ""
   ```

   **Expected output**:
   ```
   Hello Holberton School!
   Hello Holberton School!
   ```

### Task 5: Create a more complex HTTP server using Node's HTTP module

1. **Create `5-http.js`**:
   ```javascript
   // 5-http.js
   const http = require('http');
   const fs = require('fs');

   function countStudents(path) {
     return new Promise((resolve, reject) => {
       fs.readFile(path, 'utf8', (err, data) => {
         if (err) {
           reject(new Error('Cannot load the database'));
         } else {
           const lines = data.trim().split('\n').filter(line => line);

           const totalStudents = lines.length - 1;
           let output = `Number of students: ${totalStudents}\n`;

           const fields = {};
           for (let i = 1; i < lines.length; i++) {
             const [firstName, , , field] = lines[i].split(',');
             if (!fields[field]) {
               fields[field] = [];
             }
             fields[field].push(firstName);
           }

           for (const field in fields) {
             output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
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
   ```

2. **Start the server**:
   ```bash
   node 5-http.js database.csv
   ```

3. **Test the server**:
   ```bash
   curl localhost:1245 && echo ""
   curl localhost:1245/students && echo ""
   ```

   **Expected output**:
   ```
   Hello Holberton School!
   This is the list of our students
   Number of students: 10
   Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
   Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
   ```

### Task 6: Create a small HTTP server using Express

1. **Install Express**:
   ```bash
   npm install express
   ```

2. **Create `6-http_express.js`**:
   ```javascript
   // 6-http_express.js
   const express = require('express');

   const app = express();

   app.get('/', (req, res) => {
     res.send('Hello Holberton School!');
   });

   app.listen(1245, () => {
     console.log('Server is running on port 1245');
   });

   module.exports = app;
   ```

3. **Start the server**:
   ```bash
   node 6-http_express.js
   ```

4. **Test the server**:
   ```bash
   curl localhost:1245 && echo ""
   curl localhost:1245/any_endpoint && echo ""
   ```

   **Expected output**:
   ```
   Hello Holberton School!
   <!DOCTYPE html>
   <html lang="en">
   <head>
   <meta charset="utf-8">
   <title>Error</title>
   </head>
   <body>
   <pre>Cannot GET /any_endpoint</pre>
   </body>
   </html>
   ```

### Task 7: Create a more complex HTTP server using Express

1. **Create `7-http_express.js`**:
   ```javascript
   // 7-http_express.js
   const express = require('express');
   const fs = require('fs');

   function countStudents(path) {
     return new Promise((resolve, reject) => {
       fs.readFile(path, 'utf8', (err, data) => {
         if (err) {
           reject(new Error('Cannot load the database'));
         } else {
           const lines = data.trim().split('\n').filter(line => line);

           const totalStudents = lines.length - 1;
           let output = `Number of students: ${totalStudents}\n`;

           const fields = {};
           for (let i = 1; i < lines.length; i++) {
             const [firstName, , , field] = lines[i].split(',');
             if (!fields[field]) {
               fields[field] = [];
             }
             fields[field].push(firstName);
           }

           for (const field in fields) {
             output += `Number of students in ${field}: ${fields[field].length}. List: ${fields[field].join(', ')}\n`;
           }

           resolve(output.trim());
         }
       });
     });
   }

   const app = express();

   app.get('/', (req, res) => {
     res.send('Hello Holberton School!');
   });

   app.get('/students', (req, res) => {
     const databasePath = process.argv[2];
     countStudents(databasePath)
       .then((output) => {
         res.send(`This is the list of our students\n${output}`);
       })
       .catch((error) => {
         res.status(500).send(error.message);
       });
   });

   app.listen(1245, () => {
     console.log('Server is running on port 1245');
   });

   module.exports = app;
   ```

2. **Start the server**:
   ```bash
   node 7-http_express.js database.csv
   ```

3. **Test the server**:
   ```bash
   curl localhost:1245 && echo ""
   curl localhost:1245/students && echo ""
   ```

   **Expected output**:
   ```
   Hello Holberton School!
   This is the list of our students
   Number of students: 10
   Number of students in CS: 6. List: Johann, Arielle, Jonathan, Emmanuel, Guillaume, Katie
   Number of students in SWE: 4. List: Guillaume, Joseph, Paul, Tommy
   ```
