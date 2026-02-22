import { kv } from '@vercel/kv';

const VALID_CODES = new Set(['SC089ZO3','SC0CHDO3','SC0CURO1','SC0MYL14','SC1E5XU4','SC1HNGVH','SC1NVWGI','SC1XLKHR','SC20O3TQ','SC2J6953','SC32GJZ2','SC3BZ8AK','SC3V4M0F','SC3YKDNA','SC4A2DAC','SC4F2NG3','SC4WNK8Y','SC5225YO','SC5KC89O','SC5SDE47','SC5XCOER','SC6FJKXL','SC6JKEPH','SC6M8RCC','SC6Q718W','SC6S48EH','SC73B910','SC7B2SSN','SC7NZJAM','SC8SVDOM','SC9CZC56','SC9ZPTYX','SCA6FGS3','SCABT7FM','SCASOF4L','SCB4S571','SCB6LETC','SCBSEZOX','SCBUQ3TO','SCBX5379','SCBYFPDA','SCC416LC','SCCEZPBB','SCD498R6','SCDBZVQT','SCDQ9E45','SCE765DO','SCEFLEAH','SCEO7JWG','SCFFV32D','SCFTA7GL','SCG8GZ9G','SCGKAB4X','SCGSJRO2','SCH5CW1Q','SCHEQ9J3','SCHFZX69','SCHRSYXJ','SCI1QB6U','SCIF7R76','SCIN9CAB','SCIX6Z0G','SCJBMAPF','SCJI0EWH','SCJJ7UVZ','SCJP5XVN','SCJQWHDV','SCJYMKZ8','SCK7KN4A','SCKHZUP3','SCKNUA08','SCKVHXDM','SCKZBX5G','SCLF3S8T','SCN92V0X','SCNOBFW7','SCO6558F','SCOVR040','SCPCM1RD','SCPG059Q','SCPHQ863','SCQCT6IB','SCTB7NR1','SCTERV5J','SCTRQWWD','SCTSLQNT','SCTWL2JT','SCU4DX79','SCUZNQMO','SCVSJKBD','SCWI3RNI','SCWLH2U8','SCWMNBDA','SCXKYJJ4','SCXXJAMP','SCXZSSNQ','SCYILY9E','SCYOSURA','SCZ7AU2F','SCZVWB6G']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code, deviceId } = req.body;
  if (!code || !deviceId) return res.status(400).json({ ok: false, msg: '请输入密码' });

  const upperCode = code.trim().toUpperCase();

  if (!VALID_CODES.has(upperCode)) {
    return res.json({ ok: false, msg: '密码无效，请检查后重试' });
  }

  const key = `code:${upperCode}`;
  const stored = await kv.get(key);

  if (!stored) {
    await kv.set(key, { deviceId, usedAt: Date.now() });
    return res.json({ ok: true, msg: '激活成功' });
  }

  if (stored.deviceId === deviceId) {
    return res.json({ ok: true, msg: '验证成功' });
  }

  return res.json({ ok: false, msg: '该密码已在其他设备使用' });
}
