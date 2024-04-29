import { Component } from '@angular/core';
import { SidebardComponent } from '../../../shared/components/sidebard/sidebard.component';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ApiGatewayBackendService } from '../../../apigateway-backend.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mototaller',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent,FormsModule,CommonModule],
  templateUrl: './mototaller.component.html',
  styleUrl: './mototaller.component.scss'
})
export class MototallerComponent {
  public solicitudCorrecta: boolean = false;
  public motoTallerData:any = {}
  constructor(private apiGatewayBackendService: ApiGatewayBackendService) {
  }

  public registrarServicio(): void {
    console.log('Data:', this.motoTallerData);
    this.apiGatewayBackendService.registrarMototaller(this.motoTallerData).subscribe((response: any) => {
      console.log('Response:', response);
      this.solicitudCorrecta = true;
    });
}
}
