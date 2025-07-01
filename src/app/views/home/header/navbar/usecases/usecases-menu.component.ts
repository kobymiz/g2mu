import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';



@Component({
  selector: 'app-usecases-menu',
  templateUrl: './usecases-menu.component.html',  
  imports: [CommonModule],
})
export class UseCasesMenuComponent {
  protected useCases = [    
    {
      icon: "fa-solid fa-users",
      title: "Social Media Marketing",
      description:
        "Share clean links on Twitter, Instagram, and other platforms",
    },
    {
      icon: "fa-solid fa-comments",
      title: "Business Communications",
      description: "Professional URLs for emails, presentations, and documents",
    },
    {
      icon: "fa-solid fa-cart-shopping",
      title: "E-commerce",
      description: "Track campaign performance and customer engagement",
    },
    {
      icon: "fa-solid fa-mobile-screen",
      title: "Mobile Apps",
      description: "Deep linking and app store redirections made simple",
    },
  ];
 
}
