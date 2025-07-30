import { computed, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Helper } from '../types/helper.interface';

@Injectable({
  providedIn: 'root'
})
export class GetHelperDetailsService {

  apiUrl: string = 'http://localhost:3000/api/helpers';

  helpers = signal<Helper[]>([]);
  firstHelper = signal<Helper | null>(null);

  constructor(private http: HttpClient) { }

  loadHelperDetails() {
    this.http.get<Helper[]>(`${this.apiUrl}`).subscribe(
      (data: Helper[]) => {
        this.helpers.set(data);
        this.firstHelper.set(data[0]);
      },
      (error) => {
        console.error('Error fetching helper details:', error);
      }
    );
  }

  setFirstHelper(id: number): void {
    const foundHelper = this.helpers().find(helper => id === helper.id) || null;
    this.firstHelper.set(foundHelper);
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
    this.firstHelper.set(sortedHelpers[0]);
  }
  sortHelpersByName() {
    console.log("sortHelpersByName is called ");
    const sortedHelpers = [...this.helpers()].sort((a, b) => a.fullname.localeCompare(b.fullname));
    this.helpers.set(sortedHelpers);
    this.firstHelper.set(sortedHelpers[0]);
    // console.log(this.firstHelper());
  }
  getFirstHelper() {
    return this.helpers()[0];
  }
}
