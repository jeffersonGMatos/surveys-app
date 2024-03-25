import { Injectable, OnInit } from "@angular/core";
import { environment } from "./utils/config";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, map, of, tap } from "rxjs";
import { WindowService } from "./window.service";
import { User } from "./users/user";
import { Survey } from "./survey/survey";

@Injectable({
  providedIn: 'root'
})
export class AppService implements OnInit {
  private _authJwt: string | null = null;
  private window = this.windowService.getWindow();
  public user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public appMessage: BehaviorSubject<any> = new BehaviorSubject(null);
  private _responses: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _isOnline: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public readonly responses$ = this._responses.asObservable();
  public readonly isOnline$ = this._isOnline.asObservable();

  constructor(
    private windowService: WindowService,
    private _http: HttpClient
  ) {}

  set authJwt(value: string | null) {
    if (value) 
      this.window.localStorage.setItem('_a', value);
    else
      this.window.localStorage.removeItem('_a');
    
    this._authJwt = value;
  }

  get authJwt(): string | null {
    if (!this._authJwt)
      this._authJwt = this.window.localStorage.getItem('_a');

    return this._authJwt;
  }

  private sendResponse(index: number): Observable<any> {
    const data: any = this._responses.value[index];

    let headers = new HttpHeaders({
      'Content-type': 'application/json'
    });

    const body = {
      name: data.name,
      age: data.age,
      neighborhood: data.neighborhood,
      gender: data.gender,
      responses: data.responses.reduce((prev: any[], curr: any) => {
        let arr = curr.response.map((optionId: string) => ({questionId: curr.questionId, optionId}));
        prev.push(...arr);
        return prev;
      }, [])
    };

    return this._http
      .post(`${environment.api_host}/surveys/${data.surveyId}/response`, body, {headers})
      .pipe(
        catchError((err) => {

          if(err.status == 0) 
            this._isOnline.next(false);

          return of(false)
        }),
        map(v => v == false ? false : true)
      )
  }

  private initResponses() {
    const responses = this.window.localStorage.getItem('responses');

    if (responses)
      this._responses.next(JSON.parse(responses));
  }

  public handleError<T>(def: T, storageKey?: string) {
    return (error: HttpErrorResponse): Observable<T> => {

      if (error.status == 0 || error.status == 504) {
        if (storageKey) {
          const user = this.window.localStorage.getItem(storageKey);
          if (user)
            return of(this._responses.next(JSON.parse(user)) as T);
        }
      }

      //this.appMessage.next(error.error.message || 'Erro desconhecido');
      return of(def);
    }
  }

  public getSurveys(): Observable<Survey[]> {
    return this._http.get<Survey[]>(`${environment.api_host}/surveys?onlyActive=true`).pipe(
      catchError(this.handleError([], 'surveys'))
    )
  }

  public login({username, password}: any): Observable<any> {
    const auth = this.window.btoa(`${username}:${password}`);

    const headers = new HttpHeaders({
      "Authorization": `Basic ${auth}`,
      "Content-type": "application/json"
    });

    return this._http.post(`${environment.api_host}/public/auth`, {}, {headers}).pipe(
      catchError((err: HttpErrorResponse) => 
        of({
          ok: false,
          errorCode: err.error.error,
          error: err.error.message || "Ocorreu um erro"
        })
      ),
      map(response => {
        if (Object.keys(response).includes('error'))
          return response
        else {
          this.authJwt = response as string
          return {
            ok: true
          }
        }

      })
    )

  }

  public auth(): Observable<any> {
    if (!this.authJwt)
      return of(false);

    if (this.user.value)
      return of(true);

    return this._http.get(`${environment.api_host}/auth`).pipe(
      catchError(this.handleError(false, 'user')),
      map(response => {
        if (response !== false) {
          this.window.localStorage.setItem('user', JSON.stringify(response))
          this.user.next(response as User);
          return true;
        } else {
          this.user.next(null);
          return false;
        }
      })
    )
  }

  public getSurvey(surveyId: string): Observable<Survey | undefined> {
    return this._http.get<any>(`${environment.api_host}/surveys/${surveyId}`).pipe(
      catchError(this.handleError(undefined, `survey_${surveyId}`)),
      map(survey => {
        if (survey)
          return {
            ...survey,
            expirationDate: new Date(`${survey.expirationDate} 03:00:00`)
          } as Survey

        return undefined
      })
    )
  }

  public saveResponse(response: any) {
    const responses = Array.from(this._responses.value);
    const idx = responses.length;

    responses[idx] = response;

    this._responses.next(responses);
    this.sendResponse(idx).subscribe(success => {
      if (success) {
        let arr = Array.from(this._responses.value);
        arr.splice(idx, 1);
        this._responses.next(arr);
      } 
    })
  }

  ngOnInit() {
    this.initResponses();

    this._responses.subscribe(value =>
      this.window.localStorage.setItem('responses', JSON.stringify(value))
    );
  }

}