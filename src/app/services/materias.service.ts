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
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  // Esquema base de la materia
  public esquemaMateria() {
    return {
      nrc: '',
      name: '',
      seccion: '',
      dias_json: [],
      hora_i: '',
      hora_f: '',
      salon: '',
      programa: '',
      profesor_id: '',
      creditos: ''
    };
  }

  // Validación del formulario de materia
  public validarMateria(data: any, editar: boolean) {
    console.log("Validando materia... ", data);
    let error: any = {};

    // Validación de NRC (5-6 dígitos, único)
    if (!this.validatorService.required(data["nrc"])) {
      error["nrc"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["nrc"])) {
      error["nrc"] = "El NRC solo puede contener números";
    } else if (!this.validatorService.min(data["nrc"], 5)) {
      error["nrc"] = "El NRC debe tener al menos 5 dígitos";
    } else if (!this.validatorService.max(data["nrc"], 6)) {
      error["nrc"] = "El NRC no puede tener más de 6 dígitos";
    }

    // Validación de nombre de materia
    if (!this.validatorService.required(data["name"])) {
      error["name"] = this.errorService.required;
    } else if (!this.validatorService.words(data["name"])) {
      error["name"] = "El nombre solo puede contener letras y espacios";
    }

    // Validación de sección (máximo 3 dígitos)
    if (!this.validatorService.required(data["seccion"])) {
      error["seccion"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["seccion"])) {
      error["seccion"] = "La sección solo puede contener números";
    } else if (!this.validatorService.max(data["seccion"], 3)) {
      error["seccion"] = "La sección no puede tener más de 3 dígitos";
    }

    // Validación de días (al menos uno seleccionado)
    const diasSeleccionados = data["dias_json"];
    if (!this.validatorService.required(diasSeleccionados)) {
      error["dias_json"] = this.errorService.required;
    } else if (Array.isArray(diasSeleccionados) && diasSeleccionados.length === 0) {
      error["dias_json"] = "Debes seleccionar al menos un día";
    }

    // Validación de horario
    if (!this.validatorService.required(data["hora_i"])) {
      error["hora_i"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["hora_f"])) {
      error["hora_f"] = this.errorService.required;
    }

    // Validar que hora de inicio sea menor que hora final
    if (data["hora_i"] && data["hora_f"]) {
      const horaInicio = new Date(`2000-01-01T${data["hora_i"]}`);
      const horaFin = new Date(`2000-01-01T${data["hora_f"]}`);
      if (horaInicio >= horaFin) {
        error["hora_f"] = "La hora final debe ser mayor que la hora de inicio";
      }
    }

    // Validación de salón (alfanumérico y espacios, máximo 15 caracteres)
    if (!this.validatorService.required(data["salon"])) {
      error["salon"] = this.errorService.required;
    } else if (!this.validatorService.alphanumeric(data["salon"])) {
      error["salon"] = "El salón solo puede contener letras, números y espacios";
    } else if (!this.validatorService.max(data["salon"], 15)) {
      error["salon"] = "El salón no puede tener más de 15 caracteres";
    }

    // Validación de programa educativo
    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }

    // Validación de profesor asignado
    if (!this.validatorService.required(data["profesor_id"])) {
      error["profesor_id"] = this.errorService.required;
    }

    // Validación de créditos
    if (!this.validatorService.required(data["creditos"])) {
      error["creditos"] = this.errorService.required;
    } else if (!this.validatorService.numeric(data["creditos"])) {
      error["creditos"] = "Los créditos solo pueden ser números";
    } else {
      const creditosNum = parseInt(data["creditos"]);
      if (creditosNum <= 0) {
        error["creditos"] = "Los créditos deben ser positivos";
      } else if (creditosNum > 99) {  // Cambiado de 2 a 99
        error["creditos"] = "Los créditos no pueden ser mayores a 99";
      }
    }

    console.log("Errores detectados: ", error);

    return error;
  }

  // Servicio para registrar una nueva materia
  public registrarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }

    return this.http.post<any>(`${environment.url_api}/materia/`, data, { headers });
  }

  // Servicio para obtener la lista de materias
  public obtenerListaMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
  }

  // Petición para obtener una materia por su ID
  public obtenerMateriaPorID(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/materia/?id=${idMateria}`, { headers });
  }

  // Petición para actualizar una materia
  public actualizarMateria(data: any): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.put<any>(`${environment.url_api}/materia/`, data, { headers });
  }

  // Petición para eliminar una materia
  public eliminarMateria(idMateria: number): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.delete<any>(`${environment.url_api}/materia/?id=${idMateria}`, { headers });
  }

  // Servicio para obtener el total de materias por programa educativo
  public getTotalMaterias(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log("No se encontró el token del usuario");
    }
    return this.http.get<any>(`${environment.url_api}/materia/total/`, { headers });
  }

  // Servicio para obtener la lista de maestros
  public obtenerListaMaestros(): Observable<any> {
    const token = this.facadeService.getSessionToken();
    let headers: HttpHeaders;
    if (token) {
      headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
    } else {
      headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    }
    return this.http.get<any>(`${environment.url_api}/lista-maestros/`, { headers });
  }

  // Transformar datos de la materia
  public procesarMateria(materia: any): any {

    if (typeof materia.dias_json === 'string') {
      try {
        materia.dias_json = JSON.parse(materia.dias_json);
      } catch (e) {
        materia.dias_json = [];
      }
    }

    // Asegurar que profesor_id esté presente
  if (materia.profesor && materia.profesor.id) {
    materia.profesor_id = materia.profesor.id;
  }

     // Formatear horas para mostrar
    if (materia.hora_i) {
      materia.hora_i_formatted = this.formatTime(materia.hora_i);
    }

    if (materia.hora_f) {
      materia.hora_f_formatted = this.formatTime(materia.hora_f);
    }

  console.log("Materia procesada:", materia);
  return materia;

  }

  // Formatear hora
  private formatTime(timeString: string): string {
    if (!timeString) return '';

    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Obtener programas
  public getProgramasEducativos(): any[] {
    return [
      { value: 'Ingeniería en Ciencias de la Computación', label: 'Ingeniería en Ciencias de la Computación' },
      { value: 'Licenciatura en Ciencias de la Computación', label: 'Licenciatura en Ciencias de la Computación' },
      { value: 'Ingeniería en Tecnologías de la Información', label: 'Ingeniería en Tecnologías de la Información' }
    ];
  }

  // Obtener opciones de días
  public getDiasSemana(): any[] {
    return [
      { value: 'Lunes', label: 'Lunes' },
      { value: 'Martes', label: 'Martes' },
      { value: 'Miércoles', label: 'Miércoles' },
      { value: 'Jueves', label: 'Jueves' },
      { value: 'Viernes', label: 'Viernes' }
    ];
  }
}
