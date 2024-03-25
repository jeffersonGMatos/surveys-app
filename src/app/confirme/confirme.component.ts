import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { ActivatedRoute, Router, RouterState } from "@angular/router";

@Component({
  standalone: true,
  imports: [
    MatButtonModule
  ],
  template: `<div class="app-container flex-column gap-18" >
    <br/>
    <h1 class="text-center" >Obrigado por participar!</h1>
    <button mat-flat-button color="primary" (click)="new()" >Nova Enquete</button>
  </div>`
})
export class ConfirmeComponent implements OnInit {
  surveyId?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public new() {
    this.router.navigate([`surveys/${this.surveyId}`])
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('surveyId');
    
    if (id)
      this.surveyId = id;
  }

}