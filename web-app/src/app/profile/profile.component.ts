import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { faker } from '@faker-js/faker';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isLoggedIn: boolean = false;
  username: string | null = null;
  email: string | null = null;
  name: string | null = null;
  givenName: string | null = null;
  familyName: string | null = null;
  emailVerified: boolean = false;
  profilePictureUrl: string | null = null;

  constructor(private keycloakService: KeycloakService) { }

  async ngOnInit() {
    this.isLoggedIn = await this.keycloakService.isLoggedIn();
    const profile = await this.keycloakService.loadUserProfile();
    this.email = profile?.email || null;
    this.username = this.keycloakService.getUsername();
    
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    if (keycloakInstance?.tokenParsed) {
      this.name = keycloakInstance.tokenParsed['name'];
      this.givenName = keycloakInstance.tokenParsed['given_name'];
      this.familyName = keycloakInstance.tokenParsed['family_name'];
      this.emailVerified = keycloakInstance.tokenParsed['email_verified'];
    }

    // Generate a random avatar image
    this.profilePictureUrl = faker.image.avatar();
  }
}
