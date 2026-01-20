import request from '.';


const prayerApi = {
    getForTime: (date: string, data: any,) => request.get(`/timings/${date}`, {
        params: {
            latitude: data.latitude,
            longitude: data.longitude,
        },
    }),
    getTimesHijriMonth: (year: string, month: string, data: any) => request.get(`/hijriCalendar/${year}/${month}`, data),
}



export {
    prayerApi,
}