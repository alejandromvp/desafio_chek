import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';
import { AppService } from 'src/app/_service/app.service';
import { AuthService } from 'src/app/_service/auth.service';
import { FormGroup, FormBuilder, FormsModule, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-contact',
  templateUrl: './new-contact.component.html',
  styleUrls: ['./new-contact.component.css']
})
export class NewContactComponent implements OnInit {
  FormContact:FormGroup;
  obj:any;
  bancos:any;
  emps: any = []; 
  constructor(public form:FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private crudService: AppService) {
      this.FormContact = this.form.group({
        id_user: 1,
        rut:    new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]),
        nombre: new FormControl('', Validators.required),
        correo: new FormControl('', Validators.required),
        telefono: new FormControl('', [Validators.required, Validators.min(111111), Validators.max(999999999999)]),
        banco:    new FormControl('', Validators.required),
        tipo_cuenta:   new FormControl('', Validators.required),
        numero_cuenta: new FormControl('', [Validators.required, Validators.min(1111), Validators.max(9999999999999999)])
      })
     }

     ngOnInit(): void {
      this.fill_array_bank()
    }

    get formRut(): any {return this.FormContact.get('rut');}
    get formNombre(): any {return this.FormContact.get('nombre');}
    get formCorreo(): any {return this.FormContact.get('correo');}
    get formTelefono(): any {return this.FormContact.get('telefono');}
    get formBanco(): any {return this.FormContact.get('banco');}
    get formTipoCuenta(): any {return this.FormContact.get('tipo_cuenta');}
    get formNumCuenta(): any {return this.FormContact.get('numero_cuenta');}

    fill_array_bank(){
      this.dataService.getBanks().subscribe(bank =>{
        this.bancos = bank.banks;
      })
    }

    onSubmit(): void {
      const user_id = this.authService.getToken();
      this.FormContact.value.id_user = user_id;
      console.log(this.FormContact.value);
      this.crudService.AddContact(this.FormContact.value).subscribe({
        next: (resp) => {
          Swal.fire({
            title: '',
            text: "Contacto agregado exitosamente",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'aceptar'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload(); 
            }
          })
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          //console.log('done');
        }
     })
   }
  
  
  }
  