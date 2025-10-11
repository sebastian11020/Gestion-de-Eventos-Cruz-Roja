export const register = (userName, password) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Registro exitoso</title>
  <style>
    body {
      font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
      background-color: #f4f6fb;
      margin: 0;
      padding: 0;
      color: #1a1a1a;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }
    .header {
      background-color: #1e3a8a; /* Azul principal */
      color: #ffffff;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 10px 0 0;
      font-size: 32px;
      font-weight: bold;
    }
    .header img {
      width: 100px;
      border-radius: 50%;
    }
    .content {
      padding: 35px 40px;
      text-align: left;
    }
    .content p {
      font-size: 16px;
      line-height: 1.5;
      margin: 10px 0;
    }
    .credentials {
      margin: 25px 0;
      background-color: #e8eefc; /* Azul claro */
      border-left: 5px solid #dc2626; /* Rojo */
      border-radius: 8px;
      padding: 15px 20px;
    }
    .credentials p {
      margin: 8px 0;
      font-size: 15px;
      color: #1e293b;
    }
    .credentials strong {
      color: #000;
    }
    .button-container {
      text-align: center;
      margin-top: 30px;
    }
    .button {
      display: inline-block;
      background-color: #1e3a8a; /* Azul principal */
      color: #ffffff;
      padding: 12px 28px;
      text-decoration: none;
      border-radius: 6px;
      font-size: 18px;
      border: 2px solid #dc2626; /* Detalle rojo */
      transition: all 0.3s ease;
    }
    .button:hover {
      background-color: #dc2626;
      border-color: #1e3a8a;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      padding: 15px 0;
      background: #f0f0f0;
      border-top: 1px solid #ddd;
    }
    @media (max-width: 600px) {
      .content {
        padding: 25px 20px;
      }
      .header h1 {
        font-size: 26px;
      }
      .button {
        font-size: 16px;
        padding: 10px 22px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://flkuxwv.stripocdn.email/content/guids/CABINET_b2c0215903a7145a106f063e4002c09706d0d9c5fff67686e488ebbe13cc39d7/images/accounthasbeenverifiedregisteredconceptillustrationflatdesigneps10moderngraphiceleme.jpg" alt="Registro exitoso" />
      <h1>Registro exitoso</h1>
    </div>

    <div class="content">
      <p>¡Bienvenido a la farmacéutica!</p>
      <p>Tu cuenta ha sido creada correctamente. A continuación encontrarás tus credenciales de acceso:</p>

      <div class="credentials">
        <p><strong>Usuario:</strong> ${userName}</p>
        <p><strong>Contraseña:</strong> ${password}</p>
      </div>

      <div class="button-container">
        <a href="http://localhost:3000/login" class="button" target="_blank">Ir a la página principal</a>
      </div>
    </div>

    <div class="footer">
      <p>© 2025 Farmacéutica — Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;
