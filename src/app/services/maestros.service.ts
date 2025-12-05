import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { FacadeService } from './facade.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MaestrosService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // Esquema base del maestro
  public esquemaMaestros() {
    return {
      rol: '',
      clave_maestro: '',
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmar_password: '',
      telefono: '',
      fechaN: '',
      rfc: '',
      cubiculo: '',
      area: '',
      materias_json: []
    };
  }

  // Validación del formulario de maestro
  public validarMaestro(data: any, editar: boolean) {
    console.log("Validando maestro... ", data);
    let error: any = {};

    // Validaciones básicas
    if (!this.validatorService.required(data["clave_maestro"])) {
      error["clave_maestro"] = this.errorService.required;
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

    // Contraseñas (solo si no está editando)
    if (!editar) {
      if (!this.validatorService.required(data["password"])) {
        error["password"] = this.errorService.required;
      }

      if (!this.validatorService.required(data["confirmar_password"])) {
        error["confirmar_password"] = this.errorService.required;
      }
    }

    // RFC
    if (!this.validatorService.required(data["rfc"])) {
      error["rfc"] = this.errorService.required;
    } else if (!this.validatorService.min(data["rfc"], 12)) {
      error["rfc"] = this.errorService.min(12);
      alert("La longitud de caracteres del RFC es menor, deben ser 12");
    } else if (!this.validatorService.max(data["rfc"], 13)) {
      error["rfc"] = this.errorService.max(13);
      alert("La longitud de caracteres del RFC es mayor, deben ser 13");
    }


    // Fecha
    if (!this.validatorService.required(data["fechaN"])) {
      error["fechaN"] = this.errorService.required;
    }

    // Teléfono
    if (!this.validatorService.required(data["telefono"])) {
      error["telefono"] = this.errorService.required;
    }

    // Cubículo
    if (!this.validatorService.required(data["cubiculo"])) {
      error["cubiculo"] = this.errorService.required;
    }

    // Área
    if (!this.validatorService.required(data["area"])) {
      error["area"] = this.errorService.required;
    }

    // Materias (ajustado a materias_json)
    const materiasSeleccionadas = data["materias_json"] ?? data["materias"];
    if (!this.validatorService.required(materiasSeleccionadas)) {
      error["materias_json"] = this.errorService.required;
    } else if (Array.isArray(materiasSeleccionadas) && materiasSeleccionadas.length === 0) {
      error["materias_json"] = "Debes seleccionar al menos una materia";
    }

    console.log("Errores detectados: ", error);

    return error;
  }

      //Aqui van los servicios HTTP
      //Servicio para registrar un nuevo usuario
      public registrarMaestro(data: any): Observable <any>{
        const token = this.facadeService.getSessionToken();
        let headers : HttpHeaders;
        if(token){
          headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
        } else{
          headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        }

        return this.http.post<any>(`${environment.url_api}/maestro/`,data, { headers });
      }

      //Servicio para obtener la lista de maestros
  public obtenerListaMaestros(): Observable<any>{
    // Verificamos si existe el token de sesión
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, { headers });
  }

  // Petición para obtener un maestro por su ID
  public obtenerMaestroPorID(idMaestro: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/maestro/?id=${idMaestro}`, { headers });
  }

  // Petición para actualizar un maestro
  public actualizarMaestro(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.put<any>(`${environment.url_api}/maestro/`, data, { headers });
  }

  // Petición para eliminar un maestro
  public eliminarMaestro(idMaestro: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.delete<any>(`${environment.url_api}/maestro/?id=${idMaestro}`, { headers });
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
