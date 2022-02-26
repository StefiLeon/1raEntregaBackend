//Registro
let formRegister = document.getElementById('registerForm');
formRegister.addEventListener('submit', function(e) {
    let data = new FormData(formRegister);
    let prepObject = {
        nombre: data.get('nombre'),
        apellido: data.get('apellido'),
        edad: data.get('edad'),
        alias: data.get('alias'),
        email: data.get('email'),
        password: data.get('password')
    }
    fetch('/pages/register', {
        method: "POST",
        body: JSON.stringify(prepObject),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(result => result.json())
    .then(response => {
        if(response.status==="success"){
            form.reset();
            console.log('llego');
            alert('Usuario registrado.');
            location.replace('../pages/chat.html');
        } else {
            alert('No se registro al usuario correctamente.')
        }
    })
})