import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { authGuard } from './utils/guards/auth.guard';
import { LoginComponent } from './login/login.component';
import { SurveyComponent } from './survey/survey.component';
import { ConfirmeComponent } from './confirme/confirme.component';

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "surveys/:surveyId",
    component: SurveyComponent,
    canActivate: [authGuard]
  },
  {
    path: "confirme/:surveyId",
    component: ConfirmeComponent,
    canActivate: [authGuard]
  }
];
