<p align="center">
  <img src="assets/logo.png" alt="Vanitylab" width="112" />
</p>

<h1 align="center">Vanitylab</h1>
<p align="center"><strong>Create a custom Solana address.</strong><br />Generated on your device. Your private key belongs only to you.</p>
<p align="center"><a href="https://t.me/Vanitylab_bot">Open on Telegram ↗</a></p>

---

## Make your address stand out

A little `777` at the end. Your initials at the beginning. Something that feels like you.

Vanitylab searches for a Solana wallet with **3–5 characters of your choice** at the beginning or end of its address. Open the Mini App inside Telegram, choose your pattern and let your device do the work.

**No SOL needed. No wallet connection. No private key sent to the bot.**

## From pattern to wallet

1. Open [@Vanitylab_bot](https://t.me/Vanitylab_bot) and tap **Create Wallet**.
2. Enter your pattern and choose **beginning** or **ending**.
3. Pick **Flexible** to allow different letter cases, or **Exact** to keep your capitalization.
4. Start the search and keep the Mini App open.
5. Copy your public key, reveal your private key and save a protected backup.

You can also copy both keys as one neatly formatted message. **That message contains your private key. Keep it private.**

### How long does it take?

More characters usually mean more waiting. Your device, the pattern and luck all play a part. Flexible matching can shorten the search by accepting more results.

Start with **3 characters**. Five can take a long time, especially on a phone. There is no guaranteed finish time.

### What can I type?

Solana addresses do not use `0`, `O`, `I` or `l`. Vanitylab previews letter corrections such as `O → o` before you generate. Spaces and symbols are not supported.

## Your keys stay on your device

Wallets are generated locally with the browser’s cryptographic tools. The bot and our servers do not receive or store private keys. There is no automatic backup or account recovery.

**Save your private key before closing.** Anyone who gets that key can control the wallet. Copying it also puts it on your device’s clipboard.

The code is public so you can inspect it and run your own copy. Device security and the integrity of the code you load still matter. This project has not undergone an independent security audit.

## Run your own copy

Requires **Node.js 22 or newer**. No npm packages to install.

### Mini App on your computer

```sh
npm start
```

Open **http://localhost:3000** in a recent browser with Ed25519 support.

### Connect your Telegram bot

Copy `.env.example` to `.env` and fill in:

```dotenv
BOT_TOKEN=your_botfather_token
MINI_APP_URL=https://your-mini-app.example
SOURCE_URL=https://github.com/your-account/vanitylab
```

Then run:

```sh
npm run bot
```

This sets up the bot description, command menu and navigation. The Mini App needs a working HTTPS host. **Publishing this repository on GitHub alone does not keep the bot online.** The bot process must also run on a host.

For the Windows development tunnel, `npm run telegram` starts the local app and bot using a temporary HTTPS URL. It requires the official Cloudflare `cloudflared.exe` at `.tools/cloudflared.exe`; that binary is not included in the repository. Keep only one bot instance running at a time.

### Check the code

```sh
npm run check
```

This checks JavaScript syntax. Test generation and key handling in your target Telegram clients before a public launch.

## Keep secrets out of GitHub

Commit `.env.example`, **never `.env`**. The included `.gitignore` excludes `.env`, local tools and dependencies. When uploading through the GitHub website, leave those files out manually.

---

<p align="center">Custom address. Local generation. Your wallet.</p>
