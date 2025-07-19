import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UpdateHelperService {

  constructor(private http: HttpClient) { }

  updateHelper(helperId: number, updatedData: any) {
    return this.http.put(`http://localhost:3000/api/helpers/${helperId}`, updatedData);
  }
}
