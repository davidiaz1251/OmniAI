import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenaiService extends BaseHttpService {
  private apiKey = environment.openaiApiKey


  constructor(http: HttpClient) {
    super(http);
  }

  analizarImagen(base64: string) {
    const headers = {
      Authorization: `Bearer ${this.apiKey}`
    };

    const body = {
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
    };

    return this.post(environment.urlOpenIA, body,  headers );
  }
}