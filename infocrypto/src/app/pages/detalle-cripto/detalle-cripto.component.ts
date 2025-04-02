import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { BaseChartDirective } from 'ng2-charts';
import { ChartDataset } from 'chart.js';



@Component({
  selector: 'app-detalle-cripto',
  imports: [CommonModule, MatButtonModule, RouterLink, BaseChartDirective],
  templateUrl: './detalle-cripto.component.html',
  styleUrl: './detalle-cripto.component.css'
})
export class DetalleCriptoComponent implements OnInit {
  id: string = '';
  cripto: any;
  cargando: boolean = true;
  lineChartData: ChartDataset<'line'>[] = [
    {
      data: [],
      label: 'Precio en EUR'
    }
  ];

  lineChartLabels: string[] = [];

  lineChartOptions = { responsive: true };
  lineChartLegend = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';

    // Llamada a la API para info general de la cripto
    this.http.get(`https://api.coingecko.com/api/v3/coins/${this.id}`)
      .subscribe({
        next: (data) => {
          this.cripto = data;

          // Llamada a la API para datos históricos del precio
          this.http.get(`https://api.coingecko.com/api/v3/coins/${this.id}/market_chart?vs_currency=eur&days=7`)
            .subscribe((res: any) => {
              // Precios → solo números
              this.lineChartData[0].data = res.prices.map((p: number[]) => p[1]);

              // Fechas → como "24/3", "25/3", etc.
              this.lineChartLabels = res.prices.map((p: number[]) => {
                const fecha = new Date(p[0]);
                return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
              });
            });

          this.cargando = false;
        },
        error: (err) => {
          console.log('Error al cargar detalles', err);
          this.cargando = false;
        }
      });
  }




}
