import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';
import {Cripto} from '../models/cripto.interface';
import {CriptoGrafica} from '../models/cripto-grafica.interface';
import {cargarDesdeCache, guardarEnCache} from '../utils/cache.util';

@Injectable({
  providedIn: 'root'
})
export class CriptoService {

  private apiUrl = 'https://api.coingecko.com/api/v3/coins/markets'
  private params = {
    vs_currency: 'eur',
    order: 'market_cap_desc',
    per_page: 250,
    page: 1,
    sparkline: false,
  }


  constructor(private http: HttpClient) { }

  getCriptos(): Observable<Cripto[]>{
    const cache = cargarDesdeCache('lista-criptos');
    if (cache){
      return of(cache);
    }
    console.log('lista Consulta web');
    return this.http.get<Cripto[]>(this.apiUrl, {params: this.params})
      .pipe(tap(data => guardarEnCache('lista-criptos', data)));
  }

  getDetalleCripto(id: string): Observable<any> {
    const cache = cargarDesdeCache(`detalle_${id}`);
    if (cache) return of(cache);

    console.log('Detalle Consulta web');
    return this.http.get(`https://api.coingecko.com/api/v3/coins/${id}`, {
      params: {
        localization: 'false',
        tickers: 'false',
        market_data: 'true',
        community_data: 'false',
        developer_data: 'false',
        sparkline: 'false'
      }
    }).pipe(tap(data => guardarEnCache(`detalle_${id}`, data)));
  }

  getHistorialPrecios(id: string, dias: string): Observable<CriptoGrafica> {
    const cacheKey = `grafico_${id}_${dias}`;
    const cache = cargarDesdeCache(cacheKey);
    if (cache) return of(cache);

    console.log('Grafica Consulta web');
    return this.http.get<CriptoGrafica>(`https://api.coingecko.com/api/v3/coins/${id}/market_chart`, {
      params: {
        vs_currency: 'eur',
        days: dias
      }
    }).pipe(tap(data => guardarEnCache(cacheKey,data)));
  }


}
