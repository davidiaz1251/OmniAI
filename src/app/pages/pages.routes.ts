import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { UploadComponent } from './upload/upload.component';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    {path: 'upload', component: UploadComponent},
    { path: '**', redirectTo: '/notfound' }
] as Routes;
