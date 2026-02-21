import { kv } from '@vercel/kv';

const VALID_CODES = new Set(['SC070GUT','SC0DJTWN','SC0DUU1V','SC0FFHAR','SC0J7KJJ','SC0NVJRU','SC0RVYMI','SC0WV9EV','SC0XHAC1','SC0ZDGFC','SC271EGB','SC2QV3D1','SC3XFERG','SC3XRDQW','SC4H7NXO','SC4OIYTO','SC4XO0ZT','SC67N3JK','SC67W4YX','SC6H2INM','SC7044NN','SC7Y16EE','SC7ZOTH8','SC828SOP','SC8C6MVZ','SC8GB9FC','SC9TAHQ8','SC9WECKU','SCA5B2FM','SCAJNS7E','SCAJSS8M','SCB0ONYD','SCBF7P2F','SCC0Y7F6','SCC5DH0T','SCCC97SI','SCCHJC5F','SCD6JC1E','SCDV2IST','SCDVNGSG','SCDYPOUV','SCEIQOX6','SCEK2S1D','SCEM3RZ7','SCF82F4A','SCFS2UDR','SCGLOMZ2','SCHNGIGR','SCHR8BJD','SCIRJJNM','SCJ3ZMSO','SCJBPI4J','SCJBZXBP','SCJHXDYI','SCJOVNT5','SCJSOYEU','SCJTGA43','SCK3M5DN','SCKARY95','SCKDMZ1X','SCKOQS48','SCLS921G','SCLWW7HW','SCLZ2HWC','SCM4PGT8','SCM5Q6QO','SCM6P2OV','SCM88NB2','SCM9FV63','SCMB9Q17','SCMPFPIZ','SCN6DMHV','SCN83S5B','SCNCU5ZE','SCP7KEBQ','SCPZ5URV','SCQQ04VD','SCQTYCTN','SCRDJZNC','SCRFVDOT','SCRJ5UU3','SCRQ9WYO','SCRRYHDQ','SCSBHY11','SCSIQVWN','SCSYHMY5','SCT1D1YX','SCT3GWPG','SCU17OD4','SCUFO60X','SCUNO4PP','SCVNP06Y','SCW3DHVO','SCWBZARN','SCWKR7JU','SCXR1A6J','SCXVQ47H','SCYKZTL9','SCYUNUY7','SCZ2C0Q2']);

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
