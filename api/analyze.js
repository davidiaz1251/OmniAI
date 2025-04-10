
module.exports = async function handler(req, res) {
  const buffers = [];

  try {
    for await (const chunk of req) {
      buffers.push(chunk);
    }

    const data = JSON.parse(Buffer.concat(buffers).toString());
    const base64 = data.base64;

    if (!base64) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing base64 data' }));
      return;
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'API key not configured' }));
      return;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-2024-04-09',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Extrae los datos importantes de esta factura o albarán y devuélvelos en JSON con el siguiente formato:
{
  "cliente": "...",
  "numero_factura": "...",
  "direccion": "...",
  "productos": [
    {
      "referencia": "...",
      "nombre": "...",
      "cantidad": ...,
      "precio_unitario": ...,
      "total": ...
    }
  ]
}`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000
      })
    });

    const result = await response.json();
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = response.status;
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error('❌ Error en /api/analyze:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error', detail: error.message }));
  }
};