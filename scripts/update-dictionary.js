const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Leer token de GitHub desde variable de entorno (no hardcodear)
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.MY_GH_TOKEN;

const repoRoot = path.resolve(__dirname, '..');
const targetPath = path.join(repoRoot, 'data', 'diccionario.json');

function printUsage() {
  console.log(`Usage: node scripts/update-dictionary.js <exported-json-file> [--push] [--message "Commit message"] [--no-commit]`);
  console.log('');
  console.log('Example:');
  console.log('  node scripts/update-dictionary.js ./diccionario.json --message "Update dictionary" --push');
}

function parseArgs(args) {
  const parsed = { file: null, push: false, commit: true, message: null };
  let i = 0;
  while (i < args.length) {
    const arg = args[i];
    if (!parsed.file && !arg.startsWith('--')) {
      parsed.file = arg;
      i += 1;
      continue;
    }
    switch (arg) {
      case '--push':
        parsed.push = true;
        i += 1;
        break;
      case '--no-commit':
        parsed.commit = false;
        i += 1;
        break;
      case '--message':
      case '-m':
        parsed.message = args[i + 1];
        i += 2;
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        printUsage();
        process.exit(1);
    }
  }
  return parsed;
}

function normalizeEntries(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    return Object.keys(data).map(key => {
      const item = data[key];
      if (!item || typeof item !== 'object') return { termino: key, ...(item || {}) };
      return item.termino ? item : { termino: key, ...item };
    });
  }
  throw new Error('Exported data must be an array or an object map.');
}

function sortEntries(entries) {
  return entries.slice().sort((a, b) => {
    const aTerm = (a.termino || '').toString().trim();
    const bTerm = (b.termino || '').toString().trim();
    return aTerm.localeCompare(bTerm, 'es', { sensitivity: 'base' });
  });
}

function runGitCommand(cmd, options = {}) {
  return execSync(cmd, { cwd: repoRoot, stdio: options.stdio || 'pipe' }).toString('utf8').trim();
}

async function main() {
  const { file, push, commit, message } = parseArgs(process.argv.slice(2));
  if (!file) {
    printUsage();
    process.exit(1);
  }

  const inputFile = path.isAbsolute(file) ? file : path.resolve(process.cwd(), file);
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: file not found: ${inputFile}`);
    process.exit(1);
  }

  const content = fs.readFileSync(inputFile, 'utf8');
  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch (err) {
    console.error('Error parsing JSON from file:', inputFile);
    console.error(err.message);
    process.exit(1);
  }

  const entries = normalizeEntries(parsed);
  if (!entries.every(item => item && typeof item.termino === 'string' && item.termino.trim().length > 0)) {
    console.error('Error: Every entry must include a non-empty "termino" field.');
    process.exit(1);
  }

  const sorted = sortEntries(entries);
  const output = JSON.stringify(sorted, null, 2) + '\n';
  fs.writeFileSync(targetPath, output, 'utf8');
  console.log(`Updated ${path.relative(repoRoot, targetPath)} with ${sorted.length} entries.`);

  if (!commit) {
    console.log('Skipping git commit (--no-commit).');
    return;
  }

  try {
    runGitCommand(`git add ${targetPath}`);
    const commitMsg = message || 'Update diccionario.json from exported dictionary';
    runGitCommand(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`);
    console.log('Committed updated diccionario.json.');
  } catch (err) {
    const output = err.stdout ? err.stdout.toString() : '';
    if (output.includes('nothing to commit')) {
      console.log('No changes to commit.');
    } else {
      console.error('Git commit failed:');
      console.error(err.message);
      process.exit(1);
    }
  }

  if (push) {
    try {
      runGitCommand('git push');
      console.log('Pushed changes to remote.');
    } catch (err) {
      console.error('Git push failed:');
      console.error(err.message);
      process.exit(1);
    }
  } else {
    console.log('Done. Run with --push to push the commit to remote.');
  }
}

main();
