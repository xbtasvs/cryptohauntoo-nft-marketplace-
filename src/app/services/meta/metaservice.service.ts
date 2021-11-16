import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class MetaserviceService {

  constructor(private http: HttpClient) { }

  public getMetadataFromUrl(url: any): Observable<any> {
    return this.http.get(url);
  }

  public async authDataFromUrl(url: any, data: any, header: any) {
    const options = { headers: header }
    const res = await this.http.post<any>(url, data, options).toPromise()
    return res;
  }

  public async setMetadata(url: any, data: any) {
    await this.http.post<any>(url, data).toPromise();
  }
}
