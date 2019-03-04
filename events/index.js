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

        eventsMap[eventName].forEach(listener => setTimeout(() => listener.callback.call(listener.context, data)));
    }
}

// aliased for compatibility
EventsHandler.prototype.addEventListener = EventsHandler.prototype.on;
EventsHandler.prototype.removeEventListener = EventsHandler.prototype.off;
EventsHandler.prototype.dispatchEvent = EventsHandler.prototype.emit;


export const Events = new EventsHandler();