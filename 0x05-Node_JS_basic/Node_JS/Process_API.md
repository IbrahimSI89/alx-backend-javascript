### Node.js Process Object

The `process` object is a global object in Node.js and can be accessed from anywhere in a Node.js application. It is an instance of the `EventEmitter` class, providing a powerful mechanism to interact with the runtime environment of the Node.js process.

#### Exit Codes

Node.js exits with different status codes based on the situation. By default, it exits with a status code of 0 when no more asynchronous operations are pending. The following status codes are used in other cases:

1. **1 - Uncaught Fatal Exception**: An uncaught exception was not handled by a domain or an `uncaughtException` event handler.
2. **2 - Unused**: Reserved by Bash for builtin misuse.
3. **3 - Internal JavaScript Parse Error**: An internal JavaScript source code parse error during Node's bootstrapping process.
4. **4 - Internal JavaScript Evaluation Failure**: Internal JavaScript source code failed to return a function value during evaluation.
5. **5 - Fatal Error**: A fatal unrecoverable error in V8, typically with a message prefixed by `FATAL ERROR`.
6. **6 - Non-function Internal Exception Handler**: An uncaught exception occurred, but the internal exception handler was set to a non-function.
7. **7 - Internal Exception Handler Run-Time Failure**: An internal exception handler threw an error while attempting to handle an uncaught exception.
8. **8 - Unused**: Previously used to indicate an uncaught exception.
9. **9 - Invalid Argument**: An unknown option was specified, or an option requiring a value was provided without a value.
10. **10 - Internal JavaScript Run-Time Failure**: An error occurred during the bootstrapping function call.
12. **12 - Invalid Debug Argument**: The `--debug` and/or `--debug-brk` options were set with an invalid port number.
13. **>128 - Signal Exits**: If Node.js receives a fatal signal such as `SIGKILL` or `SIGHUP`, the exit code is 128 plus the value of the signal code.

#### Event: 'exit'

The `exit` event is emitted when the process is about to exit. Once all exit listeners have finished running, the process will exit. Only synchronous operations can be performed in this handler.

Example:

```javascript
process.on('exit', (code) => {
  console.log('About to exit with code:', code);
  // do *NOT* do this
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

#### Event: 'beforeExit'

The `beforeExit` event is emitted when Node.js empties its event loop and has nothing else to schedule. A listener for `beforeExit` can make asynchronous calls, causing Node.js to continue.

Example:

```javascript
process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code:', code);
  // Asynchronous operation to prevent exit
  setTimeout(() => {
    console.log('Asynchronous call');
  }, 0);
});
```

#### Event: 'uncaughtException'

The `uncaughtException` event is emitted when an exception bubbles back to the event loop. If a listener is added for this exception, the default action (printing a stack trace and exiting) will not occur.

Example:

```javascript
process.on('uncaughtException', (err) => {
  console.log('Caught exception:', err);
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// Intentionally cause an exception
nonexistentFunc();
console.log('This will not run.');
```

**Warning**: The `uncaughtException` event is a crude mechanism for exception handling and should be used cautiously. Restart the application after every unhandled exception.

#### Signal Events

Signal events are emitted when the process receives a signal. Standard POSIX signal names like `SIGINT`, `SIGHUP`, etc., can be used.

Example:

```javascript
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Got SIGINT. Press Control-D to exit.');
});
```

**Notes on Signals**:

- `SIGUSR1` is reserved by Node.js to start the debugger.
- `SIGTERM` and `SIGINT` have default handlers on non-Windows platforms.
- `SIGPIPE` is ignored by default.
- `SIGHUP` is generated on Windows when the console window is closed.
- `SIGINT` from the terminal is supported on all platforms.
- `SIGBREAK` is delivered on Windows when `CTRL+BREAK` is pressed.
- `SIGWINCH` is delivered when the console is resized.
- `SIGKILL` and `SIGSTOP` cannot have a listener installed.

#### process.stdout

The `process.stdout` is a writable stream to stdout (file descriptor 1).

Example:

```javascript
console.log = function(d) {
  process.stdout.write(d + '\n');
};
```

- `process.stderr` and `process.stdout` cannot be closed, never emit the `finish` event, and writes are usually blocking.
- On Linux/Unix, `stdout` and `stderr` are blocking when referring to regular files or TTY file descriptors but non-blocking when referring to pipes.
- On Windows, they are non-blocking like other streams.

To check if Node.js is running in a TTY context:

```bash
node -p "Boolean(process.stdin.isTTY)"
true

echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false

node -p "Boolean(process.stdout.isTTY)"
true

node -p "Boolean(process.stdout.isTTY)" | cat
false
```



### Node.js Process Object and Its Methods

The `process` object in Node.js provides information and control over the current Node.js process. Below are various aspects and methods of the `process` object along with explanations and examples.

#### process.stderr
- **Description**: A writable stream to `stderr` (standard error output) on file descriptor 2.
- **Characteristics**: Unlike other streams in Node.js, `process.stderr` and `process.stdout` cannot be closed, never emit the `finish` event, and writes to them are usually blocking.

#### Example:

```javascript
process.stderr.write('This is an error message.\n');
```

#### process.stdin
- **Description**: A readable stream for `stdin` (standard input) on file descriptor 0.
- **Usage**: Used to read input from the standard input (keyboard).

#### Example:

```javascript
process.stdin.setEncoding('utf8');

process.stdin.on('readable', function() {
  var chunk = process.stdin.read();
  if (chunk !== null) {
    process.stdout.write('data: ' + chunk);
  }
});

process.stdin.on('end', function() {
  process.stdout.write('end');
});
```

#### process.argv
- **Description**: An array containing the command line arguments. The first element is 'node', the second element is the JavaScript file name, and the subsequent elements are additional command line arguments.

#### Example:

```javascript
process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
});

// Output example
// $ node process-2.js one two=three four
// 0: node
// 1: /Users/mjr/work/node/process-2.js
// 2: one
// 3: two=three
// 4: four
```

#### process.execPath
- **Description**: The absolute pathname of the executable that started the process.

#### Example:

```javascript
console.log(process.execPath);
// Output example: /usr/local/bin/node
```

#### process.execArgv
- **Description**: An array of command line options passed to the Node.js executable.

#### Example:

```javascript
// Run command: $ node --harmony script.js --version
console.log(process.execArgv);
// Output: ['--harmony']
console.log(process.argv);
// Output: ['/usr/local/bin/node', 'script.js', '--version']
```

#### process.abort()
- **Description**: Causes Node.js to emit an abort, exiting and generating a core file.

#### Example:

```javascript
process.abort();
```

#### process.chdir(directory)
- **Description**: Changes the current working directory of the process.

#### Example:

```javascript
console.log('Starting directory: ' + process.cwd());
try {
  process.chdir('/tmp');
  console.log('New directory: ' + process.cwd());
} catch (err) {
  console.log('chdir: ' + err);
}
```

#### process.cwd()
- **Description**: Returns the current working directory of the process.

#### Example:

```javascript
console.log('Current directory: ' + process.cwd());
```

#### process.env
- **Description**: An object containing the user environment variables.

#### Example:

```javascript
console.log(process.env);
// Example output:
// { TERM: 'xterm-256color', SHELL: '/usr/local/bin/bash', USER: 'maciej', PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin', PWD: '/Users/maciej', EDITOR: 'vim', SHLVL: '1', HOME: '/Users/maciej', LOGNAME: 'maciej', _: '/usr/local/bin/node' }
```

#### process.exit([code])
- **Description**: Ends the process with the specified exit code. If omitted, the default is 0 (success).

#### Example:

```javascript
process.exit(1);
```

#### process.exitCode
- **Description**: A number which will be the process exit code when the process exits gracefully.

#### Example:

```javascript
process.exitCode = 1;
```

#### process.getgid() / process.setgid(id)
- **Description**: Get or set the group identity of the process (POSIX only).

#### Example:

```javascript
if (process.getgid) {
  console.log('Current gid: ' + process.getgid());
}

if (process.getgid && process.setgid) {
  console.log('Current gid: ' + process.getgid());
  try {
    process.setgid(501);
    console.log('New gid: ' + process.getgid());
  } catch (err) {
    console.log('Failed to set gid: ' + err);
  }
}
```
### Node.js Process Object and Its Methods with Outputs

The `process` object in Node.js provides information and control over the current Node.js process. Below are various aspects and methods of the `process` object along with explanations, examples, and expected outputs.

#### process.getuid()
- **Description**: Gets the user identity of the process. Only available on POSIX platforms.

#### Example:

```javascript
if (process.getuid) {
  console.log('Current uid: ' + process.getuid());
}
```

#### Output:

```
Current uid: 501
```

#### process.setuid(id)
- **Description**: Sets the user identity of the process. Accepts either a numerical ID or a username string. Only available on POSIX platforms.

#### Example:

```javascript
if (process.getuid && process.setuid) {
  console.log('Current uid: ' + process.getuid());
  try {
    process.setuid(1000);
    console.log('New uid: ' + process.getuid());
  } catch (err) {
    console.log('Failed to set uid: ' + err);
  }
}
```

#### Output:

```
Current uid: 501
New uid: 1000
```

#### process.getgroups()
- **Description**: Returns an array with the supplementary group IDs. Only available on POSIX platforms.

#### Example:

```javascript
console.log('Current groups: ' + process.getgroups().join(', '));
```

#### Output:

```
Current groups: 20, 27, 46, 1000, 0
```

#### process.setgroups(groups)
- **Description**: Sets the supplementary group IDs. Only available on POSIX platforms.

#### Example:

```javascript
try {
  process.setgroups([27, 30, 46, 1000]);
  console.log('Groups set successfully: ' + process.getgroups().join(', '));
} catch (err) {
  console.log('Failed to set groups: ' + err);
}
```

#### Output:

```
Groups set successfully: 27, 30, 46, 1000
```

#### process.initgroups(user, extra_group)
- **Description**: Initializes the group access list, using all groups of which the user is a member. Only available on POSIX platforms.

#### Example:

```javascript
console.log('Initial groups: ' + process.getgroups().join(', '));
try {
  process.initgroups('your_username', 1000);
  console.log('Updated groups: ' + process.getgroups().join(', '));
} catch (err) {
  console.log('Failed to initialize groups: ' + err);
}
```

#### Output:

```
Initial groups: 20, 27, 46, 1000, 0
Updated groups: 27, 30, 46, 1000, 0
```

#### process.version
- **Description**: A compiled-in property that exposes `NODE_VERSION`.

#### Example:

```javascript
console.log('Version: ' + process.version);
```

#### Output:

```
Version: v16.13.0
```

#### process.versions
- **Description**: A property exposing version strings of Node and its dependencies.

#### Example:

```javascript
console.log(process.versions);
```

#### Output:

```
{
  node: '16.13.0',
  v8: '9.4.146.24-node.14',
  uv: '1.42.0',
  zlib: '1.2.11',
  brotli: '1.0.9',
  ares: '1.17.2',
  modules: '93',
  nghttp2: '1.43.0',
  napi: '8',
  llhttp: '6.0.4',
  openssl: '1.1.1l',
  cldr: '39.0',
  icu: '69.1',
  tz: '2021a3',
  unicode: '13.0'
}
```

#### process.config
- **Description**: An object containing the JavaScript representation of the configure options used to compile the current Node executable.

#### Example:

```javascript
console.log(process.config);
```

#### Output:

```
{
  target_defaults: {
    cflags: [],
    default_configuration: 'Release',
    defines: [],
    include_dirs: [],
    libraries: []
  },
  variables: {
    host_arch: 'x64',
    node_install_npm: 'true',
    node_prefix: '',
    node_shared_cares: 'false',
    node_shared_http_parser: 'false',
    node_shared_libuv: 'false',
    node_shared_v8: 'false',
    node_shared_zlib: 'false',
    node_use_dtrace: 'false',
    node_use_openssl: 'true',
    node_shared_openssl: 'false',
    strict_aliasing: 'true',
    target_arch: 'x64',
    v8_use_snapshot: 'true'
  }
}
```

#### process.kill(pid[, signal])
- **Description**: Sends a signal to a process. `pid` is the process ID, and `signal` is the string describing the signal to send.

#### Example:

```javascript
process.on('SIGHUP', function() {
  console.log('Got SIGHUP signal.');
});

setTimeout(function() {
  console.log('Exiting.');
  process.exit(0);
}, 100);

process.kill(process.pid, 'SIGHUP');
```

#### Output:

```
Got SIGHUP signal.
Exiting.
```

#### process.pid
- **Description**: The PID of the process.

#### Example:

```javascript
console.log('This process is pid ' + process.pid);
```

#### Output:

```
This process is pid 12345
```

#### process.title
- **Description**: Getter/setter to set what is displayed in `ps`.

#### Example:

```javascript
console.log('Original title: ' + process.title);
process.title = 'myCustomProcess';
console.log('New title: ' + process.title);
```

#### Output:

```
Original title: node
New title: myCustomProcess
```

#### process.arch
- **Description**: What processor architecture you're running on: 'arm', 'ia32', or 'x64'.

#### Example:

```javascript
console.log('This processor architecture is ' + process.arch);
```

#### Output:

```
This processor architecture is x64
```

#### process.platform
- **Description**: What platform you're running on: 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'.

#### Example:

```javascript
console.log('This platform is ' + process.platform);
```

#### Output:

```
This platform is linux
```

#### process.memoryUsage()
- **Description**: Returns an object describing the memory usage of the Node process measured in bytes.

#### Example:

```javascript
const util = require('util');
console.log(util.inspect(process.memoryUsage()));
```

#### Output:

```
{
  rss: 4935680,
  heapTotal: 1826816,
  heapUsed: 650472
}
```

#### process.nextTick(callback)
- **Description**: Once the current event loop turn runs to completion, call the callback function.

#### Example:

```javascript
console.log('start');
process.nextTick(function() {
  console.log('nextTick callback');
});
console.log('scheduled');
```

#### Output:

```
start
scheduled
nextTick callback
```

#### process.umask([mask])
- **Description**: Sets or reads the process's file mode creation mask.

#### Example:

```javascript
var oldmask, newmask = 0o022;
oldmask = process.umask(newmask);
console.log('Changed umask from: ' + oldmask.toString(8) + ' to ' + newmask.toString(8));
```

#### Output:

```
Changed umask from: 0022 to 0022
```

#### process.uptime()
- **Description**: Number of seconds Node has been running.

#### Example:

```javascript
console.log('Uptime: ' + process.uptime() + ' seconds');
```

#### Output:

```
Uptime: 42.23 seconds
```

#### process.hrtime()
- **Description**: Returns the current high-resolution real time in a `[seconds, nanoseconds]` tuple Array.

#### Example:

```javascript
var time = process.hrtime();
setTimeout(function() {
  var diff = process.hrtime(time);
  console.log('benchmark took %d nanoseconds', diff[0] * 1e9 + diff[1]);
}, 1000);
```

#### Output:

```
benchmark took 1000000527 nanoseconds
```

#### process.mainModule
- **Description**: Alternate way to retrieve `require.main`.

#### Example:

```javascript
console.log('Main module: ', process.mainModule);
```

#### Output:

```
Main module: Module {
  id: '.',
  path: '/path/to/your/script',
  exports: {},
  parent: null,
  filename: '/path/to/your/script.js',
  loaded: false,
  children: [],
  paths: [ '/path/to/your/script/node_modules', '/node_modules' ]
}
```


### Summary
The process object in Node.js is a powerful global object providing information and control over the current Node.js process. It includes methods for interacting with the file system, environment variables, command line arguments, and more. Understanding the process object is essential for effective Node.js programming, enabling developers to manage the runtime environment and handle various process-level events.
