import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../_modules/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'https://localhost:5001/api/';
  // ReplaySubject typ observable,przechowuje wartosci i typ wartosci
  // gdy subskrybent pominie ostatnia wartosc wewnatrz lub dowolna liczbe
  private currentUserSource = new ReplaySubject<User>(1);
  // $ mówi o tym że jest to zmienna typu observable
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  login(model: any) {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: User) => {
        const user = response;
        console.log(response);

        if (user) {
          console.log('stringify: ' + JSON.stringify(response));
          localStorage.setItem('user', JSON.stringify(response));
          this.currentUserSource.next(response);
        }
      })
    );
  }

  setCurrentUser(user: User) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
}
