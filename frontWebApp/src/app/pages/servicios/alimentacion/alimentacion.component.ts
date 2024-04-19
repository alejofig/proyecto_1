import {Component, OnInit} from '@angular/core';
import {SidebardComponent} from '../../../shared/components/sidebard/sidebard.component';
import {HeaderComponent} from '../../../shared/components/header/header.component';
import {RouterLinkWithHref} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {HttpClientModule} from "@angular/common/http";
import {AlimentacionService} from "./alimentacion.service";


@Component({
  selector: 'app-alimentacion',
  standalone: true,
  imports: [SidebardComponent, HeaderComponent, RouterLinkWithHref, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './alimentacion.component.html',
  styleUrl: './alimentacion.component.scss'
})
export class AlimentacionComponent implements OnInit {

  alimentacionForm!: FormGroup;
  public proveedor: string = '';
  public proposito: string = '';
  public tipoAlimentacion: string = '';
  public modoRecibir: string = '';
  public numeroContacto: number = 0;
  public direccionActual: string = '';
  public ciudadActual: string = '';
  public paisActual: string = '';
  public mensajeVirtual: string = 'El servicio se ha generado con éxito y se muestra a continuación:';
  public mensajeDomicilio: string = 'Su orden ha sido recibida con éxito, en breve el proveedor lo contactará para ultimar detalles del domicilio!'
  public planNutricional: string = 'Día 1:\n' +
    '\n' +
    'Desayuno: Avena cocida con leche (puedes usar leche de vaca, almendras o soya), plátano en rodajas y una cucharada de semillas de chía.\n' +
    'Almuerzo: Ensalada de espinacas frescas con tomate cherry, queso feta, nueces y aderezo de aceite de oliva y limón. Acompañar con pechuga de pollo a la plancha.\n' +
    'Merienda: Yogur griego natural con arándanos frescos y una cucharada de almendras picadas.\n' +
    'Cena: Salmón al horno con espárragos y zanahorias asadas. De postre, una pera.\n' +
    'Día 2:\n' +
    '\n' +
    'Desayuno: Tostadas integrales con aguacate en rebanadas y huevos revueltos.\n' +
    'Almuerzo: Lentejas estofadas con verduras (cebolla, zanahoria, pimiento) y una porción de aguacate en cubos.\n' +
    'Merienda: Batido de proteínas con leche de almendras, plátano y una cucharada de mantequilla de maní.\n' +
    'Cena: Ensalada de garbanzos con pepino, pimiento rojo, cebolla morada, cilantro y aderezo de aceite de oliva y vinagre balsámico. Acompañar con pechuga de pavo a la plancha.\n' +
    'Día 3:\n' +
    '\n' +
    'Desayuno: Batido verde con espinacas, plátano, piña y leche de coco.\n' +
    'Almuerzo: Quinoa cocida con vegetales salteados (brócoli, champiñones, cebolla) y filete de salmón a la parrilla.\n' +
    'Merienda: Rodajas de manzana con una cucharada de mantequilla de almendras.\n' +
    'Cena: Tacos de pollo a la mexicana (pollo desmenuzado, tomate, cebolla, cilantro) en tortillas integrales, acompañados de guacamole y salsa fresca.\n' +
    'Día 4:\n' +
    '\n' +
    'Desayuno: Yogur griego natural con granola casera (avena, nueces, almendras, pasas) y frutas frescas (fresas o arándanos).\n' +
    'Almuerzo: Ensalada de quinoa con pepino, aguacate, tomate, aceitunas negras y aderezo de limón y aceite de oliva. Acompañar con filete de pescado a la plancha.\n' +
    'Merienda: Palitos de apio con hummus casero.\n' +
    'Cena: Stir-fry de vegetales (brócoli, zanahorias, pimientos) y tofu con salsa de soja y jengibre, servido sobre arroz integral.\n' +
    'Día 5:\n' +
    '\n' +
    'Desayuno: Tostadas de pan integral con crema de cacahuate y rodajas de plátano.\n' +
    'Almuerzo: Wrap integral con pollo a la parrilla, hojas verdes, tomate, pepino y aguacate. Acompañar con una ensalada de frutas frescas.\n' +
    'Merienda: Batido de proteínas con leche de almendras, espinacas frescas, plátano y una cucharada de semillas de chía.\n' +
    'Cena: Pasta integral con salsa de tomate casera (tomate, cebolla, ajo, albahaca), espinacas y camarones salteados en aceite de oliva.'
  public activarMensajeExitoso: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private alimentacionService: AlimentacionService
  ) {
  }

  ngOnInit() {
    this.alimentacionForm = this.formBuilder.group({
      proveedor: ["", [Validators.required]],
      proposito: ["", [Validators.required]],
      tipoAlimentacion: ["", [Validators.required]],
      modoRecibir: ["", [Validators.required]],
      numeroContacto: [0, [Validators.required]],
      direccionActual: ["", [Validators.required]],
      ciudadActual: ["", [Validators.required]],
      paisActual: ["", [Validators.required]]
    })
  }

  solicitarAlimentacion(): void {
    this.activarMensajeExitoso = true;
    // console.log(this.imprimirDatos())
    //
    // let alimentacion = new Alimentacion(this.proveedor, this.proposito, this.tipoAlimentacion, this.modoRecibir, this.numeroContacto, this.direccionActual, this.ciudadActual, this.paisActual)
    // console.log(alimentacion)
    //
    // this.alimentacionService.solicitarAlimentacion(alimentacion).subscribe((result: any) => {
    //   console.log('Response: ', result)
    //   console.info(this.mensajeDomicilio, result)
    //   this.activarMensajeExitoso = true;
    // })
  }

  imprimirDatos(): any {
    return {
      proveedor: this.proveedor,
      proposito: this.proposito,
      tipoAlimentacion: this.tipoAlimentacion,
      modoRecibir: this.modoRecibir,
      numeroContacto: this.numeroContacto,
      direccionActual: this.direccionActual,
      ciudadActual: this.ciudadActual,
      paisActual: this.paisActual
    }
  }
}
