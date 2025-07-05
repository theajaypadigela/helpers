import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from './get-helper-details.service';

interface Helper {
  id: number;
  occupation: string;
  organisationName: string;
  fullname: string;
  languages: string[];
  gender: string;
  phone: string;
  email: string;
  vehicleType: string;
  joinedOn?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AddHelperService {

  constructor(private http: HttpClient, private loadHelper: GetHelperDetailsService) { }

  addHelper(helper: Helper): void {
    this.http.post<Helper>('http://localhost:3000/api/helpers', helper).subscribe(
      (response: Helper) => {
        console.log('Helper added successfully:', response);
        this.loadHelper.loadHelperDetails(); 
      }
    );
  }
}
