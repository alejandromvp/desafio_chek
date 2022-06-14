import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_service/app.service';
import { DataService } from 'src/app/_service/data.service';
import { AuthService } from 'src/app/_service/auth.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  Contactos:Select2OptionData[] = [];
  elID:any;
  FormTranf:FormGroup;
  myControl = new FormControl();
  formControl = new FormControl();
  Banks:any = [];
  balance:any;
  data_transferencia:any ={
    id_user: '',
    des_id:'',
    mov_monto: '',
    saldo_restante: '',
    fecha: moment().format('YYYY-MM-DD')
  }
  destinatario: any ={
    nombre: '',
    banco: '',
    correo: '',
    tipo_cuenta: '',
    num_cuenta: ''
  };

  detail_count:any[] = [
    {id: 1,text: 'Cuenta corriente'},
    {id: 2,text: 'Cuenta Vista'},
    {id: 3,text: 'Cuenta de ahorro'},
  ];
  constructor(
    public form:FormBuilder,
    private dataService: DataService,
    private crudService: AppService,
    private authService: AuthService,
  ){
    this.FormTranf = this.form.group({
    destinatario: new FormControl('', Validators.required),
    monto_transf:   new FormControl('', Validators.required),
    }) 
  }

  get formDestinatario(): any {return this.FormTranf.get('destinatario');}
  get formMonto(): any {return this.FormTranf.get('monto_transf');}

  ngOnInit(): void {
    this.chargeUserId();
    this.getContacts();
    this.fill_array_bank();
    this.getAccountBalance();
    //console.log(this.FormTranf);
  }

  chargeUserId(){
    const user_id = this.authService.getToken();
    this.elID = user_id;
  }

  resetForm(){
    this.formDestinatario.errors.required = false;
    this.formMonto.errors.required = false;
    this.destinatario.banco = '';
    this.destinatario.correo = '';
    this.destinatario.tipo_cuenta = '';
    this.destinatario.num_cuenta = '';
    this.destinatario.nombre = '';
  }

  clearForm(){
    this.destinatario.nombre = '';
    this.destinatario.banco = '';
    this.destinatario.correo = '';
    this.destinatario.tipo_cuenta = '';
    this.destinatario.num_cuenta = '';
    this.balance = Number(this.balance) - Number(this.FormTranf.value.monto_transf);
    this.FormTranf.reset();
    //console.log(this.FormTranf);
  }

  highAmount(){
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'transferencia supera el monto, porfavor intente con un monto mas bajo',
      confirmButtonText: 'Aceptar'
    })
  }

  doTransfer(){
    //console.log(this.data_transferencia);
    const user_id = this.authService.getToken();
    this.data_transferencia.id_user = user_id;
    this.crudService.transfer(this.data_transferencia).subscribe({
      next: (resp) => {
       //console.log(resp);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    });
  }

  askPassword(){
    Swal.fire({
      title: 'Contraseña de tu banco replay',
      html: `<input type="password" id="password" class="swal2-input" placeholder="Password">`,
      confirmButtonText: 'Aceptar',
      focusConfirm: false,
      preConfirm: () => {
        const password = ((document.getElementById("password") as HTMLInputElement).value);
        if (!password) {
          Swal.showValidationMessage(`Porfavor ingrese contraseña`)
        }
        return {password: password }
      }
    }).then((result:any) => {
      if(result.value.password == '123456'){
        this.doTransfer();
        Swal.fire({
          title: '',
          text: "Transferencia realizada con exito",
          icon: 'success',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'aceptar'
        }).then((result) => {
          if (result.isConfirmed) {
            //alert("transferencia exitosa");
            //this.clearForm();
            this.getAccountBalance();
            this.FormTranf.reset();
            this.resetForm();
          }
        })
          
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Contraseña incorrecta',
        })
      }
    })
  }

  onSubmit(): void {
    //condicion de que saldo debe ser mayor o igual a transferencia
    if(Number(this.balance) >= Number(this.FormTranf.value.monto_transf)){
      const saldo_restante = (Number(this.balance) - Number(this.FormTranf.value.monto_transf))
      this.data_transferencia.mov_monto = Number(this.FormTranf.value.monto_transf);
      this.data_transferencia.saldo_restante = saldo_restante;
      this.askPassword();
    }else{
      this.highAmount();
    }
  }

  fill_array_bank(){
    this.dataService.getBanks().subscribe({
      next: (resp) => {
        this.Banks = resp.banks;
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    })
  }

  getContacts(){
    this.crudService.getContacts(this.elID).subscribe({
      next: (resp) => {
        this.Contactos = resp;
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
    this.crudService.accountBalance(this.elID).subscribe({
      next: (resp) => {
        const balance = resp[0];
        this.balance = Number(balance.usu_saldo);
      },
      error: (e) => {
        console.log(e);
      },
      complete: () => {
        //console.log('done');
      }
    });
  }

  changed(_evt:any){
    if(_evt != ''){
      this.crudService.getContacto(_evt).subscribe({
        next: (resp) => {
          this.data_transferencia.des_id = _evt;
          const data = resp;
          this.destinatario.nombre = data[0].des_nombre;
          this.destinatario.correo = data[0].des_correo;
          this.destinatario.num_cuenta = data[0].des_num_cuenta;
          const detail_count = this.detail_count.filter((obj:any) => {return obj.id == data[0].des_tipo_cuenta});
          const desc_bank = this.Banks.filter((obj:any) => {return obj.id == data[0].des_id_banco});
          this.destinatario.banco = desc_bank[0].name;
          this.destinatario.tipo_cuenta = detail_count[0].text;
        },
        error: (e) => {
          this.destinatario.nombre = '';
          this.destinatario.correo = '';
          this.destinatario.banco = '';
          this.destinatario.tipo_cuenta = '';
          this.destinatario.num_cuenta = '';
        },
        complete: () => {
          //console.log('done');
        }
      });
    }
  }

  keyPressNumbers(event:any) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
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
