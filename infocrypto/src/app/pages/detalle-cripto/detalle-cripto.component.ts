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
import {MatCard, MatCardContent, MatCardTitle} from '@angular/material/card';


@Component({
  selector: 'app-detalle-cripto',
  imports: [CommonModule, MatButtonModule, RouterLink, BaseChartDirective, MatProgressSpinner, MatCard, MatCardTitle, MatCardContent,],
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
    scales: {
      x: {
        ticks: {
          color: '#42A5F5',
          font: {
            size: 15,
            weight: 'bold',
          }
        }
      },
      y: {
        ticks: {
          color: '#66BB6A',
          font: {
            size: 15,
            weight: 'bold',
          }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#FF7043'
        }
      }
    }
  };

  lineChartLegend = false;
  rangoSeleccionado:string = '7'
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;


  constructor(
    private criptoService: CriptoService,
    private route: ActivatedRoute,
    private location: Location,
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

    this.criptoService.getHistorialPrecios(this.id, rango).subscribe((res: CriptoGrafica) => {
      const { labels, data } = this.formatearDatos(res.prices, rango);

      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = data;

      this.chart?.update(); // fuerza render del gráfico
      this.cargando = false;
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

  private formatearDatos(prices: number[][], rango:string): {labels:string[], data:number[],}{
    const labels: string[] = [];
    const data: number[] = [];

    if(rango === '1') {
      for (let price of prices){
        const fecha = new Date(price[0]);
        labels.push(`${fecha.getHours().toString().padStart(2,'0')}h`)
        data.push(price[1])
      }
    }else if (rango === '7' || rango === '30'){
      for (let price of prices){
        const fecha = new Date(price[0]);
        labels.push(`${fecha.getDate()}/${fecha.getMonth() + 1}`);
        data.push(price[1]);
      }
  }else if (rango === '365') {
      for (let price of prices) {
        const fecha = new Date(price[0]);
        labels.push(`${fecha.getDate()}/${fecha.getMonth() + 1}`);
        data.push(price[1]);
      }
    }
    return { labels, data };
  }

  volver() : void {
    this.location.back();
  }

}
