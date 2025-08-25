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

  if (!Key) {
    const avatar = this.generateAvatarUrl('User');
    this.imgUrl = avatar;
    return avatar;
  }

const bucket = 'inncircles.helpersdb';
const region = 'ap-south-1';

const url = `https://s3.${region}.amazonaws.com/${bucket}/${Key}`;

  this.imgUrl = url;
  return url;
}


  getImageURL(Key: string) {
    return this.getAvatarImagePath(Key);
  }

}


