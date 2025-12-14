import { Component } from '@angular/core';
import { AboutSection } from './components/about-section/about-section';
import { ProductsSection } from './components/products-section/products-section';
import { StatSection } from './components/stat-section/stat-section';
import { FaqSection } from './components/faq-section/faq-section';
import { CtaSection } from './components/cta-section/cta-section';

@Component({
  selector: 'app-home',
  imports: [AboutSection, ProductsSection, StatSection, FaqSection, CtaSection],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
