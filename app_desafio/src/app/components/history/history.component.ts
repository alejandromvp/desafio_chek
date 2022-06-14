import { Component, OnInit, Inject } from '@angular/core';
import { AppService } from 'src/app/_service/app.service';
import { DataService } from 'src/app/_service/data.service';
import { AuthService } from 'src/app/_service/auth.service';
import * as moment from 'moment';
import {formatNumber} from '@angular/common';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  date_last_mov: any;
  Movimientos:any;
  Banks:any = [];
  balance:any;
  detail_count:any[] = [
    {id: 1,text: 'Cuenta corriente'},
    {id: 2,text: 'Cuenta Vista'},
    {id: 3,text: 'Cuenta de ahorro'},
  ];
  constructor(private crudService: AppService,
              private dataService: DataService,
              private authService: AuthService) { }

  ngOnInit() {
    this.get_date_current();
    this.get_mov();
    this.fill_array_bank();
    this.getAccountBalance();
  }

  get_date_current(){
    this.date_last_mov = Date.now();
    const hoy = new Date(this.date_last_mov);
    this.date_last_mov = hoy.getDate()+'-'+(hoy.getMonth() + 1)+'-'+hoy.getFullYear();
  }

  fill_array_bank(){
    this.dataService.getBanks().subscribe({
      next: (resp) => {
        this.Banks = resp.banks;
        const mov = this.Movimientos;
        for (let elemento in mov) { 
          const bank = this.Banks.filter((obj:any) => {return obj.id == mov[elemento].des_id_banco});
          const detailcountBank = this.detail_count.filter((obj:any) => {return obj.id == mov[elemento].des_tipo_cuenta});
          mov[elemento].detalle_banco = bank[0].name;
          mov[elemento].tipo_cuenta = detailcountBank[0].text;
          mov[elemento].saldo = this.balance
        }
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    })
  }

  get_mov(){
    const user_id = this.authService.getToken();
    this.crudService.getMov(user_id).subscribe({
      next: (resp) => {
        resp.forEach(function (value:any) {
          const fecha = moment(value.mov_fecha);
          let todayDate = fecha.format('D/M/YYYY');
          value.mov_fecha = todayDate;
        }); 
        this.Movimientos = resp;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    });  
  }

  getAccountBalance(){
    const user_id = this.authService.getToken();
    this.crudService.accountBalance(user_id).subscribe({
      next: (resp) => {
        const balance = resp[0];
        this.balance = balance.usu_saldo;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    });
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
