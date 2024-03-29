import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {MatListModule} from '@angular/material/list';
import { AppService } from "../app.service";
import { BehaviorSubject, firstValueFrom, Observable } from "rxjs";
import { Survey } from "../survey/survey";
import { CommonModule, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { Router } from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";
import { User } from "../users/user";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    MatListModule,
    MatButtonModule,
    DatePipe,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class HomeComponent implements OnInit {
  public surveys: Survey[] = [];
  public readonly isOnline$ = this.appService.isOnline$
  public readonly responses$ = this.appService.responses$
  public user$: Observable<User | null>;
  
  isLoading = false;

  constructor(
    private appService: AppService,
    private router: Router
  ) {
    this.user$ = this.appService.user.asObservable();
  }

  async getSurveys() {
    this.isLoading = true;
    this.surveys = await firstValueFrom(this.appService.getSurveys());
    setTimeout(() => this.isLoading = false, 0);
  }

  retry() {
    this.appService.saveResponse();
  }
  
  showSurvey(id: string) {
    this.router.navigate([`surveys/${id}`]);
  }

  logout() {
    this.appService.logout();
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.getSurveys();
  }
}