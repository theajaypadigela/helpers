import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Helper } from '../types/helper.interface';

@Injectable({
  providedIn: 'root'
})
export class GetHelperDetailsService {

  apiUrl: string = 'http://localhost:3000/api/helpers';

  helpers = signal<Helper[]>([]);

  loadHelperDetails() {
    this.http.get<Helper[]>(`${this.apiUrl}`).subscribe(
      (data: Helper[]) => {
        this.helpers.set(data);
      }
    );
  }
   
  constructor(private http: HttpClient) { }

  getHelperDetails() {
    return this.http.get(`${this.apiUrl}`);
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
