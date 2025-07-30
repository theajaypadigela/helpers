import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetHelperDetailsService } from './get-helper-details.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteHelperService {

  constructor(private http: HttpClient, private updateHelpers: GetHelperDetailsService) { }

  deleteHelper(id: number): void {
    this.http.delete(`http://localhost:3000/api/helpers/${id}`).subscribe({
      next: (response) => {
        // console.log('Helper deleted successfully:', response);
        this.updateHelpers.helpers.update(helpers => {
          return helpers.filter(helper => helper.id !== id);
        });
        // console.log('Updated helpers after deletion:', this.updateHelpers.helpers().length);
      },
      error: (error) => {
        console.error('Error deleting helper:', error);
      }
    });
  }
}
