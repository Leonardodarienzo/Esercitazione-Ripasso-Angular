import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeocodeService, GeocodeResult } from '../../services/geocode';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.scss']
})
export class Search {
  query = '';
  suggestions: GeocodeResult[] = [];
  loading = false;
  error: string | null = null;
  weather: any = null;

  constructor(
    private geocode: GeocodeService,
    private weatherService: WeatherService
  ) {}

  onSearch(): void {
    this.error = null;
    this.weather = null;
    const q = this.query.trim();
    if (!q) {
      this.error = 'Inserisci il nome di una città.';
      return;
    }
    this.loading = true;

    // geocode() ritorna Observable<GeocodeResult[]>
    this.geocode.geocode(q).subscribe({
      next: (res: GeocodeResult[]) => {
        this.suggestions = res;
        this.loading = false;
        if (res.length === 1) {
          this.selectLocation(res[0].lat, res[0].lon);
        }
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = (err instanceof Error) ? err.message : 'Errore nella geocodifica';
      }
    });
  }

  selectLocation(lat: number, lon: number): void {
    this.error = null;
    this.loading = true;

    // getWeather() ritorna Observable<any>
    this.weatherService.getWeather(lat, lon).subscribe({
      next: (data: any) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = (err instanceof Error) ? err.message : 'Errore recupero meteo';
      }
    });
  }
}
