import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../app.service";
import {DateSelectArg} from "@fullcalendar/core";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit{
  @Output() createdEvent: EventEmitter<any> = new EventEmitter;

  event!: DateSelectArg;
  display: boolean = false;
  createEventForm!: FormGroup;
  regularly: boolean = false;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.createEventForm = new FormGroup({
      title: new FormControl('', Validators.required),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      regularly: new FormControl('', Validators.required)
    })
  }

  showDialog(event:DateSelectArg) {
    this.event = event;
    this.display = !this.display;
    this.createEventForm = new FormGroup({
      title: new FormControl('', []),
      regularly: new FormControl("", []),
      start: new FormControl(this.event?.start.toISOString().replace(/.000Z.*$/, '')),
      end: new FormControl(this.event?.end.toISOString().replace(/.000Z.*$/, ''))
    })
  }

  createEvent() {
    if(this.createEventForm.value.regularly === true) {
      let data = {
        id: Math.floor(Math.random() * 100),
        title: this.createEventForm.value.title,
        start: this.event.start.toISOString(),
        end: this.event.end.toISOString(),
        backgroundColor: "rgba(246, 246, 246, 0.8)",
        borderColor: "rgba(135, 133, 134, 0.8)",
        textColor: "black",
        regularly: true,
      }
      this.appService.createEvent(data).subscribe((res) => {
        this.createdEvent.emit(data)
      })
    }
    else {
      let data = {
        id: Math.floor(Math.random() * 100),
        title: this.createEventForm.value.title,
        start: this.event.start.toISOString(),
        end: this.event.end.toISOString(),
        backgroundColor: "rgb(253,241,186)",
        borderColor: "rgb(236,205,69)",
        textColor: "black",
        regularly: false,
      }
      this.appService.createEvent(data).subscribe((res) => {
        this.createdEvent.emit(data)
      })
    }
    this.display = false
    this.createEventForm.reset()
  }
}
