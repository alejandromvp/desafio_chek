import { Component } from '@angular/core';
import { AuthService } from './_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private roles: string[] = [];
  div?: any;
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;  
  constructor(
    private tokenStorageService: AuthService,
    private ruteador:Router
  ){}

  ngOnInit(): void {
    document.body.classList.add('salmon');

    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.username = user.nombre_usu;
    }else{
      this.ruteador.navigateByUrl('login');
    }
  }

  clicked(event:any) {
    const slides = document.getElementsByClassName('item_menu');
    if (slides != null) {
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        slide.classList.remove('men_selected');
      }
    }
    event.target.classList.add('men_selected'); // To ADD
  }

  logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }
}
