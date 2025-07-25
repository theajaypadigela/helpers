import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from './get-helper-details.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Helper } from '../types/helper.interface';

@Injectable({
  providedIn: 'root'
})
export class AddHelperService {

  constructor(private http: HttpClient, private loadHelper: GetHelperDetailsService) { }

  addHelper(helper: Helper): Observable<any> {
    console.log('Adding helper:', helper);

    const formData = new FormData();

     Object.entries(helper).forEach(([key, value]) => {
      console.log(`Processing field: ${key} = `, value);
      if (key === 'image' && value instanceof File) {
        formData.append('image', value, value.name);
      } else if (key === 'pdf' && value instanceof File) {
        formData.append('pdf', value, value.name);
      } else if (key === 'languages' && Array.isArray(value)) {
        value.forEach(lang => formData.append('languages', lang));
      } else if (value !== null && value !== undefined && !(value instanceof File)) {
        formData.append(key, String(value));
      } else if( key === 'additionalDocument' && value instanceof File) {
        formData.append('additionalDocument', value, value.name);
      }
    });

    console.log('FormData prepared and sending to backend...');

    return this.http.post<any>('http://localhost:3000/api/helpers', formData).pipe(
      tap((response: any) => {
        console.log('Helper added successfully:', response);
        this.loadHelper.loadHelperDetails(); 
      })
    );
  }
}
