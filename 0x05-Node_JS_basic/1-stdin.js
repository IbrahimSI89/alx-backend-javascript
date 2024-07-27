process.stdout.write('Welcome to Holberton School, what is your name?\n');
process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', (response) => {
  process.stdout.write(`Your name is: ${response}`);
});
process.stdin.on('end', () => {
  process.stdout.write('This important software is now closing\n');
});
