export interface Route {
    id: number,
    name: string,
    location: string,
    weekdays: string[],
    price: number,
    status?: RouteStatus,
    distribution_id?: number
}

export enum DayOfWeek {
    Monday = "Lunes",
    Tuesday = "Martes",
    Wednesday = "Miércoles",
    Thursday = "Jueves",
    Friday = "Viernes",
    Saturday = "Sábado",
    Sunday = "Domingo"
}


export enum RouteStatus {
    PREORDER = "Preventa",
    OPENED = "Abierta",
    CLOSE_REQUEST = "Solicitud de cierre",
    CLOSED = "Cerrada",
    WHITOUT = "Sin distribuciones"
}


export function translateWeekdaysToSpanish(route: Route): Route {
    const translatedWeekdays = route.weekdays.map(day => {
        const translatedDay = DayOfWeek[day as keyof typeof DayOfWeek];
        return translatedDay ? translatedDay : day;
    });

    return { ...route, weekdays: translatedWeekdays };
}