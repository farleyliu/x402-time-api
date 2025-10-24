import express from 'express';
import cors from 'cors';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const USDC = new ethers.Contract(
  process.env.USDC_ADDR,
  ['function transferFrom(address,address,uint) returns (bool)'],
  new ethers.Wallet(process.env.PRIVATE_KEY, new ethers.JsonRpcProvider('https://mainnet.base.org'))
);

// 1. 首次请求 → 返回 402 + 付款要求
app.get('/now', (req, res) => {
  if (req.headers['x-payment']) return step2(req, res);      // 已带付款头
  const info = {
    amount: '0.01',
    currency: 'USDC',
    chain: 'base',
    receiver: process.env.RECEIVER_ADDR,
    memo: 'time'
  };
  res.set('X-PAYMENT-REQUIRED', Buffer.from(JSON.stringify(info)).toString('base64'));
  return res.status(402).json({ error: 'Payment Required', details: info });
});

// 2. 验证付款 → 返回时间
async function step2(req, res) {
  try {
    const raw = req.headers['x-payment'];
    const tx = JSON.parse(Buffer.from(raw, 'base64').toString());
    // 极简校验：链上确认 > 0 且目标地址正确
    const rc = await USDC.provider.getTransactionReceipt(tx.hash);
    if (!rc || rc.status !== 1) throw new Error('tx failed');
    // 可选：再验 amount、to 地址，这里省略
    return res.json({ utc: new Date().toISOString(), paidTx: tx.hash });
  } catch (e) {
    return res.status(402).json({ error: 'Payment Invalid', msg: e.message });
  }
}

app.get('/', (_, res) => res.redirect('https://github.com/farleyliu/x402-time-api')); // 文档
app.listen(process.env.PORT, () => console.log(`⏰ x402-time-api on :${process.env.PORT}`));