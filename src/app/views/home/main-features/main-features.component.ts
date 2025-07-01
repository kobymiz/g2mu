import { Component } from '@angular/core';

@Component({
    selector: 'app-main-features-section',
    template: `
     <section id="features" class="py-10 px-10 text-center">    
    <h2 class="text-3xl font-bold mb-4">Main Features</h2>
    <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">      
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="text-primary text-4xl mb-4">🔗</div>
        <h3 class="text-xl font-semibold mb-2">Short URLs & QR Codes</h3>
        <div class="text-left">
          <ul class="list-group list-group-flush">            
            <li class="list-group-item  text-gray-600">Transform your Long, Hard to remember URLs into short, memorable links and QR codes.</li>
            <li class="list-group-item  text-gray-600">Share them on Social Media, Emails, Mobile devices or anywhere else with ease.</li>
            <li class="list-group-item  text-gray-600">Grow your audience and increase engagement with our easy-to-use platform.</li>          
          </ul>          
        </div>
      </div>
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="text-primary text-4xl mb-4">📊</div>
        <h3 class="text-xl font-semibold mb-2">Analytics</h3>
        <div class="text-left">
          <ul class="list-group list-group-flush">            
            <li class="list-group-item  text-gray-600">Rich, easy to use Analytics Dashboard.</li>
            <li class="list-group-item  text-gray-600">Geographical distribution analysis...</li>
            <li class="list-group-item  text-gray-600">Platform (Facebook, Instagram, TikTok,...) distribution analysis...</li>          
            <li class="list-group-item  text-gray-600">Campaigns efficiency analysis...</li>          
            <li class="list-group-item  text-gray-600">Export your data and analyze externally...</li>          
          </ul>          
        </div>        
      </div>        
      <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div class="text-primary text-4xl mb-4">🔒</div>        
          <h3 class="text-xl font-semibold mb-2">Fast, Reliable & Secured</h3>
          <div class="text-left">
          <ul class="list-group list-group-flush">            
            <li class="list-group-item  text-gray-600">Thanks to our distribution over the world, our platform offers fast performance from anywhere.</li>
            <li class="list-group-item  text-gray-600">You can trust our platform to provide you accurate information anytime.</li>          
            <li class="list-group-item  text-gray-600">We gurantee almost 100% uptime so you can access our platoform anytime.</li>                                  
            <li class="list-group-item  text-gray-600">Our platform follows the most strict security requirements so you can be sure that your personal data is secured.</li>                                  
          </ul>          
        </div>        
        </div>
    </div>
    <span class="text-primary text-4xl"></span>
  </section>
    `,    
})
export class MainFeaturesSectionComponent { }