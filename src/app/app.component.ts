import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreService } from './shared/services/core.service';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html'
})
export class AppComponent {
  

  title = 'ImgAIS Admin';
  constructor( 
    private settings: CoreService ){
      
  }
  
}
