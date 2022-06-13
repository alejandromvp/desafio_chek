import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  content?: any;
  isLoggedIn = false;
  elID:any;
  dataUser:any = {
    rut: '',
    saldo: '',
    nombre: '',
    tipo_cuenta: 'Cuenta corriente'
  }
  API: String = 'https://gentle-mountain-84308.herokuapp.com/';
  constructor(
    private authService: AuthService) { }

    ngOnInit(): void {
      this.data_usuario();
      if (this.authService.getToken()) {
        this.isLoggedIn = true;
      }
    }
  
    data_usuario(){
      const user_id = this.authService.getToken();
      this.elID = user_id;
       this.authService.getDataUser(this.elID).subscribe(data =>{
         const dataUser = data[0];
         this.dataUser.rut    =  dataUser.usu_rut;
         this.dataUser.saldo  =  dataUser.usu_saldo;
         this.dataUser.nombre =  dataUser.nombre_usu;
      }) 
    }
  }
  