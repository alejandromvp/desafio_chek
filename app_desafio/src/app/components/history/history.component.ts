import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_service/app.service';
import { DataService } from 'src/app/_service/data.service';
import { AuthService } from 'src/app/_service/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  date_last_mov: any;
  Movimientos:any;
  elID:any;
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
    this.elID = user_id;
    this.crudService.getMov(this.elID).subscribe({
      next: (resp) => {
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
    this.elID = user_id;
    this.crudService.accountBalance(this.elID).subscribe({
      next: (resp) => {
        const balance = resp[0];
        this.balance = balance[0].usu_saldo;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    });
  }

}
