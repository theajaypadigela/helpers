import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateHelperService {

  constructor(private http: HttpClient) { }

  updateHelper(helperId: number, updatedData: any, image: File | null, kyc: File | null) {
    const formData = new FormData();
    formData.append('data', JSON.stringify(updatedData));
    if (image) {
      formData.append('image', image);
    }
    if (kyc) {
      formData.append('pdf', kyc);
    }
    return this.http.put(`http://localhost:3000/api/helpers/${helperId}`, formData);
  }
}
