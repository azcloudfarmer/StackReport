import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, App } from 'ionic-angular';
import { User } from '../../models/user';
import { AuthService } from '../../services/main';

import { HomePage, RegionalfundsPage, UserPage, TopFundsPage, LoginPage } from '../main';


@Component({
  selector: 'menu',
  templateUrl: 'menu.html'
})

export class MenuPage {
  @ViewChild(Nav) nav: Nav;

  user:User;
  hidden:string;
  authService:AuthService;
  app:App;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, authService:AuthService, app:App) {

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage }, 
      { title: 'Top Mutual Funds', component: TopFundsPage },
      { title: 'Funds By Region', component: RegionalfundsPage },
      { title: 'My account', component: UserPage },
    ];
    this.authService = authService;
    this.app = app;
}

back(){
  if(this.nav.canGoBack())
    this.nav.pop();
}

openPage(page) {
  this.nav.setRoot(page.component);
}

logout() {
    this.authService.logout();
    this.app.getRootNav().setRoot(LoginPage);
}

}
