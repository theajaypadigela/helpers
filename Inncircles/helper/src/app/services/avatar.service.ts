import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private http: HttpClient) { }

  generateAvatarUrl(name: string): string {
    const trimmed = name.trim();
    const formatted = trimmed.replace(/\s+/g, '+');
    return `https://ui-avatars.com/api/?name=${formatted}&background=random&color=fff&rounded=true&length=2`;
}

}
