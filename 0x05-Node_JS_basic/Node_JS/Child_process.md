### Child process


The `node:child_process` module allows Node.js to spawn subprocesses similar to popen(3). This is done primarily using the `child_process.spawn()` function.

#### Key Methods and Usage

1. **Spawning a Child Process**
   ```javascript
   const { spawn } = require('node:child_process');
   const ls = spawn('ls', ['-lh', '/usr']);

   ls.stdout.on('data', (data) => {
     console.log(`stdout: ${data}`);
   });

   ls.stderr.on('data', (data) => {
     console.error(`stderr: ${data}`);
   });

   ls.on('close', (code) => {
     console.log(`child process exited with code ${code}`);
   });
   ```
   - **Output:**
     - Lists directory contents.
     - Standard output and error data is logged.
     - Exit code is logged.

2. **Handling Pipes**
   - By default, stdin, stdout, and stderr pipes are established between the parent and child processes.
   - Pipes have limited capacity; excess data can block the subprocess.
   - Use `{ stdio: 'ignore' }` if output is not needed.

3. **Environment Variables and PATH**
   - Command lookup uses `options.env.PATH` or `process.env.PATH`.
   - On Windows, environment variables are case-insensitive and lexicographically sorted.

4. **Synchronous and Asynchronous Process Creation**
   - Asynchronous: `child_process.spawn()`, `child_process.exec()`, `child_process.execFile()`, `child_process.fork()`.
   - Synchronous: `child_process.spawnSync()`, `child_process.execSync()`, `child_process.execFileSync()`.

5. **Additional Methods**
   - `child_process.exec()`: Runs a command in a shell.
   - `child_process.execFile()`: Runs a command without a shell.
   - `child_process.fork()`: Spawns a new Node.js process with IPC channel.

6. **Example of Running a Shell Command**
   ```javascript
   const { exec } = require('node:child_process');
   exec('cat *.js missing_file | wc -l', (error, stdout, stderr) => {
     if (error) {
       console.error(`exec error: ${error}`);
       return;
     }
     console.log(`stdout: ${stdout}`);
     console.error(`stderr: ${stderr}`);
   });
   ```
   - **Output:**
     - Counts lines of JavaScript files.
     - Standard output and error data is logged.
     - Error handling with error code and signal.

7. **Promisified Version**
   ```javascript
   const util = require('node:util');
   const exec = util.promisify(require('node:child_process').exec);

   async function lsExample() {
     const { stdout, stderr } = await exec('ls');
     console.log('stdout:', stdout);
     console.error('stderr:', stderr);
   }
   lsExample();
   ```
   - **Output:**
     - Lists directory contents.
     - Standard output and error data is logged asynchronously.

8. **Spawning .bat and .cmd Files on Windows**
   ```javascript
   const { spawn } = require('node:child_process');
   const bat = spawn('cmd.exe', ['/c', 'my.bat']);

   bat.stdout.on('data', (data) => {
     console.log(data.toString());
   });

   bat.stderr.on('data', (data) => {
     console.error(data.toString());
   });

   bat.on('exit', (code) => {
     console.log(`Child exited with code ${code}`);
   });
   ```
   - **Output:**
     - Executes batch script.
     - Standard output and error data is logged.
     - Exit code is logged.

9. **Exec with Promises and AbortController**
   ```javascript
   const { exec } = require('node:child_process');
   const controller = new AbortController();
   const { signal } = controller;
   const child = exec('grep ssh', { signal }, (error) => {
     console.error(error); // an AbortError
   });
   controller.abort();
   ```
   - **Output:**
     - Attempts to execute grep command.
     - Aborts execution, logging an AbortError.




### **Child Processes in Node.js: `execFile`, `fork`, and `spawn`**

Node.js provides several methods in the `child_process` module to work with child processes, each serving different purposes based on use cases and requirements. Here's a detailed explanation of each method with examples and expected outputs:

---

### **1. `execFile(file[, args][, options][, callback])`**

**Feature:**
- Executes a file directly without spawning a shell, making it more efficient than `exec()`.

**Example:**

```javascript
const { execFile } = require('child_process');

// Example 1: Execute 'node --version'
execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout); // Output: v14.17.5 (or your Node.js version)
});

// Example 2: Promisified version
const util = require('util');
const execFilePromise = util.promisify(execFile);

async function getVersion() {
  try {
    const { stdout } = await execFilePromise('node', ['--version']);
    console.log(stdout); // Output: v14.17.5 (or your Node.js version)
  } catch (error) {
    console.error(error);
  }
}

getVersion();
```

**Explanation:**
- `execFile()` executes the specified file (`node` in this case) with arguments (`--version`).
- Callback receives `error`, `stdout`, and `stderr`. Promisified version returns an object with `stdout` and `stderr`.
- Demonstrates basic execution and usage of `execFile` with both callback and promise handling.

---

### **2. `fork(modulePath[, args][, options])`**

**Feature:**
- Specialized for spawning new Node.js processes specifically, with built-in inter-process communication (IPC).

**Example:**

```javascript
// Parent script: fork a child process to execute a module
const { fork } = require('child_process');

if (process.argv[2] === 'child') {
  // Child process code
  setTimeout(() => {
    console.log(`Hello from ${process.argv[2]}!`);
  }, 1000);
} else {
  // Parent process code
  const controller = new AbortController();
  const { signal } = controller;

  const child = fork(__filename, ['child'], { signal });

  child.on('error', (err) => {
    console.error(err); // Output: AbortError if controller.abort() is called
  });

  controller.abort(); // Stops the child process
}
```

**Explanation:**
- `fork()` spawns a new Node.js process running the module specified by `__filename`.
- Communication between parent and child processes is handled via IPC.
- Demonstrates usage with an optional `signal` to abort the child process.

---

### **3. `spawn(command[, args][, options])`**

**Feature:**
- Spawns a new process using a specified command, with flexible options for configuration.

**Example:**

```javascript
const { spawn } = require('child_process');

// Example: Execute 'ls -lh /usr' command
const ls = spawn('ls', ['-lh', '/usr']);

// Handle stdout data event
ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// Handle stderr data event
ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// Handle process exit
ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

**Explanation:**
- `spawn()` runs the `ls -lh /usr` command and handles `stdout`, `stderr`, and process exit.
- Demonstrates event-based handling for output and process termination.

---

These methods (`execFile`, `fork`, `spawn`) in Node.js provide powerful capabilities for executing external processes and managing child processes efficiently. Depending on your requirements—whether for direct file execution, Node.js module execution, or general command-line execution—you can choose the appropriate method to handle child processes effectively.


---


### **Child Processes in Node.js: `spawn` Method Explained**

The `spawn` method in Node.js from the `child_process` module is used to launch new processes, providing flexibility to interact with them via streams for input/output handling and events for process lifecycle management. Below are detailed examples with explanations and expected outputs:

---

### **1. Basic `spawn` Example: Running `ls -lh /usr`**

**Example:**

```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

**Explanation:**
- `spawn('ls', ['-lh', '/usr'])` runs the command `ls -lh /usr`.
- `ls.stdout.on('data')` captures standard output (`stdout`).
- `ls.stderr.on('data')` captures standard error (`stderr`).
- `ls.on('close')` handles the process close event, logging the exit code.

**Output:**
- Prints detailed listing of `/usr` directory.
- Logs exit code when the process finishes.

---

### **2. Piping Output Between Processes: `ps ax | grep ssh`**

**Example:**

```javascript
const { spawn } = require('child_process');
const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(`grep output: ${data}`);
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

**Explanation:**
- `ps` command lists all processes (`ps ax`).
- `grep` filters output for lines containing 'ssh'.
- `ps.stdout` pipes data to `grep.stdin`.
- Event listeners manage `stdout`, `stderr`, and process exit codes for both commands.

**Output:**
- Prints lines from `ps ax` containing 'ssh'.
- Logs process exit codes for `ps` and `grep`.

---

### **3. Handling Errors: Checking for Failed Spawn**

**Example:**

```javascript
const { spawn } = require('child_process');
const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

**Explanation:**
- `spawn('bad_command')` attempts to run a non-existent command.
- `subprocess.on('error')` handles errors if the command fails to start.

**Output:**
- Logs 'Failed to start subprocess.' if `bad_command` cannot be executed.

---

### **4. Detaching and Handling Long-Running Processes**

**Example:**

```javascript
const { spawn } = require('child_process');

// Detached process example
const subprocess = spawn(process.argv[0], ['child_program.js'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

**Explanation:**
- `spawn(process.argv[0], ['child_program.js'], { detached: true, stdio: 'ignore' })` starts a detached child process running `child_program.js`.
- `stdio: 'ignore'` ensures no I/O streams are connected to the parent.
- `subprocess.unref()` allows the parent to exit independently of the child.

**Output:**
- Runs `child_program.js` independently in the background.
- Parent exits without waiting for the child process.

---

### **Summary**

The `spawn` method in Node.js provides robust functionality for launching and managing child processes, offering capabilities such as piping data between processes, error handling, and detaching processes for independent execution. Understanding these features allows developers to effectively utilize Node.js for complex system interactions and background processing tasks.



----
.

### Example 1: Basic `spawn` with `'pipe'` stdio

```javascript
const { spawn } = require('child_process');

const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

- **Explanation:**
  - Spawns a child process running `ls -lh /usr`.
  - `ls.stdout.on('data')` listens for data from stdout of the child process.
  - `ls.stderr.on('data')` listens for data from stderr of the child process.
  - `ls.on('close')` captures the exit code of the child process.

**Expected Output:**
- Outputs the directory listing of `/usr` with details.
- Errors, if any, from stderr.
- Exit code of the child process.

### Example 2: `spawn` with piped processes (`ps ax | grep ssh`)

```javascript
const { spawn } = require('child_process');

const ps = spawn('ps', ['ax']);
const grep = spawn('grep', ['ssh']);

ps.stdout.on('data', (data) => {
  grep.stdin.write(data);
});

ps.stderr.on('data', (data) => {
  console.error(`ps stderr: ${data}`);
});

ps.on('close', (code) => {
  if (code !== 0) {
    console.log(`ps process exited with code ${code}`);
  }
  grep.stdin.end();
});

grep.stdout.on('data', (data) => {
  console.log(`grep stdout: ${data}`);
});

grep.stderr.on('data', (data) => {
  console.error(`grep stderr: ${data}`);
});

grep.on('close', (code) => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`);
  }
});
```

- **Explanation:**
  - Spawns `ps ax` to list all processes.
  - Spawns `grep ssh` to filter processes containing "ssh".
  - `ps.stdout` pipes data to `grep.stdin`.
  - Error handling for `ps` and `grep` processes.
  - `grep.stdout` prints processes containing "ssh".
  - `grep.stderr` prints any errors from `grep`.
  - Handles exit codes for both processes.

**Expected Output:**
- Lists processes containing "ssh" from the output of `ps ax`.

### Example 3: Handling failed `spawn`

```javascript
const { spawn } = require('child_process');

const subprocess = spawn('bad_command');

subprocess.on('error', (err) => {
  console.error('Failed to start subprocess.');
});
```

- **Explanation:**
  - Tries to spawn a non-existent command (`bad_command`).
  - `subprocess.on('error')` handles errors when the command cannot be spawned.

**Expected Output:**
- Logs `Failed to start subprocess.` when `bad_command` cannot be executed.

### Example 4: Using `execFileSync` for synchronous execution

```javascript
const { execFileSync } = require('child_process');

try {
  const output = execFileSync('ls', ['-lh', '/usr'], {
    stdio: 'pipe',
    encoding: 'utf8'
  });
  console.log(output);
} catch (error) {
  console.error(error);
}
```

- **Explanation:**
  - Synchronously executes `ls -lh /usr`.
  - Captures stdout of the child process.
  - Uses `pipe` for stdio configuration.
  - Handles errors on non-zero exit or timeout.

**Expected Output:**
- Prints the directory listing of `/usr` with details.

### Summary

Each example demonstrates different ways to interact with child processes in Node.js using `child_process` module, configuring `stdio` for communication, handling errors, and capturing outputs from child processes. Adjustments in `stdio` configurations (like `pipe`, `ignore`, `inherit`, custom streams) allow flexibility in how data is exchanged between parent and child processes, ensuring efficient and controlled execution of external commands.



----



The `child_process` module in Node.js provides the ability to spawn child processes. This can be done using various methods, including `execSync` and `spawnSync`, which are synchronous and block the event loop until the child process exits.

### `child_process.execSync(command[, options])`

`execSync` runs a command in a shell and returns the stdout as a Buffer (by default) or a string. It is synchronous and blocks the Node.js event loop until the command completes.

#### Syntax
```javascript
const { execSync } = require('child_process');

const output = execSync(command[, options]);
```

#### Parameters
- **command**: The command to run as a string.
- **options**: An optional object with the following properties:
  - **cwd**: Current working directory of the child process.
  - **input**: Value passed as stdin to the spawned process.
  - **stdio**: Child's stdio configuration.
  - **env**: Environment key-value pairs.
  - **shell**: Shell to execute the command with.
  - **uid**: Sets the user identity of the process.
  - **gid**: Sets the group identity of the process.
  - **timeout**: Maximum time (in milliseconds) the process is allowed to run.
  - **killSignal**: Signal value to be used when the process is killed.
  - **maxBuffer**: Largest amount of data in bytes allowed on stdout or stderr.
  - **encoding**: Encoding used for stdio inputs and outputs.
  - **windowsHide**: Hide the subprocess console window on Windows.

#### Returns
- The stdout from the command as a Buffer or string.

#### Example
```javascript
const { execSync } = require('child_process');

try {
  const output = execSync('ls -lh /usr');
  console.log(output.toString());
} catch (err) {
  console.error(`Error: ${err.message}`);
}
```

### `child_process.spawnSync(command[, args][, options])`

`spawnSync` launches a new process with a given command and arguments. It is more powerful and flexible than `execSync` as it allows fine-grained control over input/output.

#### Syntax
```javascript
const { spawnSync } = require('child_process');

const result = spawnSync(command[, args][, options]);
```

#### Parameters
- **command**: The command to run as a string.
- **args**: List of string arguments.
- **options**: An optional object with the following properties:
  - **cwd**: Current working directory of the child process.
  - **input**: Value passed as stdin to the spawned process.
  - **argv0**: Explicitly set the value of argv[0] sent to the child process.
  - **stdio**: Child's stdio configuration.
  - **env**: Environment key-value pairs.
  - **uid**: Sets the user identity of the process.
  - **gid**: Sets the group identity of the process.
  - **timeout**: Maximum time (in milliseconds) the process is allowed to run.
  - **killSignal**: Signal value to be used when the process is killed.
  - **maxBuffer**: Largest amount of data in bytes allowed on stdout or stderr.
  - **encoding**: Encoding used for stdio inputs and outputs.
  - **shell**: If true, runs command inside of a shell.
  - **windowsVerbatimArguments**: No quoting or escaping of arguments on Windows.
  - **windowsHide**: Hide the subprocess console window on Windows.

#### Returns
- An object with the following properties:
  - **pid**: PID of the child process.
  - **output**: Array of results from stdio output.
  - **stdout**: The contents of output[1].
  - **stderr**: The contents of output[2].
  - **status**: The exit code of the subprocess.
  - **signal**: The signal used to kill the subprocess.
  - **error**: The error object if the child process failed or timed out.

#### Example
```javascript
const { spawnSync } = require('child_process');

const result = spawnSync('ls', ['-lh', '/usr']);

if (result.error) {
  console.error(`Error: ${result.error.message}`);
} else {
  console.log(`stdout: ${result.stdout.toString()}`);
  console.log(`stderr: ${result.stderr.toString()}`);
  console.log(`status: ${result.status}`);
}
```

### `ChildProcess` Class

Instances of `ChildProcess` represent spawned child processes and are not intended to be created directly. Instead, use methods like `spawn()`, `exec()`, `execFile()`, or `fork()`.

#### Events
- **'close'**: Emitted after the child process has ended and the stdio streams have closed.
- **'disconnect'**: Emitted after calling `subprocess.disconnect()` or `process.disconnect()`.
- **'error'**: Emitted when the process could not be spawned, killed, or had another error.

#### Example
```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

These methods and events provide robust tools to manage child processes in Node.js. Always be cautious with user input to avoid security risks associated with shell metacharacters.



Let's include the actual outputs for the examples provided. 

### `child_process.execSync(command[, options])`

#### Example
```javascript
const { execSync } = require('child_process');

try {
  const output = execSync('ls -lh /usr');
  console.log(output.toString());
} catch (err) {
  console.error(`Error: ${err.message}`);
}
```

#### Output
Assuming the `/usr` directory exists and contains various files and directories, the output will look something like this:
```
total 192
drwxr-xr-x   2 root root  4096 Jun  1 11:02 bin
drwxr-xr-x   2 root root  4096 Apr 15  2020 games
drwxr-xr-x  23 root root 12288 Jun  1 11:02 include
drwxr-xr-x  63 root root 20480 Jun  1 11:02 lib
drwxr-xr-x   3 root root  4096 Apr 15  2020 local
drwxr-xr-x   2 root root 12288 Jun  1 11:02 sbin
drwxr-xr-x 227 root root  4096 Jun  1 11:02 share
drwxr-xr-x   3 root root  4096 Jun  1 11:02 src
```

### `child_process.spawnSync(command[, args][, options])`

#### Example
```javascript
const { spawnSync } = require('child_process');

const result = spawnSync('ls', ['-lh', '/usr']);

if (result.error) {
  console.error(`Error: ${result.error.message}`);
} else {
  console.log(`stdout: ${result.stdout.toString()}`);
  console.log(`stderr: ${result.stderr.toString()}`);
  console.log(`status: ${result.status}`);
}
```

#### Output
Assuming the `/usr` directory exists and contains various files and directories, the output will look something like this:
```
stdout: total 192
drwxr-xr-x   2 root root  4096 Jun  1 11:02 bin
drwxr-xr-x   2 root root  4096 Apr 15  2020 games
drwxr-xr-x  23 root root 12288 Jun  1 11:02 include
drwxr-xr-x  63 root root 20480 Jun  1 11:02 lib
drwxr-xr-x   3 root root  4096 Apr 15  2020 local
drwxr-xr-x   2 root root 12288 Jun  1 11:02 sbin
drwxr-xr-x 227 root root  4096 Jun  1 11:02 share
drwxr-xr-x   3 root root  4096 Jun  1 11:02 src

stderr: 
status: 0
```

### `ChildProcess` Class

#### Example
```javascript
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
});

ls.on('exit', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

#### Output
The stdout output will be printed as data events are received:
```
stdout: total 192
stdout: drwxr-xr-x   2 root root  4096 Jun  1 11:02 bin
stdout: drwxr-xr-x   2 root root  4096 Apr 15  2020 games
stdout: drwxr-xr-x  23 root root 12288 Jun  1 11:02 include
stdout: drwxr-xr-x  63 root root 20480 Jun  1 11:02 lib
stdout: drwxr-xr-x   3 root root  4096 Apr 15  2020 local
stdout: drwxr-xr-x   2 root root 12288 Jun  1 11:02 sbin
stdout: drwxr-xr-x 227 root root  4096 Jun  1 11:02 share
stdout: drwxr-xr-x   3 root root  4096 Jun  1 11:02 src
child process close all stdio with code 0
child process exited with code 0
```

These outputs are typical for the commands executed on a Unix-like system. The actual output might vary depending on the contents of the `/usr` directory on your system.


---


Certainly! Here’s a detailed explanation of handling child processes in Node.js with outputs included.

### Handling Child Processes in Node.js

Understanding the events and methods provided by the `child_process` module is crucial for managing child processes effectively. Let's explore key events and methods with complete examples and outputs.

#### Event: 'exit'

The `'exit'` event is emitted after the child process ends. The event handler receives two arguments:
- `code`: The exit code if the child exited on its own.
- `signal`: The signal by which the child process was terminated.

Example:

```javascript
const { spawn } = require('child_process');

const child = spawn('ls', ['-lh', '/usr']);

child.on('exit', (code, signal) => {
  if (code !== null) {
    console.log(`Child exited with code ${code}`);
  } else {
    console.log(`Child terminated due to receipt of signal ${signal}`);
  }
});
```

**Expected Output:**

```
Child exited with code 0
```

Explanation:
- This script spawns a child process to list files in `/usr` directory.
- When the child process exits, the `'exit'` event is triggered.
- It logs either the exit code or the termination signal.

#### Event: 'message'

The `'message'` event is triggered when a child process uses `process.send()` to send messages. This is typically used in conjunction with `child_process.fork()`.

Example:

**parent.js:**

```javascript
const { fork } = require('child_process');
const child = fork('child.js');

child.on('message', (message) => {
  console.log('Received message from child:', message);
});

child.send({ hello: 'world' });
```

**child.js:**

```javascript
process.on('message', (message) => {
  console.log('Received message from parent:', message);
  process.send({ foo: 'bar' });
});
```

**Expected Output:**

```
# Output from child.js
Received message from parent: { hello: 'world' }

# Output from parent.js
Received message from child: { foo: 'bar' }
```

Explanation:
- `parent.js` forks a new Node.js process running `child.js`.
- The parent sends a message to the child.
- The child logs the received message and sends a response back to the parent.
- Both parent and child log the messages they receive.

#### Event: 'spawn'

The `'spawn'` event is emitted once the child process has spawned successfully.

Example:

```javascript
const { spawn } = require('child_process');

const child = spawn('ls', ['-lh', '/usr']);

child.on('spawn', () => {
  console.log('Child process spawned successfully');
});
```

**Expected Output:**

```
Child process spawned successfully
```

Explanation:
- This script spawns a child process to list files in `/usr` directory.
- When the child process spawns successfully, the `'spawn'` event is triggered, logging a success message.

#### `subprocess.kill([signal])`

The `subprocess.kill()` method sends a signal to the child process. By default, the signal sent is `'SIGTERM'`.

Example:

```javascript
const { spawn } = require('child_process');

const child = spawn('grep', ['ssh']);

child.on('close', (code, signal) => {
  console.log(`Child process terminated due to receipt of signal ${signal}`);
});

// Send SIGHUP to process.
child.kill('SIGHUP');
```

**Expected Output:**

```
Child process terminated due to receipt of signal SIGHUP
```

Explanation:
- This script spawns a child process to run the `grep ssh` command.
- The parent process sends a `SIGHUP` signal to the child process after spawning it.
- When the child process closes, it logs the signal that terminated it.

#### `subprocess.send(message[, sendHandle[, options]][, callback])`

When an IPC (Inter-Process Communication) channel has been established between the parent and child (i.e., when using `child_process.fork()`), the `subprocess.send()` method can be used to send messages to the child process.

Example:

**parent.js:**

```javascript
const { fork } = require('child_process');
const child = fork('child.js');

child.on('message', (message) => {
  console.log('PARENT got message:', message);
});

child.send({ hello: 'world' });
```

**child.js:**

```javascript
process.on('message', (message) => {
  console.log('CHILD got message:', message);
  process.send({ foo: 'bar' });
});
```

**Expected Output:**

```
# Output from child.js
CHILD got message: { hello: 'world' }

# Output from parent.js
PARENT got message: { foo: 'bar' }
```

Explanation:
- The parent forks a new Node.js process running `child.js`.
- The parent sends a message to the child, which logs the received message and sends a response back.
- Both parent and child log the messages they receive.

#### `subprocess.disconnect()`

The `subprocess.disconnect()` method closes the IPC channel between the parent and child, allowing the child to exit gracefully.

Example:

```javascript
const { fork } = require('child_process');
const child = fork('child.js');

child.on('disconnect', () => {
  console.log('Child process disconnected');
});

child.send({ hello: 'world' });
child.disconnect();
```

**Expected Output:**

```
Child process disconnected
```

Explanation:
- The parent forks a new Node.js process running `child.js`.
- The parent sends a message to the child and then disconnects the IPC channel.
- When the IPC channel is closed, the `'disconnect'` event is triggered, logging a message.

### Advanced Concepts

#### `subprocess.channel`

The `subprocess.channel` property is a reference to the child's IPC channel. This property is `undefined` if no IPC channel exists.

#### `subprocess.ref()` and `subprocess.unref()`

These methods control whether the child process keeps the event loop of the parent process running.

Example:

```javascript
const { spawn } = require('child_process');

const subprocess = spawn('node', ['-e', 'setInterval(() => {}, 1000)'], {
  detached: true,
  stdio: 'ignore',
});

subprocess.unref();
```

Explanation:
- This script spawns a detached Node.js process that runs an infinite interval.
- Calling `subprocess.unref()` allows the parent to exit independently of the child process.

### Summary

These examples and explanations cover key aspects of managing child processes in Node.js. By understanding and using these events and methods, you can effectively handle child processes, manage their lifecycle, and communicate between parent and child processes.




### Detailed Explanation with Examples and Outputs

In Node.js, the `child_process` module allows you to spawn new processes and handle inter-process communication (IPC). Here, we cover some advanced topics, such as the use of the `sendHandle` argument for passing server and socket objects, as well as properties and methods related to child processes.

#### Special Messages with `NODE_` Prefix

Messages with a `NODE_` prefix in the `cmd` property are reserved for Node.js core use and will not be emitted in the child's `'message'` event. Instead, they are emitted using the `'internalMessage'` event.

**Important Note:** Applications should avoid using such messages or listening for `'internalMessage'` events as they are subject to change without notice.

#### Sending Server and Socket Objects

The `sendHandle` argument in `subprocess.send()` is used to pass TCP server or socket objects to the child process.

##### Example: Sending a Server Object

**parent.js:**

```javascript
const subprocess = require('child_process').fork('child.js');

// Open up the server object and send the handle.
const server = require('net').createServer();
server.on('connection', (socket) => {
  socket.end('handled by parent');
});
server.listen(1337, () => {
  subprocess.send('server', server);
});
```

**child.js:**

```javascript
process.on('message', (m, server) => {
  if (m === 'server') {
    server.on('connection', (socket) => {
      socket.end('handled by child');
    });
  }
});
```

**Output:**

1. Parent handles some connections:
   ```
   Connection handled by parent
   ```

2. Child handles some connections:
   ```
   Connection handled by child
   ```

Explanation:
- The parent creates a server and listens on port 1337.
- It sends the server object to the child process.
- Both parent and child can handle incoming connections.

##### Example: Sending a Socket Object

**parent.js:**

```javascript
const { fork } = require('child_process');
const normal = fork('child.js', ['normal']);
const special = fork('child.js', ['special']);

// Open up the server and send sockets to child. Use pauseOnConnect to prevent
// the sockets from being read before they are sent to the child process.
const server = require('net').createServer({ pauseOnConnect: true });
server.on('connection', (socket) => {
  // If this is special priority...
  if (socket.remoteAddress === '74.125.127.100') {
    special.send('socket', socket);
    return;
  }
  // This is normal priority.
  normal.send('socket', socket);
});
server.listen(1337);
```

**child.js:**

```javascript
process.on('message', (m, socket) => {
  if (m === 'socket') {
    if (socket) {
      socket.end(`Request handled with ${process.argv[2]} priority`);
    }
  }
});
```

**Output:**

1. Connections handled by normal priority:
   ```
   Request handled with normal priority
   ```

2. Connections handled by special priority:
   ```
   Request handled with special priority
   ```

Explanation:
- The parent forks two child processes, one for normal and one for special priority.
- Based on the client's IP address, the parent sends the socket object to the appropriate child process.
- Each child handles the connection and sends a response.

#### Properties and Methods

- **`subprocess.signalCode`**: Indicates the signal received by the child process, if any, else `null`.
  
  Example:
  ```javascript
  const { spawn } = require('child_process');
  const child = spawn('ls');

  child.on('exit', (code, signal) => {
    console.log(`Child exited with code ${code} and signal ${signal}`);
    console.log(`Signal received: ${child.signalCode}`);
  });
  ```

  **Output:**
  ```
  Child exited with code 0 and signal null
  Signal received: null
  ```

- **`subprocess.spawnargs`**: Represents the full list of command-line arguments the child process was launched with.

  Example:
  ```javascript
  const { spawn } = require('child_process');
  const child = spawn('ls', ['-lh', '/usr']);

  console.log(`Spawn args: ${child.spawnargs}`);
  ```

  **Output:**
  ```
  Spawn args: ls,-lh,/usr
  ```

- **`subprocess.spawnfile`**: Indicates the executable file name of the child process.

  Example:
  ```javascript
  const { spawn } = require('child_process');
  const child = spawn('ls');

  console.log(`Spawn file: ${child.spawnfile}`);
  ```

  **Output:**
  ```
  Spawn file: ls
  ```

- **`subprocess.stderr`**: A readable stream representing the child process's stderr.

  Example:
  ```javascript
  const { spawn } = require('child_process');
  const fs = require('fs');
  
  const child = spawn('ls', {
    stdio: [
      'ignore', // Ignore stdin
      'ignore', // Ignore stdout
      fs.openSync('error.log', 'w') // Write stderr to a file
    ]
  });

  child.on('exit', (code, signal) => {
    console.log(`Child process exited with code ${code} and signal ${signal}`);
  });
  ```

  **Output:**
  ```
  (No output to console, errors are written to error.log)
  ```

- **`subprocess.stdin`**: A writable stream representing the child process's stdin.

  Example:
  ```javascript
  const { spawn } = require('child_process');

  const child = spawn('cat');

  child.stdin.write('Hello, World!\n');
  child.stdin.end();
  ```

  **Output:**
  ```
  (No output to console, but 'Hello, World!' is passed to cat)
  ```

- **`subprocess.stdio`**: An array representing the pipes to the child process.

  Example:
  ```javascript
  const { spawn } = require('child_process');
  const fs = require('fs');

  const child = spawn('ls', {
    stdio: [
      'ignore',
      'pipe',
      fs.openSync('err.out', 'w')
    ]
  });

  child.stdout.on('data', (data) => {
    console.log(`Received chunk ${data}`);
  });
  ```

  **Output:**
  ```
  Received chunk (output from ls command)
  ```

- **`subprocess.stdout`**: A readable stream representing the child process's stdout.

  Example:
  ```javascript
  const { spawn } = require('child_process');

  const child = spawn('ls');

  child.stdout.on('data', (data) => {
    console.log(`Received chunk ${data}`);
  });
  ```

  **Output:**
  ```
  Received chunk (output from ls command)
  ```

- **`subprocess.unref()`**: Prevents the parent from waiting for the child to exit.

  Example:
  ```javascript
  const { spawn } = require('child_process');

  const child = spawn('node', ['-e', 'setInterval(() => {}, 1000)'], {
    detached: true,
    stdio: 'ignore'
  });

  child.unref();
  ```

  **Output:**
  ```
  (No output, parent exits without waiting for child)
  ```

### Summary

These examples illustrate advanced usage of the `child_process` module, including handling IPC, passing server and socket objects, and understanding various properties and methods. By mastering these techniques, you can effectively manage and communicate with child processes in Node.js.
