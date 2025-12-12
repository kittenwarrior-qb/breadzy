import { Component } from '@angular/core';
import { AboutSection } from './components/about-section/about-section';
import { ProductsSection } from './components/products-section/products-section';

@Component({
  selector: 'app-home',
  imports: [AboutSection, ProductsSection],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
