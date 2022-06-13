import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  API_BANCOS: String = 'https://bast.dev/api/banks.php'
  constructor(private clienteHttp:HttpClient) { }

  getBanks():Observable<any>{
    return this.clienteHttp.get(this.API_BANCOS+'');
  }
}
