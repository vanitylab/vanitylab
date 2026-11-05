# Vanitylab

English Telegram bot and local Solana vanity wallet generator. Requires Node.js 22+; no npm dependencies.

## Run locally

Run `npm start` and open http://localhost:3000. Generation uses browser Web Crypto Ed25519 in a dedicated worker. 3–5 characters, beginning/ending, exact/flexible case. Invalid letter case is adapted with a visible preview. Zero and symbols are rejected. Searches are random and browser performance can be much lower than solana-keygen.

## Telegram

Copy `.env.example` to `.env`. Set a BotFather token and your own HTTPS Mini App URL. Run `npm run bot`. The local server binds localhost; production requires a trusted HTTPS reverse proxy/static host. Set BotFather menu button to the HTTPS URL if desired. The bot only handles private /start and /help messages and never receives keys. GitHub URL is optional. No deployment has been configured.

## Key handling

The browser generates Ed25519 pairs. Exports contain the 32-byte secret seed followed by the 32-byte public key, in Solana JSON and Base58 formats. No RPC, remote scripts, telemetry, key database or browser persistence. Worker sends the matching secret only to its own page. Downloads and revealed keys are UNENCRYPTED. Back up in an encrypted vault. No guaranteed memory wipe. Closing loses unexported keys. Existing wallets cannot be recovered by the service.

The server delivers code and cannot prove itself incapable of changing it. Audit and pin releases; run a verified local copy for greater independence. This prototype is not audited. Encrypted export and production hardening remain future work. Do not commit wallet exports or .env.

## Checks

`npm run check` performs syntax checks. Test in your target Telegram WebViews before production. No bot token is included.
