import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';



@Component({
  selector: 'app-features-menu',
  templateUrl: './features-menu.component.html',  
  imports: [CommonModule],
})
export class FeaturesMenuComponent {
  protected features = [
    {
      icon: "fa-solid fa-link",
      title: "Short URL",
      description: "Create short URLs instantly with our optimized platform",
    },
    {
      icon: "fa-solid fa-chart-line",
      title: "Advanced Analytics",
      description:
        "Track clicks, locations, devices, and more with detailed insights",
    },
    {
      icon: "fa-solid fa-qrcode",
      title: "QR Code Generation",
      description: "Generate QR codes automatically for easy mobile sharing",
    },
    {
      icon: "fa-solid fa-users",
      title: "Collaboration",
      description: "Allow your team members to manage the Links",
    },
    {
      icon: "fa-solid fa-shield-halved",
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.99% uptime guarantee",
    },
  ];
}
