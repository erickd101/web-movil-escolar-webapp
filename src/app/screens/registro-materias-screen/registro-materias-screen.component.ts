import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-registro-materias-screen',
  templateUrl: './registro-materias-screen.component.html',
  styleUrls: ['./registro-materias-screen.component.scss']
})
export class RegistroMateriasScreenComponent implements OnInit {

  public tipo: string = "registro-materias";
  public materia: any = {};
  public editar: boolean = false;
  public rol: string = "";
  public idMateria: number = 0;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private materiasService: MateriasService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log("Parámetros recibidos:", params);

      if (params['id']) {
        this.idMateria = Number(params['id']);
        this.editar = true;

        console.log("Modo edición activado:", {
          id: this.idMateria,
          editar: this.editar
        });

        this.obtenerMateriaByID();
      } else {
        console.log("Modo registro nuevo");
        this.editar = false;
        // Verificar que el usuario sea administrador
        this.verificarPermisos();
      }
    });

    // Verificar rol del usuario
    const userGroup = this.facadeService.getUserGroup();
    this.rol = userGroup || '';
  }

  // Función para obtener materia por ID en modo edición
  public obtenerMateriaByID() {
    console.log("INICIANDO obtenerMateriaByID()");
    console.log("ID Materia:", this.idMateria);

    this.materiasService.obtenerMateriaPorID(this.idMateria).subscribe(
      (response: any) => {
        console.log("RESPUESTA DEL BACKEND:", response);

        // Procesar la materia para el formulario
        this.materia = this.materiasService.procesarMateria(response);

        console.log("Materia final para formulario:", this.materia);
      },
      (error: any) => {
        console.log("Error en la petición:", error);
        alert("No se pudo obtener la materia seleccionada");
      }
    );
  }

  // Verificar que el usuario sea administrador
  public verificarPermisos() {
    const userGroup = this.facadeService.getUserGroup();
    if (userGroup !== 'Administrador') {
      alert('Solo los administradores pueden registrar materias');
      this.router.navigate(['/home']);
    }
  }

  // Función para regresar a la pantalla anterior
  public goBack() {
    this.location.back();
  }
}
