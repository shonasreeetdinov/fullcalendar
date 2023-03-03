import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppService} from "../app.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit{
  @Output() deletedEvent: EventEmitter<any> = new EventEmitter
  @Output() updatedEvent: EventEmitter<any> = new EventEmitter

  event: any;
  form!: FormGroup;
  display: boolean = false;
  regularly: boolean = false;

  constructor(public appService: AppService) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(this.event?.title, Validators.required),
      start: new FormControl('', Validators.required),
      end: new FormControl('', Validators.required),
      regularly: new FormControl('', Validators.required)
    })
  }

  showDialog(event:any) {
    this.event = event;
    this.form = new FormGroup({
      title: new FormControl(this.event?.title, Validators.required),
      start: new FormControl(this.event?.start?.toISOString().replace(/.000Z.*$/, ''), Validators.required),
      end: new FormControl(this.event?.end?.toISOString().replace(/.000Z.*$/, ''), Validators.required),
      regularly: new FormControl(this.event?._def.extendedProps?.regularly, Validators.required)
    })
    this.display = !this.display;
  }


  updateEvent() {
    if(this.form.value.regularly === true) {
      let data = {
        id: this.event._def.publicId,
        title: this.form.value.title,
        start: this.form.value.start,
        end: this.form.value.end,
        backgroundColor: "rgba(246, 246, 246, 0.8)",
        borderColor: "rgba(135, 133, 134, 0.8)",
        textColor: "black",
        regularly: true,
      }
      this.appService.updateEvent(data.id,data).subscribe((res) => {
        this.updatedEvent.emit(data)
      })
    }
    else {
      let data = {
        id: this.event._def.publicId,
        title: this.form.value.title,
        start: this.form.value.start,
        end: this.form.value.end,
        backgroundColor: "rgb(253,241,186)",
        borderColor: "rgb(236,205,69)",
        textColor: "black",
        regularly: false,
      }
      this.appService.updateEvent(data.id,data).subscribe((res) => {
        this.updatedEvent.emit(data)
      })
    }
    this.display = false
    this.form.reset()
  }

  deleteEvent() {
    this.appService.deleteEvent(this.event.publicId).subscribe((res) => {
      this.appService.events.forEach((v:any,k:number) => {
        if(v.id == this.event.publicId) {
          this.appService.events.splice(k,1)
        }
      })
      this.deletedEvent.emit(res);
      this.display = false
    })
  }

}
