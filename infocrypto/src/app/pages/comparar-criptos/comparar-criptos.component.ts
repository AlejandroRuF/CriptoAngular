import { Component, OnInit, ViewChild } from '@angular/core';
import { CriptoService } from '../../services/cripto.service';
import { Cripto } from '../../models/cripto.interface';
import { CriptoDetalle } from '../../models/cripto-detalle.interface';
import { CriptoGrafica } from '../../models/cripto-grafica.interface';
import {ChartDataset, ChartOptions} from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import {formatearDatos} from '../../utils/formatear-datos.util';
import {MatButton} from '@angular/material/button';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-comparar-criptos',
  standalone: true,
  templateUrl: './comparar-criptos.component.html',
  styleUrl: './comparar-criptos.component.css',
  imports: [
    CommonModule,
    NgIf,
    NgFor,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButton,
    BaseChartDirective,
  ]
})
export class CompararCriptosComponent implements OnInit {

  criptosDisponibles: Cripto[] = [];
  seleccion1: string = '';
  seleccion2: string = '';
  rangoSeleccionado: string = '30';

  detalle1: CriptoDetalle | null = null;
  detalle2: CriptoDetalle | null = null;

  cargando: boolean = false;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  chartData: {
    labels: string[];
    datasets: ChartDataset<'line'>[];
  } = {
    labels: [],
    datasets: []
  };


  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        display: true
      }
    }
  };

  rangos: { valor: string; texto: string }[] = [
    { valor: '1', texto: '1 Día' },
    { valor: '7', texto: '7 Días' },
    { valor: '30', texto: '30 Días' },
    { valor: '365', texto: '1 Año' }
];

  constructor(private criptoService: CriptoService,private snackBar: MatSnackBar) { }

    ngOnInit(): void {
        this.criptoService.getCriptos().subscribe(data => {
            this.criptosDisponibles = data;
        })
    }


  comparar(): void {
    if (!this.seleccion1 || !this.seleccion2 || this.seleccion1 === this.seleccion2) return;

    this.cargando = true;

    this.criptoService.getDetalleCripto(this.seleccion1).subscribe({
      next: d1 => this.detalle1 = d1,
      error: () => this.mostrarError('Error al cargar detalles de la primera criptomoneda')
    });

    this.criptoService.getDetalleCripto(this.seleccion2).subscribe({
      next: d2 => this.detalle2 = d2,
      error: () => this.mostrarError('Error al cargar detalles de la segunda criptomoneda')
    });

    this.criptoService.getHistorialPrecios(this.seleccion1, this.rangoSeleccionado).subscribe({
      next: g1 => {
        this.criptoService.getHistorialPrecios(this.seleccion2, this.rangoSeleccionado).subscribe({
          next: g2 => {
            const datos1 = formatearDatos(g1.prices, this.rangoSeleccionado);
            const datos2 = formatearDatos(g2.prices, this.rangoSeleccionado);

            this.chartData.labels = datos1.labels;
            this.chartData.datasets = [
              {
                data: datos1.data,
                label: this.detalle1?.name || 'Cripto 1',
                borderColor: '#42a5f5',
                fill: false
              },
              {
                data: datos2.data,
                label: this.detalle2?.name || 'Cripto 2',
                borderColor: '#ef5350',
                fill: false
              }
            ];

            this.chart?.update();
            this.cargando = false;
          },
          error: () => this.mostrarError('Error al cargar gráfico de la segunda criptomoneda')
        });
      },
      error: () => this.mostrarError('Error al cargar gráfico de la primera criptomoneda')
    });
  }

  mostrarError(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-error'],
      verticalPosition: 'top',
    });
    this.cargando = false;
  }


}
