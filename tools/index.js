export const Tools = {

    uuid(a) {
        return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, this.uuid);
    },

    formatDate(time, format) {
        time = time instanceof Date? time : new Date(time);
        format = format || "dd/mm/yyyy hh:MM:ss";
        const year = time.getFullYear();
        const month = time.getMonth() + 1;
        const date = time.getDate();
        const hours = time.getHours();
        const minutes = time.getMinutes();
        const seconds = time.getSeconds();
        const add0 = t => t < 10 ? "0" + t : t;
        const replacement = {
            "yyyy": year,
            "mm": add0(month),
            "m": month,
            "dd": add0(date),
            "d": date,
            "hh": add0(hours),
            "h": hours,
            "MM": add0(minutes),
            "M": minutes,
            "ss": add0(seconds),
            "s": seconds
        };
        for (let k in replacement) {
            format = format.replace(k, replacement[k]);
        }
        return format;
    }

};