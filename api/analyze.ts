export default async function handler(req: Request): Promise<Response> {
    try {
      const { base64 } = await req.json();
  
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env["OPENAI_API_KEY"]}`,
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
  
      const data = await response.json();
      return new Response(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error('❌ Error en /api/analyze:', error);
      return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
  }