import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cripto} from '../models/cripto.interface';

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
    return this.http.get<Cripto[]>(this.apiUrl, {params: this.params})
  }
}
