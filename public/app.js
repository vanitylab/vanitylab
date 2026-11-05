const requestedPosition=new URLSearchParams(location.search).get('position');
const $=id=>document.getElementById(id);let worker=null,wallet=null,start=0;
function normalized(){return $('pattern').value.replaceAll('O','o').replaceAll('I','i').replaceAll('l','L');}
function preview(){
const p=normalized(),flex=$('matching').value==='flex',end=$('position').value==='end';
$('count').textContent=p.length+' / 5';
const valid=/^[1-9A-HJ-NP-Za-km-z]{3,5}$/.test(p);
$('preview').textContent=p!==$('pattern').value?'We’ll use '+p+' — some letters needed a case change.':p&&!valid?'Use 3–5 letters or numbers. No 0, spaces or symbols.':'Use 3–5 characters.';
$('position-note').textContent=end?'Your letters go last.':'Your letters go first. The wait can differ from an ending.';
const alphabet='123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';let variants=1;for(const c of p)if(c.toLowerCase()!==c.toUpperCase()&&alphabet.includes(c.toLowerCase())&&alphabet.includes(c.toUpperCase()))variants*=2;
$('case-note').textContent=flex?(valid&&variants===1?'No case variations here, so the speed is the same.':'Allows upper and lowercase. Usually finds a match sooner.'):'Keeps your exact upper and lowercase. May take longer.';
$('effort-level').textContent=valid?p.length+' characters':'';
$('effort-note').textContent=valid&&p.length===5?'5 characters can take a long time. Try 3 or 4 for a shorter wait.':valid&&p.length===4?'4 characters usually take longer than 3. Your device also affects the wait.':'Fewer characters usually mean less waiting. There’s no guaranteed finish time.';

}
if(requestedPosition==='start'||requestedPosition==='end')$('position').value=requestedPosition;
for(const id of ['pattern','position','matching'])$(id).addEventListener('input',preview);preview();
function stop(){if(worker)worker.terminate();worker=null;$('stop').hidden=true;$('generate').disabled=false;}
function clear(){wallet=null;$('secret').value='';$('private-panel').hidden=true;$('reveal').textContent='REVEAL PRIVATE KEY';$('reveal').setAttribute('aria-expanded','false');$('copy-status').textContent='';$('address').textContent='';$('result').hidden=true;}
$('generate').onclick=()=>{const pattern=normalized();if(!/^[1-9A-HJ-NP-Za-km-z]{3,5}$/.test(pattern)){$('status').textContent='Use 3–5 letters or numbers. No 0, spaces or symbols.';return;}const searchPosition=$('position').value;clear();stop();start=performance.now();let count=0;worker=new Worker('/worker.js');$('generate').disabled=true;$('stop').hidden=false;$('status').textContent='Looking for a match… keep this screen open.';worker.onmessage=({data})=>{if(data.type==='progress'){count=data.count;const sec=(performance.now()-start)/1000;$('status').textContent=`${count.toLocaleString()} attempts · ${Math.round(sec)} seconds · ${Math.round(count/sec).toLocaleString()} keys/s`; }else if(data.type==='found'){wallet={...data,pattern,position:searchPosition};stop();$('result').hidden=false;$('address').textContent=data.address;$('status').textContent='Wallet found. Save your private key before closing.';}else if(data.type==='error'){stop();$('status').textContent=data.message;}};worker.onerror=()=>{stop();$('status').textContent='Unable to start the local generator.';};worker.postMessage({pattern,position:searchPosition,flex:$('matching').value==='flex'});};
$('stop').onclick=()=>{stop();$('status').textContent='Search stopped.';};$('clear').onclick=()=>{clear();$('status').textContent='Wallet removed from this page. Browser memory erasure cannot be guaranteed.';};$('reveal').onclick=()=>{if(!wallet)return;const show=$('private-panel').hidden;$('private-panel').hidden=!show;$('secret').value=show?wallet.secret:'';$('reveal').textContent=show?'HIDE PRIVATE KEY':'REVEAL PRIVATE KEY';$('reveal').setAttribute('aria-expanded',String(show));};
async function copyKey(privateKey){if(!wallet)return;try{await navigator.clipboard.writeText(privateKey?wallet.secret:wallet.address);$('copy-status').textContent=privateKey?'Private key copied. Keep your clipboard private.':'Public key copied.';}catch{$('copy-status').textContent='Select the key and copy it manually.';if(privateKey&&!$('private-panel').hidden){$('secret').focus();$('secret').select();}}}
$('copy-public').onclick=()=>copyKey(false);$('copy-private').onclick=()=>copyKey(true);
window.addEventListener('beforeunload',e=>{if(wallet||worker){e.preventDefault();e.returnValue='';}});

$('copy-both').onclick=async()=>{if(!wallet)return;const pattern=wallet.position==='start'?wallet.address.slice(0,wallet.pattern.length):wallet.address.slice(-wallet.pattern.length);const message=`Custom Solana Address (${pattern}):\n\nPublic Key:\n${wallet.address}\n\nPrivate Key:\n${wallet.secret}`;try{await navigator.clipboard.writeText(message);$('copy-status').textContent='Both keys copied. This text contains your private key — keep it secret.';}catch{$('copy-status').textContent='Copy is unavailable here. Select and copy each key manually.';}};
