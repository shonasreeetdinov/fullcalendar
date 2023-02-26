import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: "root"
})

export class AppService {
  api = "http://localhost:8000/events/"
  events: any;

  constructor(private http:HttpClient) {}


  getAllEvents() {
    return this.http.get(this.api).pipe(
      map( e => this.events = e)
    )
  }

  createEvent(event:any) {
    return this.http.post(this.api, event).pipe(
      map(e => this.events.push(event))
    )
  }

  updateEvent(id:number, event:any) {
    return this.http.put(this.api + id, event).pipe(
      map((res) => {
        return res;
      })
    )
  }

  deleteEvent(id:string) {
    return this.http.delete(this.api + id).pipe(
      map((res) => {return res})
    )
  }
}

