import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';
import { AppService } from 'src/app/_service/app.service';
import { AuthService } from 'src/app/_service/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormsModule, FormControl, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import {  validate, clean, format, getCheckDigit } from 'rut.js'


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
  submitted:boolean = true;
  constructor(public form:FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private router:Router,
    private crudService: AppService) {
      this.FormContact = this.form.group({
        id_user: 1,
        rut:    new FormControl('', [Validators.required]),
        nombre: new FormControl('', Validators.required),
        correo: new FormControl('', Validators.required),
        telefono: new FormControl('', [Validators.required, Validators.min(111111), Validators.max(999999999999)]),
        banco:    new FormControl('', Validators.required),
        tipo_cuenta:   new FormControl('', Validators.required),
        numero_cuenta: new FormControl('', [Validators.required, Validators.min(1111), Validators.max(9999999999999999)])
      })
     }

     ngOnInit(): void {
      this.fill_array_bank();
      console.log(format('184s853761sdwsds'));
    }

    get formRut(): any {return this.FormContact.get('rut');}
    get formNombre(): any {return this.FormContact.get('nombre');}
    get formCorreo(): any {return this.FormContact.get('correo');}
    get formTelefono(): any {return this.FormContact.get('telefono');}
    get formBanco(): any {return this.FormContact.get('banco');}
    get formTipoCuenta(): any {return this.FormContact.get('tipo_cuenta');}
    get formNumCuenta(): any {return this.FormContact.get('numero_cuenta');}

    get validateRut(): any {return validate(format(this.FormContact.value.rut))}

    fill_array_bank(){
      this.dataService.getBanks().subscribe(bank =>{
        this.bancos = bank.banks;
      })
    }
  
    resetForm(){
      this.formRut.errors.required = false;
      this.formNombre.errors.required = false;
      this.formCorreo.errors.required = false;
      this.formTelefono.errors.required = false;
      this.formBanco.errors.required = false;
      this.formTipoCuenta.errors.required = false;
      this.formNumCuenta.errors.required = false;
    }

    onSubmit(): void {
      const user_id = this.authService.getToken();
      this.FormContact.value.id_user = user_id;
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
              //location.reload(); 
              this.FormContact.reset();
              this.resetForm();
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
  