import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  //API: String = 'https://gentle-mountain-84308.herokuapp.com/'
   API: String = 'http://localhost:3050/';
  constructor(private clienteHttp:HttpClient) { }

  getMov(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+'consultarMov/'+id);
  }

  AddContact(datosContacto:any):Observable<any>{
    return this.clienteHttp.post(this.API+'insertContacto', datosContacto);
  }

  getContacts(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+'contactos/'+id);
  }

  getContacto(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+'contacto/'+id);
  }

  accountBalance(id:any):Observable<any>{
    return this.clienteHttp.get(this.API+'accountBalance/'+id);
  }

  transfer(datosTransf:any):Observable<any>{
    //const _id = datosTransf.id_user;
    return this.clienteHttp.post(this.API+'insertarMov/', datosTransf);
  }

}
