import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detalle-cripto',
  imports: [CommonModule],
  templateUrl: './detalle-cripto.component.html',
  styleUrl: './detalle-cripto.component.css'
})
export class DetalleCriptoComponent implements OnInit {
  id: string = '';
  cripto: any;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.http.get(`https://api.coingecko.com/api/v3/coins/${this.id}`)
      .subscribe({
        next: (data)=>{
          this.cripto = data;
          this.cargando = false;
        },
        error: (err)=>{
          console.log('Error al cargar detalles', err);
          this.cargando = false;
        }
      })
  }



}
