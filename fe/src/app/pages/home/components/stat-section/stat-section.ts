import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface StatItem {
  icon: string;
  value: number;
  label: string;
  suffix: string;
}

@Component({
  selector: 'app-stat-section',
  imports: [CommonModule, NzIconModule],
  templateUrl: './stat-section.html',
  styleUrl: './stat-section.css'
})
export class StatSection implements OnInit {
  statsData: StatItem[] = [
    {
      icon: 'shopping-cart',
      value: 32,
      label: 'Sản phẩm',
      suffix: '+'
    },
    {
      icon: 'smile',
      value: 5000,
      label: 'Khách hàng hài lòng',
      suffix: '+'
    },
    {
      icon: 'shop',
      value: 3,
      label: 'Cửa hàng',
      suffix: ''
    },
    {
      icon: 'trophy',
      value: 10,
      label: 'Năm kinh nghiệm',
      suffix: '+'
    }
  ];

  counts: number[] = [];

  ngOnInit() {
    this.counts = this.statsData.map(() => 0);
    this.animateCounters();
  }

  animateCounters() {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    this.statsData.forEach((stat, index) => {
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const newValue = Math.floor(easeOutQuart * stat.value);

        this.counts[index] = newValue;

        if (currentStep >= steps) {
          clearInterval(timer);
          this.counts[index] = stat.value;
        }
      }, interval);
    });
  }

  formatNumber(num: number): string {
    return num.toLocaleString();
  }
}
