import {Component, OnInit} from '@angular/core';
import {CriptoService} from '../../services/cripto.service';
import {Cripto} from '../../models/cripto.interface';
import { DecimalPipe, CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatTooltip} from '@angular/material/tooltip';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-lista-cripto',
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DecimalPipe,
    CommonModule,
    RouterLink,
    MatButton,
    MatIcon,
  ],
  templateUrl: './lista-cripto.component.html',
  styleUrl: './lista-cripto.component.css'
})
export class ListaCriptoComponent implements OnInit {
  criptos = new MatTableDataSource<Cripto>();
  cargando: boolean = true;

  columnas: string[] = ['image', 'name', 'price', 'change','acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private criptoService: CriptoService){}

  ngOnInit():void{
    this.criptoService.getCriptos().subscribe({
      next: (data) => {
        this.criptos.data = data;
        this.criptos.filterPredicate = (dato,filtro) =>
          dato.name.toLowerCase().includes(filtro) || dato.symbol.toLowerCase().includes(filtro);
        this.criptos.paginator = this.paginator;
        this.cargando = false;
      },
      error: (err => {
        console.error('Error al cargar', err)
        this.cargando = false;
      })
    })
  }

  aplicarFiltro(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.criptos.filter = value.trim().toLowerCase();
  }
}
