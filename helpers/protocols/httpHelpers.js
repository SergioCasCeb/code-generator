/**
 * All HTTP protocol specific helper functions are de
 */

export function getSubprotocol(form, operation) {
    if(form["subprotocol"]) {
        return form["subprotocol"];
    }else {
        if(operation == "observeproperty" || operation == "unobserveproperty" || operation == "subscribeevent" || operation == "unsubscribeevent") {
            return 'sse';
        }else{
            return null;
        }
    }
}

export function getMethod(form, operation) {

    if(form["htv:methodName"]){
        return form["htv:methodName"];
    }else{
        if(operation == "observerproperty" || operation == "unobserveproperty" || operation == "subscribeevent" || operation == "unsubscribeevent" || operation == "readproperty") {
            return "GET";
        }
        else if(operation == "invokeaction") {
            return "POST";
        }
        else if(operation == "writeproperty") {
            return "PUT";
        }
        else {
            return null;
        }
    }
}

export function getContentType(form) {
    if(form["contentType"]){
        return form["contentType"];
    }else{
        return "application/json";
    }
}