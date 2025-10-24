# ⏰ x402-time-api

> The **world's first** "pay-per-timestamp" micro-service—powered by the [x402 payment-over-HTTP protocol](https://github.com/coinbase/x402).

---

## 🚀 What?

Buy the **current UTC time** for **0.01 USDC** on Base.  
No registration, no API keys, no monthly plan—just **one on-chain micro-payment** and you get the clock.

---

## 🧠 Why Time?

- Always unique  
- Instantly verifiable  
- 100 % deterministic  

If we can sell **seconds**, we can sell **anything**—embeddings, prompts, GPU cycles—**all via HTTP 402**.

---

## 🔌 Quick Start

### 1. Call the endpoint (free test)
```bash
curl https://x402-time-api.vercel.app/now
```
→ `402 Payment Required` + `x-payment-required` header

### 2. Pay 0.01 USDC on Base
- Parse the header → get receiver & amount  
- Transfer **0.01 USDC** (any wallet)  
- Put **tx hash** into `X-Payment` header and retry

### 3. Enjoy your freshly-bought time
```json
{
  "utc": "2025-06-25T14:30:45.123Z",
  "paidTx": "0xabc..."
}
```

---

## 🛠️ Dev Examples

**Node / TS**
```ts
import { x402fetch } from 'x402-ts-sdk';   // npm i x402-ts-sdk
const res = await x402fetch('https://x402-time-api.vercel.app/now', wallet);
console.log(await res.json());
```

**cURL**
```bash
curl -H "X-Payment: $(echo '{"hash":"0x..."}' | base64)" \
     https://x402-time-api.vercel.app/now
```

---

## 📚 Spec

| Field        | Value               |
|--------------|---------------------|
| Price        | 0.01 USDC           |
| Chain        | Base mainnet        |
| Method       | `X-Payment` header  |
| Status       | 402 if unpaid       |
| Content      | UTC ISO-8601 string |

---

## 🧩 Roadmap

- [ ] Multi-price slots (0.001 / 0.1 USDC)  
- [ ] zk-proof of TLS delivery  
- [ ] Bundle → sell any API the same way

---

## 🤝 Contributing

PRs welcome! The entire service is <100 LOC—easy to read, easy to hack.

---

## ⚠️ Security

**Private keys** are **never** committed.  
Always `.env` + `.gitignore` them.

---

## 📄 License

MIT — sell time, have fun!