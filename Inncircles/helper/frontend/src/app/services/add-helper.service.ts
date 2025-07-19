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
  joinedOn?: string | null;
  image?: File | string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AddHelperService {

  constructor(private http: HttpClient, private loadHelper: GetHelperDetailsService) { }

  addHelper(helper: Helper): void {
    console.log('Adding helper:', helper);

    const formData = new FormData();

     Object.entries(helper).forEach(([key, value]) => {
      if (key === 'image' && value instanceof File) {
        formData.append('image', value, value.name);
      } else if (key === 'languages' && Array.isArray(value)) {
        value.forEach(lang => formData.append('languages', lang));
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    this.http.post<Helper>('http://localhost:3000/api/helpers', formData).subscribe(
      (response: Helper) => {
        console.log('Helper added successfully:', response);
        this.loadHelper.loadHelperDetails(); 
      }
    );
  }
}
