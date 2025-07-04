import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Helper {
  _id: string;
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: string;
  phone: string;
  email: string;
  vehicleType: string;
}

@Injectable({
  providedIn: 'root'
})
export class GetHelperDetailsService {

  apiUrl: string = 'http://localhost:3000/api/helpers';
  constructor(private http: HttpClient) { }

  helpers: Helper[] = [];

  loadHelperDetails() {
    this.http.get<Helper[]>(`${this.apiUrl}`).subscribe(
      (data: Helper[]) => {
        this.helpers = data;
      }
    );
  }

  getHelperDetails() {
    return this.http.get(`${this.apiUrl}`);
  }
}
