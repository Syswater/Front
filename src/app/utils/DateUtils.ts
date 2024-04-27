import * as moment from "moment-timezone";

const tz = 'America/Bogota'

export function getCurrentDate(format?: string){
    if(format == 'ISO') return moment.utc().tz(tz).toISOString()
    return moment.utc().tz(tz).format()
}