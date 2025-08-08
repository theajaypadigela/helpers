import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  imgUrl: string | null = null;
  constructor(private http: HttpClient) { }

  generateAvatarUrl(name: string): string {
    const trimmed = name.trim();
    const formatted = trimmed.replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${formatted}&background=random&color=fff&rounded=true&length=2`;
  }

  getAvatarImagePath(Key: string): string {
    return this.generateAvatarUrl(Key);
    // this.getImageURL(Key).subscribe(imageUrl => {
    //   this.imgUrl = imageUrl;
    // });
    // return this.imgUrl || '';
  }

  getImageURL(key: string): Observable<string> {
    return this.http.get<{ imageUrl: string }>(`http://localhost:3000/api/helpers/getImageUrl?key=${key}`)
      .pipe(
        map(response => response.imageUrl)
      );
    return this.http.get<{ imageUrl: string }>(`http://localhost:3000/api/helpers/getImageUrl?key=${key}`)
      .pipe(
        map(response => response.imageUrl)
      );
  }

}


