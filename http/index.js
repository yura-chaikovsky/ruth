export class HttpError extends Error {}
export class HttpHttpBadRequest extends HttpError {}
export class HttpUnauthorized extends HttpError {}
export class HttpForbidden extends HttpError {}
export class HttpNotFound extends HttpError {}
export class HttpConflict extends HttpError {}
export class HttpServerUnavailable extends HttpError {}
export class HttpNotImplemented extends HttpError {}

export class RuthHttp {

    static fetch(url, method, body, headers = {}) {

        if (!(body instanceof FormData)) {
            Object.assign(headers, {
                "Content-Type": "application/json"
            });
            body = JSON.stringify(body);
        }

        return fetch(url, {method, headers, body})
            .catch(error => {
                throw new HttpServerUnavailable();
            })
            .then(response => {
                switch (response.status) {
                    case 400:
                        throw new HttpBadRequest();
                    case 401:
                        throw new HttpUnauthorized();
                    case 403:
                        throw new HttpForbidden();
                    case 404:
                        throw new HttpNotFound();
                    case 409:
                        throw new HttpConflict();
                    case 500:
                        throw new HttpServerUnavailable();
                    case 501:
                        throw new HttpNotImplemented();
                }
                return response;
            })
            .then(function (response) {
                return response.status === 204? response.text() : response.json();
            });
    }

}