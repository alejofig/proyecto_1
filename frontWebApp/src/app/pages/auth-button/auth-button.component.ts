import { Component } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-button',
  template: `
    <button class="button" (click)="handleLogin()">{{'login' | translate}}</button>
  `,  standalone: true,
  styleUrls: ['./auth-button.component.scss'], // Ruta al archivo CSS
  imports: [TranslateModule]
})

export class AuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService, private translate: TranslateService) {}
  handleLogin(): void {
    this.auth.loginWithRedirect({
      appState: {
        target: '/panel',
      },
    });
  }
}
