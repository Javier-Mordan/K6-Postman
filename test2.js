import http from 'k6/http';
import { check, sleep } from 'k6';

// Definir la URL base de la API del proyecto XYZ
const baseURL = 'https://pokeapi.co/api/v2/pokemon'; // Reemplaza 'example.com/api' con la URL real de tu API

export default function () {
    // Paso 1: Creación de un nuevo usuario
    let createUserPayload = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123'
    };

    let createUserResponse = http.post(`${baseURL}/users`, JSON.stringify(createUserPayload), {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Verificar que la creación del usuario fue exitosa (código de estado HTTP 201)
    check(createUserResponse, {
        'Usuario creado exitosamente': (res) => res.status === 201
    });

    // Extraer el ID del usuario recién creado
    let userId = JSON.parse(createUserResponse.body).id;

    // Paso 2: Obtención del perfil del usuario creado
    let getUserResponse = http.get(`${baseURL}/users/${userId}`);

    // Verificar que la obtención del perfil del usuario fue exitosa (código de estado HTTP 200)
    check(getUserResponse, {
        'Perfil de usuario obtenido exitosamente': (res) => res.status === 200
    });

    // Verificar que la información del perfil obtenido coincide con los datos proporcionados durante la creación del usuario
    let userProfile = JSON.parse(getUserResponse.body);
    check(userProfile, {
        'Nombre de usuario coincide': () => userProfile.name === createUserPayload.name,
        'Correo electrónico de usuario coincide': () => userProfile.email === createUserPayload.email
    });

    // Esperar un tiempo antes de la siguiente ejecución
    sleep(1);
}
