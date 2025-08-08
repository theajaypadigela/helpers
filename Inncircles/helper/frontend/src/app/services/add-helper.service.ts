import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GetHelperDetailsService } from './get-helper-details.service';
import { Observable } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { Helper } from '../types/helper.interface';
import { url } from 'node:inspector';

@Injectable({
  providedIn: 'root'
})
export class AddHelperService {

  imgUrl: string | null = null;

  constructor(private http: HttpClient, private loadHelper: GetHelperDetailsService) { }

  addHelper(helper: Helper): Observable<any> {
    const apiUrl = 'http://localhost:3000/api/helpers';
    return this.http.get<{ url: string; key: string }>('http://localhost:3000/api/helpers/getUrl').pipe(
      switchMap(({ url, key }) =>
        this.http.put(url, helper.image).pipe(map(() => key))
      ),
      // switchMap((key: string) =>
      //   // this.http.get<{ imageUrl: string }>(`http://localhost:3000/api/helpers/getImageUrl?key=${key}`)
        
      // ),
      tap((Key: string) => {
        helper.image = Key;
      }),
      switchMap(() => this.http.post<any>(apiUrl, helper))
    );
  }
}
