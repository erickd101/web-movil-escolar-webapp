import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_alumnos: any[] = [];
  public sortOption: string = 'clave_alumno';

  displayedColumns: string[] = ['clave_alumno', 'nombre', 'email', 'fechaN', 'telefono', 'rfc', 'edad', 'ocupacion', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosUsuario>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog

  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate(["/"]);
    }
    this.obtenerAlumnos();
  }

  public obtenerAlumnos() {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        this.lista_alumnos = response;
        console.log("Lista users: ", this.lista_alumnos);
        if (this.lista_alumnos.length > 0) {
          this.lista_alumnos.forEach(usuario => {
            usuario.first_name = usuario.user.first_name;
            usuario.last_name = usuario.user.last_name;
            usuario.email = usuario.user.email;
          });

          this.dataSource.data = this.lista_alumnos as DatosUsuario[];
          setTimeout(() => {
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
          });
        }
      }, (error:any) => {
        console.error("Error al obtener la lista de alumnos: ", error);
        alert("No se pudo obtener la lista de alumnos");
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData() {
    const data = this.lista_alumnos.slice();

    if (this.sortOption === 'clave_alumno') {
      data.sort((a, b) => a.clave_alumno.localeCompare(b.clave_alumno));
    } else if (this.sortOption === 'nombre') {
      data.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (this.sortOption === 'apellido') {
      data.sort((a, b) => a.last_name.localeCompare(b.last_name));
    }

    this.dataSource.data = data;
  }

  public goEditar(idUser: number) {
    const userIdSession = Number(this.facadeService.getUserId());

    if (this.rol === 'Administrador' || this.rol === 'Maestro') {
      console.log("Navegando a editar alumno ID:", idUser);

      this.router.navigate(['/registro-usuarios'], {
        queryParams: {
          id: idUser,
          rol: 'Alumno'
        }
      });
    } else {
      alert("No tienes permisos para editar este alumno.");
    }
  }

public delete(idUser: number) {
    const userIdSession = Number(this.facadeService.getUserId());
    if (this.rol === 'Administrador' || this.rol === 'Maestro') {
      //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
      const dialogRef = this.dialog.open(EliminarUserModalComponent,{
        data: {id: idUser, rol: 'Alumno'}, //Se pasan valores a través del componente
        height: '288px',
        width: '328px',
      });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Alumno eliminado");
        alert("Alumno eliminado correctamente.");
        //Recargar página
        window.location.reload();
      }else{
        alert("Alumno no se ha podido eliminar.");
        console.log("No se eliminó el alumno");
      }
    });
    }else{
      alert("No tienes permisos para eliminar este alumno.");
    }
  }


}




export interface DatosUsuario {
  id: number,
  clave_alumno: string;
  first_name: string;
  last_name: string;
  email: string;
  fechaN: string,
  telefono: string,
  rfc: string,
  edad: number,
  ocupacion: string,
}
