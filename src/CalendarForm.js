import React from "react";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import moment from "moment";
import DatePicker from "react-datepicker";
import Button from "react-bootstrap/Button";
import {
  addCalendar,
  editCalendar,
  getCalendar,
  deleteCalendar
} from "./requests";
import { observer } from "mobx-react";

const buttonStyle = { marginRight: 10 };

function CalendarForm({ calendarStore, calendarEvent, onCancel, edit }) {
  console.log({calendarEvent: calendarEvent})
  const [start, setStart] = React.useState(null);
  const [end, setEnd] = React.useState(null); // HACK: end is used as hour
  const [title, setTitle] = React.useState("");
  const [local, setLocal] = React.useState("");
  const [id, setId] = React.useState(null);

  React.useEffect(() => {
    setTitle(calendarEvent.title);
    setLocal(calendarEvent.local);
    setStart(calendarEvent.start);
    setEnd(calendarEvent.end);
    setId(calendarEvent.id);
  }, [
    calendarEvent.title,
    calendarEvent.local,
    calendarEvent.start,
    calendarEvent.end,
    calendarEvent.id
  ]);

  const handleSubmit = async ev => {
    ev.preventDefault();
    if (!title || !start || !end || !local) {
      alert("please insert all fields")
      return;
    }
    
    const data = { 
      id,
      name: title,
      date: moment(start).format("DD/MM/YYYY"),
      hour: moment(end).format("HH:mm"),
      local: local

      // id, title, start, end 
    };
    if (!edit) {
      await addCalendar(data);
    } else {
      await editCalendar(data);
    }
    const response = await getCalendar();

    const evs = response.data.result.map(d => {
      let dateObject = moment(d.date + " " + d.hour, "DD/MM/YYYY HH:mm").toDate();
      return {
        ...d,
        title: d.name,
        start: dateObject,
        end: dateObject,
      };
    });
    calendarStore.setCalendarEvents(evs);
    onCancel();
  };
  const handleStartChange = date => setStart(date);
  const handleEndChange = date => setEnd(date);
  const handleTitleChange = ev => setTitle(ev.target.value);
  const handleLocalChange = ev => setLocal(ev.target.value);

  const deleteCalendarEvent = async () => {
    await deleteCalendar(calendarEvent.id);
    const response = await getCalendar();

    const evs = response.data.result.map(d => {
      let dateObject = moment(d.date + " " + d.hour, "DD/MM/YYYY HH:mm").toDate();
      return {
        ...d,
        title: d.name,
        start: dateObject,
        end: dateObject,
      };
    });
    calendarStore.setCalendarEvents(evs);
    onCancel();
  };
  
  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} md="12" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            placeholder="Title"
            value={title || ""}
            onChange={handleTitleChange}
            isInvalid={!title}
          />
          <Form.Control.Feedback type="invalid">{!title}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} md="12" controlId="local">
          <Form.Label>Local</Form.Label>
          <Form.Control
            type="text"
            name="local"
            placeholder="Local"
            value={local || ""}
            onChange={handleLocalChange}
            isInvalid={!local}
          />
          <Form.Control.Feedback type="invalid">{!local}</Form.Control.Feedback>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} md="12" controlId="start">
          <Form.Label>Date</Form.Label>
          <br />
          <DatePicker
            className="form-control"
            selected={start}
            onChange={handleStartChange}
            dateFormat="dd/MM/yyyy"
          />
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} md="12" controlId="end">
          <Form.Label>Hour</Form.Label>
          <br />
          <DatePicker
            className="form-control"
            selected={end}
            onChange={handleEndChange}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="HH:mm"
            timeFormat="HH:mm"
          />
        </Form.Group>
      </Form.Row>
      <Button type="submit" style={buttonStyle}>
        Save
      </Button>
      <Button type="button" style={buttonStyle} onClick={deleteCalendarEvent}>
        Delete
      </Button>
      <Button type="button" onClick={onCancel}>
        Cancel
      </Button>
    </Form>
  );
}

export default observer(CalendarForm);
