import { Routes } from '@angular/router';
import {ListaCriptoComponent} from './pages/lista-cripto/lista-cripto.component';
import {DetalleCriptoComponent} from './pages/detalle-cripto/detalle-cripto.component';

export const routes: Routes = [
  {path:'', component:ListaCriptoComponent},
  {path:'detalle/:id', component: DetalleCriptoComponent}
];
