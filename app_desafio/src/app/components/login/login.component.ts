import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import { AppService } from 'src/app/_service/app.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:  ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {
    rut: null,
    password: null
  };

  closeResult: string = '';
  imageSrc: String = 'assets/images/image-welcome.png';
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private authService: AuthService,
    private ruteador:Router,
    private crudService: AppService,
    private modalService: NgbModal) { }

    ngOnInit(): void {
      if (this.authService.getToken()) {
        this.isLoggedIn = true;
        this.ruteador.navigateByUrl('home');
      }
    }

    onSubmit(): void {
      const { rut, password } = this.form;
      this.authService.getUserLogin(this.form).subscribe({
        next: (resp) => {
          if(resp.length == 0){
            console.log('usuario no encontrado');
            this.isLoginFailed = true;
          }else{
            const resp_rut = resp[0].usu_rut;
            const resp_password = resp[0].usu_password;
            const id_usuario = resp[0].usu_id;
            if(rut == resp_rut && password == resp_password){
              this.authService.saveToken(id_usuario);
              this.authService.saveUser(resp[0]);
              this.isLoggedIn = true;
              window.location.reload();
            }else{
              console.log("credenciales incorrectas");
              this.isLoginFailed = true;
            }
          }
        },
        error: (e) => {
          console.log(e);
        },
        complete: () => {
          //console.log('done');
        }
      });
    }
  
    reloadPage(): void {
      window.location.reload();
    }
  
    open(content:any) {
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    } 
  
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }
  
  }
