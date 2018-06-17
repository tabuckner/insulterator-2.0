import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth-data.model';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        if (!authStatus) {
          this.isLoading = false;
        }
      });
  }

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
