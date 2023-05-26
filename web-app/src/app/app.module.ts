import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const initializeKeycloak = (keycloak: KeycloakService): (() => Promise<boolean>) => {
  return (): Promise<boolean> =>
    keycloak.init({
      config: {
        url: 'https://localhost:8443',
        realm: 'test-realm',
        clientId: 'test-client',
      },
      initOptions: {
        scope: "web-app",
        onLoad: 'login-required',
        checkLoginIframe: false,
      },
      loadUserProfileAtStartUp: true,
      enableBearerInterceptor: true,
      bearerExcludedUrls: [],
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    KeycloakAngularModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
