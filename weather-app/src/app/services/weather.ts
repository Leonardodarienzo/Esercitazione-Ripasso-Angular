import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1/forecast';

  constructor(private http: HttpClient) {}

  getWeather(lat: number, lon: number): Observable<any> {
    const url = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current_weather=true`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Errore nella chiamata meteo:', error);
        return throwError(() => new Error('Errore durante il recupero dei dati meteo'));
      })
    );
  }
}
