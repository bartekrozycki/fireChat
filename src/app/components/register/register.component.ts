import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
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
    console.log(this.registerForm.value);
  }

}
