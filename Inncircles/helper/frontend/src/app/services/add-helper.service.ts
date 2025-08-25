import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetHelperDetailsService } from './get-helper-details.service';
import { Observable } from 'rxjs';
import { Helper } from '../types/helper.interface';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class AddHelperService {

  imgUrl: string | null = null;

  constructor(private http: HttpClient, private loadHelper: GetHelperDetailsService) { }

  addHelper(helper: Helper, image?: File, pdf?: File, additionalDocument?: File): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/helpers';
    
    const formData = new FormData();
    
    // Add helper data as JSON string
    formData.append('data', JSON.stringify(helper));
    
    // Add files if they exist
    if (image) {
      formData.append('image', image);
    }
    
    if (pdf) {
      formData.append('pdf', pdf);
    }
    
    if (additionalDocument) {
      formData.append('additionalDocument', additionalDocument);
    }
    
    return this.http.post(apiUrl, formData);
  }
}
