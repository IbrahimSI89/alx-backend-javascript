### nodemon

**nodemon** is a tool that helps in developing Node.js applications by automatically restarting the Node application when file changes in the directory are detected. This allows developers to focus on writing code without manually restarting the server after every change.

### Installation

You can install nodemon globally or locally as a development dependency:

```bash
# Globally (recommended for command-line use)
npm install -g nodemon
# or using yarn
yarn global add nodemon

# Locally (recommended for project-specific usage)
npm install --save-dev nodemon
# or using yarn
yarn add nodemon -D
```

### Usage

After installation, nodemon can be used as a replacement for the `node` command to run your Node.js application:

```bash
nodemon [your-node-app]
```

For example, if your application accepts host and port arguments:

```bash
nodemon ./server.js localhost 8080
```

#### CLI Options

To see all available CLI options:

```bash
nodemon -h
```

#### Example with --inspect Flag

You can pass flags to Node.js through nodemon:

```bash
nodemon --inspect ./server.js 80
```

### Automatic Re-running

nodemon monitors the specified directory (or directories) for file changes. If your script exits cleanly, nodemon will automatically restart it.

### Manual Restarting

While nodemon is running, if you need to manually restart your application, type `rs` followed by Enter, and nodemon will restart your process.

### Config Files

nodemon supports both local and global configuration files (`nodemon.json`). These files can define options that nodemon should use, such as `verbose`, `ignore` patterns, and `execMap` for custom file execution commands.

#### Example `nodemon.json` Configuration

```json
{
  "verbose": true,
  "ignore": ["*.test.js", "**/fixtures/**"],
  "execMap": {
    "rb": "ruby",
    "pde": "processing --sketch={{pwd}} --run"
  }
}
```

In this example:
- `verbose`: Enables verbose logging.
- `ignore`: Ignores files matching patterns like `*.test.js` and any files in `**/fixtures/**`.
- `execMap`: Defines mappings for file extensions (`rb` and `pde`) to executable commands (`ruby` and `processing`).

### More Information

For additional details on using nodemon, including FAQs and issues, refer to the [nodemon GitHub repository](https://github.com/remy/nodemon).

This overview and examples should help you get started with using nodemon effectively in your Node.js development workflow.



Here's the information on nodemon:

### Using package.json for Configuration

**nodemon** supports configuration via `package.json`, under the `nodemonConfig` key. This allows you to keep all your package configurations in one place.

#### Example `package.json` Configuration

```json
{
  "name": "nodemon",
  "homepage": "http://nodemon.io",
  "...": "... other standard package.json values",
  "nodemonConfig": {
    "ignore": ["**/test/**", "**/docs/**"],
    "delay": 2500
  }
}
```

In this example:
- `ignore`: Specifies patterns to ignore (`**/test/**` and `**/docs/**`).
- `delay`: Adds a delay of 2500 milliseconds before restarting.

Note:
- If you specify a `--config` file or provide a local `nodemon.json`, any `package.json` config under `nodemonConfig` will be ignored.

#### Using nodemon as a Module

For using nodemon programmatically as a module, refer to `doc/requireable.md`.

#### Using nodemon as a Child Process

For details on using nodemon as a child process, refer to `doc/events.md`.

### Running Non-Node Scripts

**nodemon** can execute and monitor scripts of various types, not limited to `.js` files. It monitors files based on their extensions.

#### Example with Python Script

```bash
nodemon --exec "python -v" ./app.py
```

In this example:
- `--exec "python -v"`: Executes `python` in verbose mode.
- `./app.py`: The Python script to run and monitor.

### Default Executables

You can define default executables for specific file extensions using `nodemon.json`.

#### Example Adding Perl Support

```json
{
  "execMap": {
    "pl": "perl"
  }
}
```

Now, you can run Perl scripts with nodemon:

```bash
nodemon script.pl
```

### Monitoring Multiple Directories

By default, nodemon monitors the current working directory. You can specify additional directories to monitor using the `--watch` option.

#### Example Monitoring Specific Directories

```bash
nodemon --watch app --watch libs app/server.js
```

In this example:
- `--watch app --watch libs`: Monitors changes in `app/` and `libs/`.
- `app/server.js`: The main script to execute and monitor.

### Unix Globbing Support

nodemon supports Unix globbing for specifying multiple directories or files to monitor.

#### Example with Unix Globbing

```bash
nodemon --watch './lib/*'
```

This monitors all files in the `lib/` directory.



Here's the information on **nodemon** regarding specifying extension watch list, ignoring files, application restarting issues, and delaying restarting:

### Specifying Extension Watch List

By default, **nodemon** monitors files with the extensions `.js`, `.mjs`, `.coffee`, `.litcoffee`, and `.json`. You can specify your own list using the `-e` or `--ext` switch:

```bash
nodemon -e js,pug
```

This command tells nodemon to restart on changes to files with `.js` and `.pug` extensions.

### Ignoring Files

To prevent nodemon from prematurely restarting your application, you can ignore specific files, directories, or patterns using the `--ignore` option:

```bash
nodemon --ignore lib/ --ignore tests/
```

This command ignores changes in the `lib/` and `tests/` directories.

Specific files can also be ignored:

```bash
nodemon --ignore lib/app.js
```

Patterns can be ignored as well (ensure to quote the arguments properly):

```bash
nodemon --ignore 'lib/*.js'
```

### Application Isn't Restarting

In networked environments or when nodemon reads across mounted drives (e.g., containers), you may need to enable Chokidar's polling with `--legacy-watch` or `-L`:

```bash
nodemon -L
```

Polling should be a last resort as it checks for file changes more frequently.

### Delaying Restarting

To delay restarting your application after changes, use the `--delay` option:

```bash
nodemon --delay 10 server.js
```

This delays restart by 10 seconds after the last file change.

You can specify the delay in milliseconds for more precision:

```bash
nodemon --delay 2500ms server.js
```

Both `--delay 2.5` and `"delay": 2500` in `nodemon.json` are interpreted as milliseconds.

### Example in nodemon.json

```json
{
  "delay": 2500
}
```

This `nodemon.json` configuration delays restart by 2500 milliseconds after changes.

Here's the information on gracefully reloading your script, controlling shutdown, triggering events on nodemon state changes, and piping output:

### Gracefully Reloading Your Script

You can configure nodemon to send a specific signal (`SIGHUP` in this example) to your application, which your application can handle for graceful reloading:

```bash
nodemon --signal SIGHUP server.js
```

Your application can then handle the signal like this:

```javascript
process.on("SIGHUP", function () {
  // Perform tasks like reloading configuration
  reloadSomeConfiguration();

  // Optionally terminate the process
  process.kill(process.pid, "SIGTERM");
});
```

### Controlling Shutdown of Your Script

If you need to clean up when nodemon sends a kill signal to your application (e.g., on file update), you can capture and handle the signal yourself:

```javascript
// Handle SIGUSR2 signal (used by nodemon to restart)
process.on('SIGUSR2', function () {
  gracefulShutdown(function () {
    process.kill(process.pid, 'SIGTERM');
  });
});
```

### Triggering Events on Nodemon State Changes

You can trigger actions based on nodemon state changes by configuring `events` in your `nodemon.json`:

```json
{
  "events": {
    "restart": "osascript -e 'display notification \"app restarted\" with title \"nodemon\"'"
  }
}
```

This example triggers a notification on a Mac whenever nodemon restarts your application.

### Piping Output to Another Location

You can pipe nodemon's output to files instead of the console:

```javascript
const fs = require('fs');
const nodemon = require('nodemon');

nodemon({
  script: 'your-script.js',
  stdout: false // Important: Disable output to console
}).on('readable', function() {
  this.stdout.pipe(fs.createWriteStream('output.txt'));
  this.stderr.pipe(fs.createWriteStream('error.txt'));
});
```

This configuration pipes `stdout` and `stderr` to `output.txt` and `error.txt`, respectively, instead of displaying them in the console.

These configurations allow you to manage nodemon effectively in different scenarios, such as gracefully reloading your application, handling shutdowns, responding to state changes, and managing output destinations. Adjust them according to your specific needs and environment.
