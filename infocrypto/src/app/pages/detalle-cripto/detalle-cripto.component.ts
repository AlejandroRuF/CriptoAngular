import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset} from 'chart.js';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import { ChartOptions } from 'chart.js';
import {CriptoService} from '../../services/cripto.service';
import {CriptoDetalle} from '../../models/cripto-detalle.interface';
import { CriptoGrafica } from '../../models/cripto-grafica.interface';
import { Location } from '@angular/common';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {formatearDatos} from '../../utils/formatear-datos.util';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-detalle-cripto',
  imports: [CommonModule, MatButtonModule, BaseChartDirective, MatProgressSpinner, MatCard, MatCardTitle, MatCardContent, MatCardHeader,],
  templateUrl: './detalle-cripto.component.html',
  styleUrls: ['./detalle-cripto.component.css']

})
export class DetalleCriptoComponent implements OnInit {
  id: string = '';
  cripto!: CriptoDetalle;
  criptoGrafica!: CriptoGrafica;
  cargando: boolean = true;
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Precio en EUR'
      }
    ]
  };

  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    scales: {
      x: {
        ticks: {
          color: '#9bd892',
          font: {
            size: 12,
            weight: 'bold',
          }
        }
      },
      y1: {
        type: 'linear',
        position: 'left',
        title: { display: true, text: 'Precio (€)' },
        ticks: { color: '#42a5f5' }
      },
      y2: {
        type: 'linear',
        position: 'right',
        title: { display: true, text: 'Capitalización / Volumen (€)' },
        grid: { drawOnChartArea: false },
        ticks: { color: '#ffa726' }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#666'
        }
      }
    }
  };

  lineChartLegend = true;
  rangoSeleccionado:string = '7'
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  constructor(
    private criptoService: CriptoService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar:MatSnackBar
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.id) {
      this.criptoService.getDetalleCripto(this.id).subscribe({
        next: (data: CriptoDetalle) => {
          this.cripto = data;
          this.cargarGrafico(this.rangoSeleccionado);
        },
        error: (err) => {
          console.error('Error al cargar detalles de la cripto:', err);
          this.snackBar.open('Error al cargar los detalles de la cripto', 'Cerrar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      });
    }
  }

  // cargarGrafico(rango: string) {
  //   this.rangoSeleccionado = rango;
  //
  //   this.http.get(`https://api.coingecko.com/api/v3/coins/${this.id}/market_chart?vs_currency=eur&days=${rango}`)
  //     .subscribe((res: any) => {
  //       const { labels, data } = this.formatearDatos(res.prices, rango);
  //
  //       this.lineChartData.labels = labels;
  //       this.lineChartData.datasets[0].data = data;
  //
  //       this.chart?.update(); // 👈 fuerza render del gráfico
  //       this.cargando = false;
  //     });
  // }

  cargarGrafico(rango: string) {
    this.rangoSeleccionado = rango;

    this.criptoService.getHistorialPrecios(this.id, rango).subscribe({
      next:(res: CriptoGrafica) => {
        // const { labels, data } = this.formatearDatos(res.prices, rango);
        const precios =formatearDatos(res.prices, rango);
        const capitalizaciones = formatearDatos(res.market_caps, rango);
        const volumenes = formatearDatos(res.total_volumes,rango);


        this.lineChartData.labels = precios.labels;
        this.lineChartData.datasets = [
          {
            data: precios.data,
            label: 'Precio (€)',
            borderColor: '#42a5f5',
            backgroundColor: 'transparent',
            fill: false,
            yAxisID: 'y1'
          },
          {
            data: capitalizaciones.data,
            label: 'Capitalización (€)',
            borderColor: '#66bb6a',
            backgroundColor: 'transparent',
            fill: false,
            yAxisID: 'y2'
          },
          {
            data: volumenes.data,
            label: 'Volumen 24h (€)',
            borderColor: '#ffa726',
            backgroundColor: 'rgba(255,167,38,0.2)',
            fill: true,
            yAxisID: 'y2'
          }
        ]

        this.chart?.update(); // fuerza render del gráfico
        this.cargando = false;
      },error: (err) => {
        this.cargando = false;
        this.snackBar.open('Error al cargar la gráfica. Inténtalo de nuevo más tarde.', 'Cerrar', {
          duration: 5000,
          panelClass: 'snackbar-error',
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        console.error('Error al cargar gráfico:', err);
      }
    });
  }

  getTextoRango(): string {
    switch (this.rangoSeleccionado) {
      case '1': return 'Precio últimas 24 horas';
      case '7': return 'Precio últimos 7 días';
      case '30': return 'Precio último mes';
      case '365': return 'Precio último año';
      default: return 'Precio histórico';
    }
  }

  volver() : void {
    this.location.back();
  }

}
