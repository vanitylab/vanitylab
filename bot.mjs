const {BOT_TOKEN,MINI_APP_URL,SOURCE_URL}=process.env;
if(!BOT_TOKEN)throw Error('Configure BOT_TOKEN in .env first.');
if(MINI_APP_URL&&!MINI_APP_URL.startsWith('https://'))throw Error('MINI_APP_URL must use HTTPS.');
async function api(method,data){const response=await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const result=await response.json();if(!result.ok)throw Error('Telegram request failed: '+result.description);return result.result;}
const cb=(text,callback_data)=>({text,callback_data});
const back=[cb('‹ Main Menu','home')];
function screen(page){
if(page==='create'&&!MINI_APP_URL)return {text:'✨ Create a Vanity Wallet\n\nWallet generation is being set up. Please try again soon.',reply_markup:{inline_keyboard:[back]}};
if(page==='create')return {text:'✨ Create a Custom Solana Address\n\nChoose up to 5 characters at the beginning or end. More characters can take longer.\n\nYour wallet is generated on your device.',reply_markup:{inline_keyboard:[[{text:'✨ Create Wallet',web_app:{url:MINI_APP_URL}}],back]}};
if(page==='matching')return {text:'🔤 Matching\n\nExact: preserve your chosen capitalization.\nFlexible: accept valid uppercase and lowercase variations.\n\nSolana excludes 0, O, I and l. The app previews compatible letter corrections before generation.\n\nLonger patterns can take much longer. Searching is random.',reply_markup:{inline_keyboard:[[cb('‹ Create Wallet','create')],back]}};
if(page==='keys'||page==='wallets')return {text:'🔐 Your Keys\n\nPrivate keys are generated on your device. This bot cannot list, store or recover them.\n\nExport the JSON or Base58 private key inside the Mini App before closing it. Exports are unencrypted: keep a protected backup.\n\nNever paste a private key into this chat.',reply_markup:{inline_keyboard:[[cb('Create Wallet','create')],back]}};
if(page==='faq')return {text:'❓ Frequently Asked Questions\n\nWhat is a vanity wallet?\nA Solana wallet whose address begins or ends with your chosen pattern.\n\nHow long does generation take?\nIt depends on your device, pattern and chance. Longer patterns take more work.\n\nDo I need SOL?\nNo. Generating a keypair is free and offline-capable after loading the app.\n\nCan the bot recover my key?\nNo. Export and protect your own backup.',reply_markup:{inline_keyboard:[[cb('Matching Guide','matching'),cb('Key Security','security')],back]}};
if(page==='help')return {text:'📖 How It Works\n\n1. Select Create Wallet to open the Mini App.\n2. Enter your pattern.\n3. Choose beginning or ending.\n4. Keep it open while your device searches.\n5. Export and back up your wallet.\n\nThe Mini App runs within Telegram. The chat only handles navigation.',reply_markup:{inline_keyboard:[[cb('Matching Guide','matching'),cb('Key Security','security')],back]}};
if(page==='security')return {text:'🔐 Security\n\nGeneration runs locally in the Mini App. No private key is sent to the bot or server. No automatic key storage.\n\nA hosted app still depends on the integrity of delivered code and your device. This prototype has not been audited.\n\nSave and verify your backup before funding a wallet.',reply_markup:{inline_keyboard:[back]}};
const rows=[[cb('✨ Create Wallet','create')],[cb('👛 Wallets','wallets'),cb('❓ FAQ','faq')],[cb('🛡 Security','security')]];
if(SOURCE_URL&&!SOURCE_URL.includes('YOUR_USERNAME'))rows.push([{text:'💻 Source Code',url:SOURCE_URL}]);
return {text:'Vanitylab\nCreate a custom Solana address.\n\nCreate a custom Solana address. Choose a beginning or ending and generate your wallet on your own device.\n\nExplore the options below ↓',reply_markup:{inline_keyboard:rows}};
}
await api('setMyDescription',{description:"✨ Vanitylab — Create a custom Solana address.\n\n🎨 Choose up to 5 custom characters at the beginning or end.\n\n⏳ More characters take longer. The wait depends on your device and luck.\n\n🔐 Your private key is generated locally on YOUR device. It belongs ONLY to you. Neither this bot nor our servers receive or store it. Keep it private and save your backup.\n\n👇 Tap Start to create your wallet."});
await api('setMyShortDescription',{short_description:'Custom Solana addresses. Local key generation. Create a custom Solana address.'});
await api('setMyCommands',{commands:[{command:'start',description:'Open main menu'},{command:'create',description:'Create a vanity wallet'},{command:'wallets',description:'Wallet exports and key management'},{command:'faq',description:'Frequently asked questions'},{command:'security',description:'How your keys are handled'},{command:'help',description:'How to use Vanitylab'}]});
await api('setChatMenuButton',{menu_button:{type:'commands'}});
const me=await api('getMe',{});console.log(`Vanitylab ready: https://t.me/${me.username}`);
let offset=0;
while(true){try{for(const update of await api('getUpdates',{offset,timeout:25,allowed_updates:['message','callback_query']})){
offset=update.update_id+1;
const q=update.callback_query;
if(q){await api('answerCallbackQuery',{callback_query_id:q.id});if(q.message?.chat.type!=='private')continue;await api('editMessageText',{chat_id:q.message.chat.id,message_id:q.message.message_id,...screen(q.data)});continue;}
const m=update.message;if(!m||m.chat.type!=='private')continue;
const command=(m.text||'').match(/^\/(start|create|wallets|faq|fac|security|help)(?:@\w+)?(?:\s|$)/)?.[1];if(!command)continue;
await api('sendMessage',{chat_id:m.chat.id,...screen(command==='start'?'home':command==='fac'?'faq':command)});
}}catch{console.error('Telegram request failed. Check your connection and make sure only one bot instance is running. Retrying in 5 seconds.');await new Promise(r=>setTimeout(r,5000));}}
