import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';

function passwordMatchValidator(frm: FormGroup): { mismatch: boolean } {
  const password = frm.get('password').value;
  const passwordConfirm = frm.get('passwordConfirm').value;

  return password === passwordConfirm ? null : {mismatch: true};
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  passwordHide = true;
  passwordConfirmHide = true;
  authErrors = null;

  constructor(private formBuilder: FormBuilder, public authService: AuthService, private route: Router) {
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
      .then(() => {
        this.route.navigate(['/']);
      })
      .catch((error) => {
        this.authErrors = error;
        console.log(error);
      });

  }

}
