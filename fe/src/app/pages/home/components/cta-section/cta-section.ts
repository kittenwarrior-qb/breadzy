import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-cta-section',
  imports: [CommonModule, NzButtonModule, NzIconModule],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.css'
})
export class CtaSection {

}
