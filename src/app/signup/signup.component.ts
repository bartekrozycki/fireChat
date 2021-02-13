import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth-service.service';
import {MatSnackBar} from '@angular/material/snack-bar';

function passwordMatchValidator(frm: FormGroup): { mismatch: boolean } {
  const password = frm.get('password').value;
  const passwordConfirm = frm.get('passwordConfirm').value;

  return password === passwordConfirm ? null : {mismatch: true};
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  passwordHide = true;
  passwordConfirmHide = true;
  authErrors = null;

  constructor(private formBuilder: FormBuilder,
              public authService: AuthService,
              readonly snack: MatSnackBar) {
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.formBuilder.group({
        password: ['', [Validators.required]],
        passwordConfirm: ['', [Validators.required]],
      }, {validators: passwordMatchValidator}),
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const email = this.registerForm.get('email').value;
    const password = this.registerForm.get('passwordGroup.password').value;

    this.authService.signUpWithEmail(email, password)
      .catch(error => {
        console.log(error);
        this.snack.open(error.message, `ok`, {
          duration: 3000,
          verticalPosition: `top`,
          horizontalPosition: `center`,
        });
      });

  }

}
