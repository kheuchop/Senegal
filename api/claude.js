export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  
  const keys = Object.keys(process.env).filter(k => !k.includes('SECRET'));
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  
  return res.status(200).json({ hasKey, availableKeys: keys });
}
