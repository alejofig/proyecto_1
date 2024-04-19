import { Component } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  template: `
    <button class="button" (click)="auth.loginWithRedirect()">Iniciar Sesión</button>
  `,  standalone: true,
  styleUrls: ['./auth-button.component.scss'] // Ruta al archivo CSS
})

export class AuthButtonComponent {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService) {}
}
