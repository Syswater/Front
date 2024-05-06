import * as moment from "moment-timezone";

const tz = 'America/Bogota'

export function getCurrentDate(format?: string){
    return moment.utc().tz(tz).format(format)
}