import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface GeocodeResult {
  lat: number;
  lon: number;
  display_name: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeocodeService {
  private url = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  // NOTA: ritorniamo sempre un Observable<any[]> trasformato in GeocodeResult[]
  geocode(query: string): Observable<GeocodeResult[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('format', 'json')
      .set('limit', '5')
      .set('addressdetails', '0');

    // Importante: return qui
    return this.http.get<any[]>(this.url, { params }).pipe(
      map(results =>
        results.map(r => ({
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
          display_name: r.display_name
        }))
      ),
      catchError(err => {
        console.error('Errore geocoding:', err);
        return throwError(() => new Error('Errore durante il geocoding'));
      })
    );
  }
}

