const eventsMap = {};

class EventsHandler {

    on(eventName, callback, context) {
        if(!eventsMap[eventName]){
            eventsMap[eventName] = [];
        }
        eventsMap[eventName].push({callback, context})
    }

    off(eventName, callback) {
        if(!eventsMap[eventName]){
            return;
        }
        const index = eventsMap[eventName].findIndex(event => event.callback === callback);
        if(index > -1) {
            eventsMap[eventName].splice(index, 1);
        }
    }

    emit(eventName, data) {
        if(!eventsMap[eventName]){
            return;
        }

        eventsMap[eventName].forEach(listener => listener.callback.call(listener.context, data));
    }
}


export const Events = new EventsHandler();