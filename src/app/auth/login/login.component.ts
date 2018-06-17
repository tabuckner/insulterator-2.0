import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LogInComponent implements OnInit, OnDestroy {
  public isLoading = false;
  private authSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        if (!authStatus) {
          this.isLoading = false;
        }
      });
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.logIn(form.value.email, form.value.password);
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }

}
