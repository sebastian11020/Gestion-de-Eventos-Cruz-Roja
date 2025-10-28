import { GetEventCardDDto } from '../../event/dto/get-event.dto';

export const TemplateNewEvent = (event: GetEventCardDDto) => {
  const skillsHtml =
    (event.skill_quota?.length ?? 0) > 0
      ? `
      <div style="margin-top:20px;">
        <h4 style="font-size:16px; margin-bottom:8px; color:#1e40af;">🎯 Cupos por habilidad</h4>
        <table style="width:100%; border-collapse:collapse; background:#f8fafc; border-radius:8px;">
          <thead>
            <tr style="background:#e2e8f0;">
              <th style="text-align:left; padding:8px 10px; font-size:14px;">Habilidad</th>
              <th style="text-align:right; padding:8px 10px; font-size:14px;">Cupos</th>
            </tr>
          </thead>
          <tbody>
            ${event.skill_quota
              .map(
                (s) => `
                <tr>
                  <td style="padding:6px 10px; border-bottom:1px solid #e5e7eb;">${s.name}</td>
                  <td style="padding:6px 10px; text-align:right; border-bottom:1px solid #e5e7eb;">${s.quantity}</td>
                </tr>`,
              )
              .join('')}
          </tbody>
        </table>
      </div>`
      : '';

  return `
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuevo evento disponible</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f5f6fa; font-family:Arial, sans-serif; color:#333;">

    <!-- Encabezado -->
    <table role="presentation" style="width:100%; border-collapse:collapse; background:#dbeafe;">
      <tr>
        <td style="padding:15px; text-align:center;">
          <h1 style="margin:0; font-size:20px; color:#1e3a8a;">
            🎉 ¡Hay un nuevo evento disponible!
          </h1>
        </td>
      </tr>
    </table>

    <!-- Tarjeta del evento -->
    <table role="presentation" style="width:100%; border-collapse:collapse;">
      <tr>
        <td align="center" style="padding: 30px 15px;">
          <table role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.08);">

            <!-- Cabecera del evento -->
            <tr>
              <td style="background:linear-gradient(135deg,#2563eb,#1e40af); color:white; padding:20px 25px; text-align:center;">
                <h2 style="margin:0; font-size:22px;">${event.title}</h2>
                <p style="margin:4px 0 0; font-size:14px;">${event.state}</p>
              </td>
            </tr>

            <!-- Contenido -->
            <tr>
              <td style="padding:25px;">
                <p style="margin:0 0 15px; font-size:15px; line-height:1.5;">
                  ${event.description}
                </p>

                <table style="width:100%; border-collapse:collapse;">
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">📍 Municipio:</td>
                    <td style="padding:8px 0;">${event.location}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">🏠 Dirección:</td>
                    <td style="padding:8px 0;">${event.streetAddress}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">🗓️ Fecha inicio:</td>
                    <td style="padding:8px 0;">${event.startDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">⏰ Fecha fin:</td>
                    <td style="padding:8px 0;">${event.endDate}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">👤 Responsable:</td>
                    <td style="padding:8px 0;">${event.leader.name}</td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0; font-weight:bold;">👥 Capacidad total:</td>
                    <td style="padding:8px 0;">${event.capacity} voluntarios</td>
                  </tr>
                </table>

                ${skillsHtml}
              </td>
            </tr>

            <!-- Botón -->
            <tr>
              <td align="center" style="padding:20px;">
                <a
                  href="http://localhost:3000" 
                  style="
                    display:inline-block;
                    background:#2563eb;
                    color:#ffffff;
                    text-decoration:none;
                    padding:12px 24px;
                    border-radius:8px;
                    font-size:15px;
                    font-weight:bold;
                    transition:background 0.3s ease;
                  "
                  target="_blank"
                >
                  Ir a la página principal
                </a>
              </td>
            </tr>

         
            <tr>
              <td style="background:#f1f5f9; text-align:center; padding:15px; font-size:13px; color:#64748b;">
                © 2025 Cruz Roja Colombiana • Sistema de Gestión de Eventos
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
