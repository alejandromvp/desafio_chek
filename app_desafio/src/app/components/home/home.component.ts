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
  constructor(
    private authService: AuthService) { }

    ngOnInit(): void {
      this.data_user();
      if (this.authService.getToken()) {
        this.isLoggedIn = true;
      }
    }
  
    data_user(){
      const user_id = this.authService.getToken();
      this.elID = user_id;
       this.authService.getDataUser(this.elID).subscribe(data =>{
         const dataUser = data[0];
         this.dataUser.rut    =  dataUser.usu_rut;
         this.dataUser.saldo  =  this.number_format_js(dataUser.usu_saldo, 0, 0, 0);
         this.dataUser.nombre =  dataUser.nombre_usu;
      }) 
    }

    number_format_js(number:any, decimals:any, dec_point:any, thousands_point:any) {
      if (number == null || !isFinite(number)) {
          throw new TypeError("number is not valid");
      }

      if (!decimals) {
          var len = number.toString().split('.').length;
          decimals = len > 1 ? len : 0;
      }

      if (!dec_point) { dec_point = ','; }
      if (!thousands_point) { thousands_point = '.'; }

      number = parseFloat(number).toFixed(decimals);
      number = number.replace(".", dec_point);
      let splitNum = number.split(dec_point);
      splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
      number = splitNum.join(dec_point);
      return number;
  }
    
}
  