import { Injectable } from '@angular/core';
import { Country } from '../common/country';
import { State } from '../common/state';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Purchase } from '../common/purchase';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  countriesUrl = 'http://localhost:8080/api/countries';
  statesUrl = 'http://localhost:8080/api/states';

  constructor(private http: HttpClient) { }

  getCountries() {
    return this.http
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((response) => response._embedded.countries));
  }

  placeOrder(purchase: Purchase) {
    const checkoutUrl = 'http://localhost:8080/api/checkout/purchase';
    return this.http.post<Purchase>(checkoutUrl, purchase);
  }
  
  getStates(theCountryCode: string) {
    const searchStatesUrl =
      'http://localhost:8080/api/states/search/findByCountryCode?code=' +
      theCountryCode;
    return this.http
      .get<GetResponseStates>(searchStatesUrl)
      .pipe(map((response) => response._embedded.states));
  }
}

interface GetResponseCountries{
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates{
  _embedded: {
    states: State[];
  };
}
