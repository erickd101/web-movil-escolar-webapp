import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public esAdministrador: boolean = false;
  public esMaestro: boolean = false;

  public lista_materias: any[] = [];

  // Variables para la tabla
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>(this.lista_materias);
  sortOption: string = 'nrc';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public facadeService: FacadeService,
    private materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();

    // Determinar si es administrador o maestro
    this.esAdministrador = this.rol === 'Administrador';
    this.esMaestro = this.rol === 'Maestro';

    // Configurar columnas según el rol
    this.configurarColumnas();

    // Obtener la lista de materias
    this.obtenerMaterias();
  }

   ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  configurarColumnas(): void {
    // Columnas base para todos
    const columnasBase = [
      'nrc',
      'name',
      'seccion',
      'dias',
      'horario',
      'salon',
      'programa',
      'profesor',
      'creditos'
    ];

    // Si es administrador, agregar columnas de editar y eliminar
    if (this.esAdministrador) {
      this.displayedColumns = [...columnasBase, 'editar', 'eliminar'];
    } else {
      this.displayedColumns = columnasBase;
    }
  }

  public obtenerMaterias(): void {
    this.materiasService.obtenerListaMaterias().subscribe({
      next: (response: any) => {
        console.log("Lista de materias:", response);

        // Procesar cada materia para parsear los días
        this.lista_materias = response.map((materia: any) => {
          return this.materiasService.procesarMateria(materia);
        });

        this.dataSource = new MatTableDataSource<any>(this.lista_materias);
        setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          });
      },
      error: (error: any) => {
        console.error("Error al obtener materias:", error);
        alert("Error al cargar la lista de materias");
      }
    });
  }


  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Filtrar por NRC y nombre
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const nrcMatch = data.nrc.toLowerCase().includes(filter);
      const nombreMatch = data.name.toLowerCase().includes(filter);
      return nrcMatch || nombreMatch;
    };

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Método para ordenar los datos
  public sortData() {
    console.log("Ordenando por:", this.sortOption);

    this.lista_materias.sort((a: any, b: any) => {
      let valueA, valueB;

      switch (this.sortOption) {
        case 'nrc':
          valueA = a.nrc;
          valueB = b.nrc;
          break;
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'seccion':
          valueA = parseInt(a.seccion);
          valueB = parseInt(b.seccion);
          break;
        default:
          valueA = a.nrc;
          valueB = b.nrc;
      }

      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    });

    this.dataSource.data = this.lista_materias;
  }

  // Método para ir a editar materia
  public goEditar(idMateria: number) {
    if (!this.esAdministrador) {
      alert("Solo los administradores pueden editar materias");
      return;
    }

    this.router.navigate(['/registro-materias'], {
      queryParams: { id: idMateria }
    });
  }

  // Método para eliminar materia
  public delete(idMateria: number) {
    if (!this.esAdministrador) {
      alert("Solo los administradores pueden eliminar materias");
      return;
    }

    // Abre el modal de confirmación
    const dialogRef = this.dialog.open(EliminarUserModalComponent, {
      data: {
        id: idMateria,
      },
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Resultado del modal:', result);
      if (result && result.isDelete) {
        console.log("Materia eliminada, recargando lista...");
         alert("Materia eliminada correctamente.");
        //Recargar página
        window.location.reload();
        this.obtenerMaterias();
      }
      else{
        alert("Materia no se ha podido eliminar.");
        console.log("No se eliminó la materia");
      }
    });
  }

  // Método para formatear días
  public formatDias(dias_json: any): string {
    if (typeof dias_json === 'string') {
      try {
        const dias = JSON.parse(dias_json);
        return Array.isArray(dias) ? dias.join(', ') : dias_json;
      } catch {
        return dias_json;
      }
    } else if (Array.isArray(dias_json)) {
      return dias_json.join(', ');
    }
    return '';
  }

  public formatHora(hora: string): string {
  if (!hora) return '';

  // Si ya está formateada, déjala igual
  if (hora.includes('AM') || hora.includes('PM')) {
    return hora;
  }

  // Convertir formato HH:MM:SS a HH:MM AM/PM
  const partes = hora.split(':');
  if (partes.length < 2) return hora;

  let horas = parseInt(partes[0], 10);
  const minutos = partes[1];
  const ampm = horas >= 12 ? 'PM' : 'AM';

  // Convertir a formato 12 horas
  horas = horas % 12;
  horas = horas ? horas : 12; // La hora 0 se convierte a 12

  return `${horas}:${minutos} ${ampm}`;
}
}
