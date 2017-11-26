import { MessageService } from './../message.service';
import { Component, OnInit } from '@angular/core';

//The MessagesComponent should display all messages, including the message 
//sent by the HeroService when it fetches heroes.

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  //Modify the constructor with a parameter that declares a public messageService 
  //property. Angular will inject the singleton MessageService into that property 
  //when it creates the HeroService.
  constructor(public messageService: MessageService) { }

  ngOnInit() {
  }

}
