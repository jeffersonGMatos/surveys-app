import { Component } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { AppService } from "../app.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule],
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.css'
})
export class LoginComponent {
  isLoading = false;

  public loginForm = new FormGroup({
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });

  get username(): FormControl<string> {
    return this.loginForm.get('username') as FormControl<string>
  }

  get password(): FormControl<string> {
    return this.loginForm.get('password') as FormControl<string>
  }

  public isPasswordVisible = false

  constructor(
    private appService: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  private login() {
    const credentials = this.loginForm.value;
    this.isLoading = true;
    this.loginForm.markAsPending();
    this.appService.login(credentials).subscribe(
      response => {
        this.isLoading = false;

        if (!response.ok) {
          if (response.error === 'INVALID_CREDENTIALS_USER')
            this.username.setErrors({ notfound: true });
          else
          if (response.error === 'INVALID_CREDENTIALS_PASSWORD')
            this.password.setErrors({ invalid: true });
        } else 
          this.redirect();
      }
    )
  }

  private redirect() {
    const redirect = this.route.snapshot.queryParamMap.get('redirect')
    
    if (redirect)
      this.router.navigateByUrl(redirect)
    else
      this.router.navigate(['/'])
  }

  public onSubmit(ev: SubmitEvent) {
    ev.preventDefault();
    if (this.loginForm.valid && !this.isLoading) {
      this.login();
    }
  }
}