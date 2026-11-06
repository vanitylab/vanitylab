function createBot(env){
const {BOT_TOKEN,MINI_APP_URL,SOURCE_URL}=env;
async function api(method,data){const response=await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!result.ok)throw Error('Telegram request failed: '+result.description);return result.result;}
const cb=(text,callback_data)=>({text,callback_data});
const back=[cb('‹ Main Menu','home')];
function screen(page){
if(page==='create'&&!MINI_APP_URL)return {text:'✨ Create a Vanity Wallet\n\nWallet generation is being set up. Please try again soon.',reply_markup:{inline_keyboard:[back]}};
if(page==='create')return {text:'✨ Create a Custom Solana Address\n\nChoose up to 5 characters at the beginning or end. More characters can take longer.\n\nYour wallet is generated on your device.',reply_markup:{inline_keyboard:[[{text:'✨ Create Wallet',web_app:{url:MINI_APP_URL}}],back]}};
if(page==='matching')return {text:'🔤 Matching\n\nExact: preserve your chosen capitalization.\nFlexible: accept valid uppercase and lowercase variations.\n\nSolana excludes 0, O, I and l. The app previews compatible letter corrections before generation.\n\nLonger patterns can take much longer. Searching is random.',reply_markup:{inline_keyboard:[[cb('‹ Create Wallet','create')],back]}};
if(page==='keys'||page==='wallets')return {text:'👛 Your Wallets\n\nYour wallet is generated locally on your device. Your private key belongs only to you.\n\nAfter generation, view your public key, reveal your private key, or copy both inside the Mini App.\n\nSave your private key somewhere safe before closing. Wallets are not saved automatically.',reply_markup:{inline_keyboard:[[cb('Create Wallet','create')],back]}};
if(page==='faq')return {text:'❓ Frequently Asked Questions\n\nWhat is a vanity wallet?\nA Solana wallet whose address begins or ends with your chosen pattern.\n\nHow long does generation take?\nIt depends on your device, pattern and chance. Longer patterns take more work.\n\nDo I need SOL?\nNo. Generating a keypair is free and offline-capable after loading the app.\n\nCan the bot recover my key?\nNo. Export and protect your own backup.',reply_markup:{inline_keyboard:[[cb('Matching Guide','matching'),cb('Key Security','security')],back]}};
if(page==='help')return {text:'📖 How It Works\n\n1. Select Create Wallet to open the Mini App.\n2. Enter your pattern.\n3. Choose beginning or ending.\n4. Keep it open while your device searches.\n5. Export and back up your wallet.\n\nThe Mini App runs within Telegram. The chat only handles navigation.',reply_markup:{inline_keyboard:[[cb('Matching Guide','matching'),cb('Key Security','security')],back]}};
if(page==='security')return {text:'🔐 Security\n\nGeneration runs locally in the Mini App. No private key is sent to the bot or server. No automatic key storage.\n\nSave and verify your backup before funding a wallet.',reply_markup:{inline_keyboard:[back]}};
const rows=[[cb('✨ Create Wallet','create')],[cb('👛 Wallets','wallets'),cb('❓ FAQ','faq')],[cb('🛡 Security','security')]];
if(SOURCE_URL&&!SOURCE_URL.includes('YOUR_USERNAME'))rows.push([{text:'💻 Source Code',url:SOURCE_URL}]);
return {text:'Vanitylab\nCreate a custom Solana address.\n\nCreate a custom Solana address. Choose a beginning or ending and generate your wallet on your own device.\n\nExplore the options below ↓',reply_markup:{inline_keyboard:rows}};
}

return {api,screen,async setup(){
await api('setMyDescription',{description:"✨ Vanitylab — Create a custom Solana address.\n\n🎨 Choose up to 5 custom characters at the beginning or end.\n\n⏳ More characters take longer. The wait depends on your device and luck.\n\n🔐 Your private key is generated locally on YOUR device. It belongs ONLY to you. Neither this bot nor our servers receive or store it. Keep it private and save your backup.\n\n👇 Tap Start to create your wallet."});
await api('setMyCommands',{commands:[{command:'start',description:'Open main menu'},{command:'create',description:'Create a vanity wallet'},{command:'wallets',description:'Wallet exports and key management'},{command:'faq',description:'Frequently asked questions'},{command:'security',description:'How your keys are handled'},{command:'help',description:'How to use Vanitylab'}]});
await api('setChatMenuButton',{menu_button:{type:'commands'}});
}};
}
export default {
async fetch(request,env){
const url=new URL(request.url);
if(url.pathname!=='/telegram'||request.method!=='POST')return new Response('Vanitylab bot is online.',{status:200});
if(!env.WEBHOOK_SECRET||request.headers.get('X-Telegram-Bot-Api-Secret-Token')!==env.WEBHOOK_SECRET)return new Response('Forbidden',{status:403});
try{
const update=await request.json();const {api,screen}=createBot(env);const q=update.callback_query;
if(q){await api('answerCallbackQuery',{callback_query_id:q.id});if(q.message?.chat.type==='private'){try{await api('editMessageText',{chat_id:q.message.chat.id,message_id:q.message.message_id,...screen(q.data)});}catch(e){if(!String(e.message).includes('message is not modified'))throw e;}}}
else {const m=update.message;if(m?.chat.type==='private'){const command=(m.text||'').match(/^\/(start|create|wallets|faq|fac|security|help)(?:@\w+)?(?:\s|$)/)?.[1];if(command)await api('sendMessage',{chat_id:m.chat.id,...screen(command==='start'?'home':command==='fac'?'faq':command)});}}
return new Response('OK');
}catch{return new Response('Retry later',{status:500});}
}
};
export {createBot};
