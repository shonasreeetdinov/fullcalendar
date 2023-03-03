import {Component, ChangeDetectorRef, OnInit, ViewChild, Output, EventEmitter} from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import allLocales from "@fullcalendar/core/locales-all";
import {AppService} from "./app.service";
import {CreateEventComponent} from "./create-event/create-event.component";
import {UpdateEventComponent} from "./update-event/update-event.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  events: Object = [];
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      timeGridPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'timeGridDay,timeGridWeek'
    },
    initialView: 'timeGridWeek',
    initialDate: Date.now(),
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locales: allLocales,
    locale: 'ru',
    timeZone: 'GMT',
    select: this.handleDateSelect.bind(this),
    eventResize: this.eventResize.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef,
              public appService: AppService) {}
  @ViewChild(CreateEventComponent) createEventComponent!: CreateEventComponent;
  @ViewChild(UpdateEventComponent) updateEventComponent!: UpdateEventComponent;

  @Output() eventResizing: EventEmitter<any> = new EventEmitter;

  ngOnInit() {
    this.getAllEvents();
  }

  getAllEvents() {
    this.appService.getAllEvents().subscribe((e) => {this.events = e})
  }

  handleDateSelect(event: DateSelectArg) {
    this.createEventComponent.showDialog(event);
  }

  eventResize(info:any) {
    if(info.event._def.extendedProps.regularly === true) {
      let data = {
        id: info.event.id,
        title: info.event.title,
        start: info.event._instance.range.start.toISOString(),
        end: info.event._instance.range.end.toISOString(),
        backgroundColor: "rgba(246, 246, 246, 0.8)",
        borderColor: "rgba(135, 133, 134, 0.8)",
        textColor: "black",
        regularly: true,
      }
      this.appService.updateEvent(data.id,data).subscribe((res) => {
        this.eventResizing.emit(res)
      })
    }
    else {
      let data = {
        id: info.event.id,
        title: info.event.title,
        start: info.event._instance.range.start.toISOString(),
        end: info.event._instance.range.end.toISOString(),
        backgroundColor: "rgb(253,241,186)",
        borderColor: "rgb(236,205,69)",
        textColor: "black",
        regularly: false,
      }
      this.appService.updateEvent(data.id,data).subscribe((res) => {
        this.eventResizing.emit(res)
      })
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.updateEventComponent.showDialog(clickInfo.event);
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }
}
