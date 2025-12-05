import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {

  constructor(
        private http: HttpClient,
        private validatorService: ValidatorService,
        private errorService: ErrorsService,
        private facadeService: FacadeService
  ) { }

  public esquemaAlumnos(){
     return {
      'rol': '',
      'clave_alumno': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'password': '',
      'confirmar_password': '',
      'telefono': '',
      'curp': '',
      'fechaN': '',
      'rfc': '',
      'edad': '',
      'ocupacion': '',
    }
  }


   //Validación para el formulario
  public validarAlumno(data: any, editar: boolean) {
    console.log("Validando alumno... ", data);
    let error: any = {};
    //Validaciones
    if (!this.validatorService.required(data["clave_alumno"])) {
      error["clave_alumno"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["first_name"])) {
      error["first_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["last_name"])) {
      error["last_name"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["email"])) {
      error["email"] = this.errorService.required;
    } else if (!this.validatorService.max(data["email"], 40)) {
      error["email"] = this.errorService.max(40);
    } else if (!this.validatorService.email(data['email'])) {
      error['email'] = this.errorService.email;
    }

    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    if (!this.validatorService.required(data["rfc"])) {
      error["rfc"] = this.errorService.required;
    } else if (!this.validatorService.min(data["rfc"], 12)) {
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres deL RFC es menor, deben ser 12");
    } else if (!this.validatorService.max(data["rfc"], 13)) {
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres deL RFC es mayor, deben ser 13");
    }

       if (!this.validatorService.required(data["curp"])) {
      error["curp"] = this.errorService.required;
    } else if (!this.validatorService.min(data["curp"], 18)) {
      error["curp"] = this.errorService.min(18);
      alert("La longitud de caracteres deL CURP es menor, deben ser 18");
    } else if (!this.validatorService.max(data["curp"], 18)) {
      error["curp"] = this.errorService.max(18);
      alert("La longitud de caracteres deL CURP es mayor, deben ser 18");
    }

    if(!this.validatorService.required(data["fechaN"])){
      error["fechaN"] = this.errorService.required;
    }


    if (!this.validatorService.required(data["edad"])) {
      error["edad"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["edad"])) {
      alert("El formato es solo números");
    } else if (data["edad"] < 18) {
      error["edad"] = "La edad debe ser mayor o igual a 18 años";
    }

    if(!this.validatorService.required(data["telefono"])){
      error["telefono"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["ocupacion"])){
      error["ocupacion"] = this.errorService.required;
    }

    //Return arreglo
    return error;
  }

    //Aqui van los servicios HTTP
    //Servicio para registrar un nuevo usuario
    public registrarAlumno(data: any): Observable <any>{

      const token = this.facadeService.getSessionToken();
      let headers: HttpHeaders;
      if(token){
        headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
      } else{
        headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      }
      return this.http.post<any>(`${environment.url_api}/alumno/`,data, {headers});
    }

    //Servicio para obtener la lista de alumnos
  public obtenerListaAlumnos(): Observable<any>{
    // Verificamos si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-alumnos/`, { headers });
  }

  // Petición para obtener un maestro por su ID
  public obtenerAlumnoPorID(idAlumno: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/alumno/?id=${idAlumno}`, { headers });
  }

  // Petición para actualizar un maestro
  public actualizarAlumno(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.put<any>(`${environment.url_api}/alumno/`, data, { headers });
  }

  // Petición para eliminar un maestro
  public eliminarAlumno(idAlumno: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.delete<any>(`${environment.url_api}/alumno/?id=${idAlumno}`, { headers });
  }

  // Servicio para obtener el total de usuarios registrados por rol
  public getTotalUsuarios(): Observable<any>{
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/total-usuarios/`, { headers });
  }

}
