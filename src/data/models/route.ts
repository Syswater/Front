export interface Route {
    id: number,
    name: string,
    location: string,
    weekdays: string[],
    price: number
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

export function mapWeekdaysToBooleanArray(weekdays: string[]): { [key in DayOfWeek]: boolean } {

    const result: { [key in DayOfWeek]: boolean } = {
        [DayOfWeek["Monday"]]: false,
        [DayOfWeek["Tuesday"]]: false,
        [DayOfWeek["Wednesday"]]: false,
        [DayOfWeek["Thursday"]]: false,
        [DayOfWeek["Friday"]]: false,
        [DayOfWeek["Saturday"]]: false,
        [DayOfWeek["Sunday"]]: false
    };

    weekdays.forEach(day => {
        result[day as DayOfWeek] = true;
    });

    return result;
}


export function translateWeekdaysToSpanish(route: Route): Route {
    const translatedWeekdays = route.weekdays.map(day => {
        const translatedDay = DayOfWeek[day as keyof typeof DayOfWeek];
        return translatedDay ? translatedDay : day;
    });

    return { ...route, weekdays: translatedWeekdays };
}