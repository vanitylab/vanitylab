import {spawn} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
const children=[];
const launch=(file,args,options={})=>{const child=spawn(file,args,{windowsHide:true,...options});children.push(child);return child;};
function cleanup(){for(const child of children)child.kill();}
process.on('exit',cleanup);process.on('SIGINT',()=>process.exit(0));process.on('SIGTERM',()=>process.exit(0));
const env=await readFile('.env','utf8');
if(!/^BOT_TOKEN=.+/m.test(env)){console.error('Set BOT_TOKEN in .env first.');process.exit(1);}
const server=launch(process.execPath,['server.mjs'],{stdio:['ignore','pipe','inherit']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('exit',()=>reject(Error('Could not start local server. Stop any existing server first.')));});
console.log('Local Mini App started. Connecting temporary HTTPS tunnel...');
const tunnel=launch('.tools/cloudflared.exe',['tunnel','--url','http://127.0.0.1:3000','--no-autoupdate'],{stdio:['ignore','pipe','pipe']});
try{
const url=await new Promise((resolve,reject)=>{let buffer='';const timer=setTimeout(()=>reject(Error('Tunnel timed out. Check internet connection and retry.')),60000);const parse=data=>{buffer=(buffer+data.toString()).slice(-20000);const match=buffer.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/);if(match){clearTimeout(timer);resolve(match[0]);}};tunnel.stdout.on('data',parse);tunnel.stderr.on('data',parse);tunnel.once('error',reject);tunnel.once('exit',()=>{clearTimeout(timer);reject(Error('Tunnel stopped.'));});});
await writeFile('.env',/^MINI_APP_URL=.*$/m.test(env)?env.replace(/^MINI_APP_URL=.*$/m,'MINI_APP_URL='+url):env+'\nMINI_APP_URL='+url+'\n');
console.log('HTTPS connected: '+url);
console.log('Starting Telegram bot. Keep this window open. Ctrl+C stops this test.');
const bot=launch(process.execPath,['--env-file=.env','bot.mjs'],{stdio:'inherit'});bot.once('exit',code=>process.exit(code||0));
}catch(error){console.error(error.message);process.exit(1);}
