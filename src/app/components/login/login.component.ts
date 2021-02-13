import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);
  passwordHide = true;
  authErrors = null;

  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: Router) {
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const email = this.loginForm.get('email').value;
    const password = this.loginForm.get('password').value;

    console.log(email + ' = > ' + password);
    this.authService.signInWithEmail(email, password)
      .then(() => {
        this.route.navigate(['/']);
      })
      .catch(e => {
        this.authErrors = e;
        console.log(e);
      });
  }


}
