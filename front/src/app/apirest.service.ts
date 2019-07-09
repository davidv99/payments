import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable({
  providedIn: 'root',
})
export class ApirestService {
  public apiUrl: string = 'http://payments.local/api/v1/'; //Url test api
  //public apiUrl: string = '';  //Url production api

  public term: string = '';
  constructor(private http: Http) {
    this.http = http;
  }

  /**
   *
   **/
  queryPostRegular(route: string, body) {
    let repos = this.http.post(this.apiUrl.concat(route), body);
    return repos;
  }

  queryGet(route: string) {
    let token = localStorage.getItem('token');
    let headers = new Headers({ Authorization: token });
    let options = new RequestOptions({ headers: headers });
    let repos = this.http.get(this.apiUrl.concat(route), options);
    return repos;
  }

  queryPost(route: string, body) {
    let token = localStorage.getItem('token');
    let headers = new Headers({ Authorization: token });
    let options = new RequestOptions({ headers: headers });
    let repos = this.http.post(
      this.apiUrl.concat(route),
      body,
      options,
    );
    return repos;
  }

  queryDelete(route: string) {
    let token = localStorage.getItem('token');
    let headers = new Headers({ Authorization: token });
    let options = new RequestOptions({ headers: headers });
    let repos = this.http.delete(this.apiUrl.concat(route), options);
    return repos;
  }

  queryExternalApi(route) {
    let repos = this.http.get(route);
    return repos;
  }
}
