import * as moment from "moment-timezone";

const tz = 'America/Bogota'

export function getCurrentDate(format?: string){
    return moment.utc().tz(tz).format(format)
}

export function formatDate(date:string, format?:string){
    return moment.utc(date).format(format)
}

export function getStartDayCurrent(){
    return moment().tz(tz).startOf('day');
}

export function getLastDateOf(amount: moment.DurationInputArg1, duration: moment.DurationInputArg2){
    return moment().tz(tz).subtract(amount, duration);
}
