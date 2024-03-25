import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {MatListModule} from '@angular/material/list';
import { AppService } from "../app.service";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { Survey } from "../survey/survey";
import { CommonModule, DatePipe } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { Router } from "@angular/router";
import {MatToolbarModule} from "@angular/material/toolbar";

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
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  public surveys: Survey[] = [];
  public readonly isOnline$ = this.appService.isOnline$
  public readonly responses$ = this.appService.responses$

  constructor(
    private appService: AppService,
    private router: Router
  ) {}

  async getSurveys() {
    this.surveys = await firstValueFrom(this.appService.getSurveys());
  }
  
  showSurvey(id: string) {
    this.router.navigate([`surveys/${id}`]);
  }

  ngOnInit(): void {
    this.getSurveys();
  }
}