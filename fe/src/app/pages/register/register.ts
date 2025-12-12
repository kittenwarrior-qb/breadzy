import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';

import { AuthService } from '../../services/auth.service'; 
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  validateForm = this.fb.group({
    username: this.fb.control('', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]),
    email: this.fb.control('', [Validators.required, Validators.email]),
    password: this.fb.control('', [Validators.required, Validators.minLength(3)]),
    remember: this.fb.control(true)
  });

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {
      const { username, email, password } = this.validateForm.getRawValue();

      try {
        const res = await firstValueFrom(
          this.authService.register({ username, email, password })
        );

        this.message.success(res.msg || 'Đăng ký thành công!');
        this.router.navigate(['/login']); 
      } catch (err: any) {
        const errorMsg = err?.error?.msg || 'Đăng ký thất bại. Vui lòng thử lại.';
        this.message.error(errorMsg);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
    }
  }
}
