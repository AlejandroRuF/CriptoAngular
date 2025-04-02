import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ListaCriptoComponent} from './pages/lista-cripto/lista-cripto.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaCriptoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'infocrypto';
}
