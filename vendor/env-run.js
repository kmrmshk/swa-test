import {spawnSync} from 'child_process';

const args = process.argv.slice(2);
let profile = 'local';

if(args.length > 1) {
    profile = args.shift();
} else {
    console.warn('forced "local" setting');
}

process.env.MODE = profile;
spawnSync('npm', ['run-script', ...args], { shell: true, stdio: 'inherit' });
