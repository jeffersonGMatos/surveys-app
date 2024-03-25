import { Component, OnInit } from "@angular/core";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AppService } from "../app.service";
import { Survey } from "./survey";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {MatSelectModule} from '@angular/material/select';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from "@angular/common";
//import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

@Component({
  templateUrl: 'survey.component.html',
  standalone: true,
  imports: [
    MatListModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    CommonModule,
    //MatSnackBarModule
  ],
  styleUrl: 'survey.component.css'
})
export class SurveyComponent implements OnInit {
  public isLoading = false;
  public survey?: Survey;

  public readonly isOnline$ = this.appService.isOnline$
  public readonly responses$ = this.appService.responses$

  genders = ["Masculino", "Feminino"];
  surveyForm = new FormGroup({
    surveyId: new FormControl<string>('', Validators.required),
    name: new FormControl('', Validators.required),
    age: new FormControl<number | null>(null, Validators.required),
    gender: new FormControl('', Validators.required),
    neighborhood: new FormControl('', Validators.required),
    responses: new FormArray<FormGroup>([])
  })

  get surveyId(): FormControl<string> {
    return this.surveyForm.get('surveyId') as FormControl<string>
  }
  get age(): FormControl<number | null> {
    return this.surveyForm.get('age') as FormControl<number | null>
  }
  get name(): FormControl<string> {
    return this.surveyForm.get('name') as FormControl<string>
  }
  get gender(): FormControl<string> {
    return this.surveyForm.get('gender') as FormControl<string>
  }
  get neighborhood(): FormControl<string> {
    return this.surveyForm.get('neighborhood') as FormControl<string>
  }

  get responses(): FormArray<FormGroup> {
    return this.surveyForm.get('responses') as FormArray<FormGroup>
  }

  constructor(
    private route: ActivatedRoute,
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router
    //private _snackBar: MatSnackBar
  ) {}

  private async getSurvey(id: string) {
    this.survey = await firstValueFrom(this.appService.getSurvey(id));
    this.resetForm();
  }

  private resetForm() {
    if (this.survey) {
      this.surveyId.setValue(this.survey.surveyId);
      this.survey.questions?.forEach(question => {
        this.responses.push(this.fb.group({
          questionId: new FormControl(question.questionId),
          response: new FormControl(null, [Validators.required])
        }));
      });

      this.isLoading = false;
    }
  }

  public asNumber(value: any): number {
    return Number(value);
  }

  public asFormArray(value: any): FormArray {
    return value as FormArray
  }

  public asFormGroup(value: any): FormGroup {
    return value as FormGroup
  }

  public asFormControl(value: any): FormControl {
    return value as FormControl
  }

  public onSubmit() {
    if (this.surveyForm.valid) {
      this.appService.saveResponse(this.surveyForm.value);
      this.router.navigate([`confirme/${this.survey?.surveyId}`])
      /*
      this._snackBar.open('Obrigado por participar', 'Splash', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      */
    }
  }

  public back() {
    this.router.navigate(['../'])
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('surveyId');
    
    if (id)
      Promise.resolve(this.getSurvey(id));
  }
}