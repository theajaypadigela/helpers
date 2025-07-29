import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Helper } from '../types/helper.interface';

@Injectable({
  providedIn: 'root'
})
export class GetHelperDetailsService {

  apiUrl: string = 'http://localhost:3000/api/helpers';

  helpers = signal<Helper[]>([]);

  constructor(private http: HttpClient) { }

  loadHelperDetails() {
    this.http.get<Helper[]>(`${this.apiUrl}`).subscribe(
      (data: Helper[]) => {
        this.helpers.set(data);
      },
      (error) => {
        console.error('Error fetching helper details:', error);
      }
    );
  }

  /**
   * Fetch helper details from API as an observable of Helper array.
   */
  getHelperDetails(): Observable<Helper[]> {
    return this.http.get<Helper[]>(`${this.apiUrl}`);
  }
  sortHelpersById() {
    const sortedHelpers = [...this.helpers()].sort((a, b) => a.id - b.id);
    this.helpers.set(sortedHelpers);
  }
  sortHelpersByName() {
    const sortedHelpers = [...this.helpers()].sort((a, b) => a.fullname.localeCompare(b.fullname));
    this.helpers.set(sortedHelpers);
  }
}
