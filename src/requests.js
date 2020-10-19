const APIURL = "http://localhost:3030/api";
const axios = require("axios");

export const getCalendar = () => axios.get(`${APIURL}/appointments?nolimit=true`);

export const addCalendar = data => axios.post(`${APIURL}/appointments`, data);

export const editCalendar = data =>
  axios.put(`${APIURL}/appointments/${data.id}`, data);

export const deleteCalendar = id => axios.delete(`${APIURL}/appointments/${id}`);
