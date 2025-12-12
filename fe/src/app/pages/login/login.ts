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
  selector: 'app-login',
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
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private fb = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  async submitForm(): Promise<void> {
    if (this.validateForm.valid) {  
      const { username, password } = this.validateForm.getRawValue();

      try {
        const res = await firstValueFrom(
          this.authService.login({ email: username, password })
        );

        const accessToken = res.accessToken;
        const refreshToken = res.refreshToken;
        const email = res.user.email;
        const role = res.user.role;

        this.authService.setAuthData(accessToken, email, role, refreshToken);
        this.message.success(res.msg || 'Đăng nhập thành công!');

        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }

      } catch (err: any) {
        const errorMsg = err?.error?.msg || 'Đăng nhập thất bại. Vui lòng thử lại.';
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
