import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/_service/app.service';
import { DataService } from 'src/app/_service/data.service';
import { FormGroup, FormBuilder, FormsModule, FormControl, Validators } from '@angular/forms';
import { Observable} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { Select2OptionData } from 'ng-select2';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

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
    id_user: 1,
    des_id:'',
    mov_monto: '',
    saldo_restante: ''
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
    private ruteador:Router
  ){
    this.FormTranf = this.form.group({
    destinatario: new FormControl('', Validators.required),
    monto_transf:   new FormControl('', Validators.required),
    }) 
  }

  get formDestinatario(): any {return this.FormTranf.get('destinatario');}
  get formMonto(): any {return this.FormTranf.get('monto_transf');}

 ngOnInit(): void {
   this.getContacts();
   this.fill_array_bank();
   this.getAccountBalance();
 }

 MontoElevado(){
   Swal.fire({
     icon: 'error',
     title: 'Oops...',
     text: 'transferencia supera el monto, porfavor intente con un monto mas bajo',
     confirmButtonText: 'Aceptar'
   })
 }

 realizarTransferencia(){
   //console.log(this.data_transferencia);
   this.crudService.transfer(this.data_transferencia).subscribe();
 }

 PedirPassword(){
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
     if(result.value.password == '123'){
       this.realizarTransferencia();
       Swal.fire({
         title: '',
         text: "Transferencia realizada con exito",
         icon: 'success',
         showCancelButton: false,
         confirmButtonColor: '#3085d6',
         confirmButtonText: 'aceptar'
       }).then((result) => {
         if (result.isConfirmed) {
           location.reload(); 
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
     this.PedirPassword();
   }else{
     this.MontoElevado();
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
   this.elID = 1;
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
   this.elID = 1;
   this.crudService.accountBalance(this.elID).subscribe({
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

}
