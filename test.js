import http from 'k6/http';
import { sleep } from 'k6';

// Cargar la colección de Postman desde el archivo JSON
let collection = JSON.parse(open('colect.json'));

// Definir la función para ejecutar las solicitudes de la colección
function runCollection() {
    collection.item.forEach((item) => {
        if (item.request) {
            
            let request = item.request;
            let method = request.method.toUpperCase();
            let url = request.url.raw;
            let headers = {};
            request.header.forEach((header) => {
                headers[header.key] = header.value;
            });
            let body = request.body ? JSON.stringify(request.body) : null;
            
            
            let res = http.request(method, url, { headers: headers, body: body });
            
            
            console.log(`Solicitud ${method} ${url}: Código ${res.status}, Duración ${res.timings.duration}ms`);
        }
    });
}

export default function () {
    
    runCollection();
    
    sleep(1);
}

