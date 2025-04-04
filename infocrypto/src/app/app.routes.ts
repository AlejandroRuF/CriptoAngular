import { Routes } from '@angular/router';
import {ListaCriptoComponent} from './pages/lista-cripto/lista-cripto.component';
import {DetalleCriptoComponent} from './pages/detalle-cripto/detalle-cripto.component';

export const routes: Routes = [
  {path:'', component:ListaCriptoComponent},
  {path:'detalle/:id', component: DetalleCriptoComponent},
  { path: 'favoritos', component: ListaCriptoComponent },
  {
    path: 'comparar',
    loadComponent: () =>
      import('./pages/comparar-criptos/comparar-criptos.component').then(m => m.CompararCriptosComponent)
  },
];
