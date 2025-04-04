import {Component, OnInit} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {ListaCriptoComponent} from './pages/lista-cripto/lista-cripto.component';
import {MatAnchor, MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatToolbar} from '@angular/material/toolbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ListaCriptoComponent, MatButton, MatAnchor, RouterLink, MatIcon, MatTooltipModule, MatIconButton, MatToolbar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'infocrypto';
  modoOscuro: boolean = false;



  ngOnInit() {
    const guardado = localStorage.getItem('modoOscuro') === 'true';
    this.modoOscuro = guardado;
    document.body.classList.toggle('dark-theme', this.modoOscuro);
  }

  alternarTema() {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('dark-theme', this.modoOscuro);
    localStorage.setItem('modoOscuro', this.modoOscuro.toString());
  }
}
