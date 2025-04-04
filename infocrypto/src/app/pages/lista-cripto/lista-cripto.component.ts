import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CriptoService } from '../../services/cripto.service';
import { Cripto } from '../../models/cripto.interface';
import { DecimalPipe, CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-lista-cripto',
  standalone: true,
  imports: [
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    DecimalPipe,
    CommonModule,
    RouterLink,
    MatButton,
    MatIcon,
    MatCardModule,
    MatIconButton,
  ],
  templateUrl: './lista-cripto.component.html',
  styleUrl: './lista-cripto.component.css'
})
export class ListaCriptoComponent implements OnInit, AfterViewInit {
  criptos = new MatTableDataSource<Cripto>();
  tarjetasFiltradas: Cripto[] = [];
  cargando: boolean = true;
  modoCard: boolean = false;
  columnas: string[] = ['image', 'name', 'price', 'change', 'acciones'];
  tarjetasMostradas: Cripto[] = [];
  batchSize = 20;
  cargandoMasTarjetas = false;
  favoritos:string[] = [];
  buscando: boolean = false;
  esFavoritos: boolean = false;



  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private criptoService: CriptoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerModoGuardado();
    this.esFavoritos = this.route.snapshot.routeConfig?.path === 'favoritos';
    this.cargarFavoritos();
    this.cargarCriptos();
  }

  ngAfterViewInit(): void {
    // Asegura que paginator se aplique tras renderizado completo
    this.asignarPaginatorConDelay();
  }

  aplicarFiltro(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.trim().toLowerCase();

    if(valor){this.buscando = true;}else{this.buscando = false;}
    if (this.modoCard) {
      this.tarjetasFiltradas = this.criptos.data.filter(
        cripto =>
          cripto.name.toLowerCase().includes(valor) ||
          cripto.symbol.toLowerCase().includes(valor)
      );
    } else {
      this.criptos.filter = valor;
    }
  }

  alternarVista(): void {
    this.modoCard = !this.modoCard;
    localStorage.setItem('modoTarjetas', this.modoCard.toString());

    // Reasignar paginador si se cambia a modo tabla
    if (!this.modoCard) {
      this.asignarPaginatorConDelay();
    }
  }

  // ----------------------
  // 🔧 Funciones auxiliares
  // ----------------------

  private obtenerModoGuardado(): void {
    const guardado = localStorage.getItem('modoTarjetas');
    if (guardado !== null) {
      this.modoCard = guardado === 'true';
    }
  }

  private cargarCriptos(): void {
    this.criptoService.getCriptos().subscribe({
      next: (data) => {
        if (this.esFavoritos){
          data = data.filter(cripto => this.favoritos.includes(cripto.id));
        }
        this.criptos.data = data;
        this.tarjetasFiltradas = data;
        this.tarjetasMostradas = this.tarjetasFiltradas.slice(0, this.batchSize);

        this.criptos.filterPredicate = (dato, filtro) =>
          dato.name.toLowerCase().includes(filtro) ||
          dato.symbol.toLowerCase().includes(filtro);

        this.cargando = false;

        // Si ya estamos en modo tabla y el paginator está en el DOM, asignarlo
        if (!this.modoCard) {
          this.asignarPaginatorConDelay();
        }
      },
      error: (err) => {
        console.error('Error al cargar', err);
        this.cargando = false;
      }
    });
  }

  private asignarPaginatorConDelay(): void {
    setTimeout(() => {
      if (this.paginator) {
        this.criptos.paginator = this.paginator;
      }
    }, 0);
  }

  cargarMasTarjetas(): void {
    if (this.cargandoMasTarjetas) return;

    this.cargandoMasTarjetas = true;

    setTimeout(() => {
      const cantidadActual = this.tarjetasMostradas.length;
      const siguienteBloque = this.tarjetasFiltradas.slice(
        cantidadActual,
        cantidadActual + this.batchSize
      );
      this.tarjetasMostradas = [...this.tarjetasMostradas, ...siguienteBloque];
      this.cargandoMasTarjetas = false;
    }, 800); // pequeño retraso para evitar múltiples disparos
  }

  onScroll(): void {
    if (!this.modoCard) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    const umbral = 100; // px antes del fondo
    const estaCercaDelFondo = scrollTop + windowHeight + umbral >= documentHeight;

    if (estaCercaDelFondo) {
      this.cargarMasTarjetas();
    }
  }

  cargarFavoritos(): void {
    const favs = localStorage.getItem('favoritos');
    this.favoritos = favs? JSON.parse(favs) : [];
  }

  guardarFavoritos(): void{
    localStorage.setItem('favoritos', JSON.stringify(this.favoritos));
  }

  esFavorito(id:string): boolean {
    return this.favoritos.includes(id)
  }

  alternarFavorito(id:string): void {
    if (this.favoritos.includes(id)) {
      this.favoritos = this.favoritos.filter(fav => fav !== id);
    } else {
      this.favoritos.push(id);
    }
    this.guardarFavoritos();
  }

}
