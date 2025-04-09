import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FluidModule } from 'primeng/fluid';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { OpenaiService } from '../../core/services/openai.service';

@Component({
  selector: 'app-upload',
  imports: [FluidModule, ButtonModule, FileUploadModule, FormsModule, CommonModule, MessagesModule, ToastModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss',
  providers: [MessageService],
})
export class UploadComponent {

  constructor(private messageService: MessageService,
    private openaiService: OpenaiService
  ) { }
  resultado: string = '';
  cargando = false;
  
  onUpload(event: any) {
    const files = event.files as File[];
    if (!files || files.length === 0) return;
  
    const file = files[0]; // Tomamos solo el primero por ahora
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // quitar encabezado data:image/jpeg;base64,
      this.enviarAOpenAI(base64);
    };
  
    reader.readAsDataURL(file);
  }

  enviarAOpenAI(base64: string) {
    this.cargando = true;
    this.resultado = 'Analizando imagen...';

    this.openaiService.analizarImagen(base64).subscribe({
      next: (res: any) => {
        this.cargando = false;
        this.resultado = res.choices[0].message.content;
      },
      error: (err) => {
        this.cargando = false;
        this.resultado = 'Error al procesar la imagen.';
        console.error(err);
      }
    });
  }
}
