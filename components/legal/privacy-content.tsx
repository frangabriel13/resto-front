import Link from "next/link";
import { customerRoutes } from "@/lib/customer/routes";
import { EntityField, LegalSection, Pending } from "./legal-page";

export function PrivacyContent() {
  return (
    <>
      <p>
        En esta política te contamos qué datos guarda Clubsy cuando te sumás al club de un local, para qué los usamos,
        quién los ve y cómo podés consultarlos, corregirlos o borrarlos, según la Ley 25.326 de Protección de los Datos
        Personales.
      </p>

      <LegalSection title="Quién es responsable de tus datos">
        <p>
          Clubsy es un servicio de <EntityField field="name" /> (CUIT <EntityField field="cuit" />), con domicilio en{" "}
          <EntityField field="address" />. Cada local adherido administra su propio club.
        </p>
        <p>
          <Pending>
            quién es el responsable de la base de datos frente a la ley: FullSync, cada comercio o ambos (por ejemplo, el
            comercio como responsable y FullSync como encargado del tratamiento), y su inscripción ante la Agencia de
            Acceso a la Información Pública
          </Pending>
        </p>
      </LegalSection>

      <LegalSection title="Qué datos guardamos">
        <ul>
          <li>
            <strong>Tu nombre y tu celular.</strong> El celular lo verificamos con un código de un solo uso.
          </li>
          <li>
            <strong>Tu actividad en cada club:</strong> cuándo te sumaste y desde qué local, tus sellos y canjes (fecha,
            hora y qué empleado los registró) y si saliste del club.
          </li>
          <li>
            <strong>Tus preferencias:</strong> si aceptaste recibir novedades de cada comercio, y cuándo lo aceptaste o lo
            revocaste.
          </li>
          <li>
            <strong>Datos técnicos:</strong> una cookie para mantener tu sesión abierta y, por unos minutos, la dirección IP
            desde la que te conectás, para frenar intentos de abuso.
          </li>
        </ul>
        <p>
          No pedimos ni leemos tus contactos, tu ubicación, el IMEI ni ningún otro dato de tu celular. Clubsy funciona en
          el navegador: no hay que instalar ninguna app.
        </p>
      </LegalSection>

      <LegalSection title="Para qué los usamos">
        <ul>
          <li>Para identificarte y mostrarte tu tarjeta desde cualquier celular.</li>
          <li>
            Para registrar tus sellos y canjes y evitar errores y usos indebidos, como sellos duplicados o seguidos.
          </li>
          <li>Para que cada comercio vea cómo funciona su club, por ejemplo cuántos clientes vuelven.</li>
          <li>
            Para que el comercio te mande novedades y promociones, <strong>solo si lo aceptaste</strong>. Es opcional,
            viene sin marcar y sumarte al club no implica aceptarlo. Podés revocarlo cuando quieras desde tu tarjeta.
          </li>
        </ul>
        <p>No vendemos tus datos ni los usamos para publicidad de terceros.</p>
      </LegalSection>

      <LegalSection title="Quién los ve">
        <ul>
          <li>
            <strong>Cada comercio ve solo a los clientes de su club:</strong> tu nombre, tu celular, tus sellos y tus
            canjes en ese club. Sus empleados ven el celular parcialmente oculto; el dueño lo ve completo y puede
            descargar la lista de clientes del club, que indica quién aceptó recibir novedades. Un comercio no ve tu
            actividad en otros clubes.
          </li>
          <li>
            <strong>Proveedores que nos ayudan a prestar el servicio:</strong> el alojamiento de la web y de la base de
            datos (Hostinger, con servidores en <Pending>país de los servidores</Pending>), el envío del código de verificación{" "}
            <Pending>proveedor del código por WhatsApp</Pending> y el registro de errores técnicos (Sentry, sin datos
            personales). Solo usan los datos para prestarnos ese servicio.
          </li>
          <li>Las autoridades, cuando la ley nos obligue.</li>
        </ul>
        <p>
          <Pending>
            base legal de la transferencia internacional de datos fuera de Argentina, según dónde estén los servidores y
            los proveedores (artículo 12 de la Ley 25.326)
          </Pending>
        </p>
      </LegalSection>

      <LegalSection title="Cuánto tiempo los guardamos">
        <ul>
          <li>Mientras tengas tu cuenta.</li>
          <li>
            Si salís de un club, el comercio conserva tu historial en ese club y, si volvés a sumarte, seguís donde
            estabas. Al salir se revoca tu aceptación de novedades.
          </li>
          <li>
            Si borrás tu cuenta, eliminamos tu nombre y tu celular y cerramos tus sesiones. Tus sellos y canjes quedan sin
            ningún dato que te identifique, solo para las estadísticas de cada comercio. No se puede deshacer.
          </li>
          <li>Los códigos de verificación vencen a los 10 minutos.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Tus derechos">
        <p>Podés acceder a tus datos, corregirlos, actualizarlos o pedir que los borremos:</p>
        <ul>
          <li>Tus sellos, canjes y preferencias los ves en tu tarjeta de cada club.</li>
          <li>Desde tu tarjeta podés revocar las novedades o salir del club.</li>
          <li>
            Desde <Link href={customerRoutes.account} className="underline underline-offset-4">Mi cuenta</Link> podés
            borrar tu cuenta.
          </li>
          <li>
            Para cualquier otro pedido, como cambiar tu nombre o recibir una copia de tus datos, escribinos a{" "}
            <EntityField field="email" />. Respondemos los pedidos de acceso dentro de los 10 días corridos y los de
            corrección o borrado dentro de los 5 días hábiles.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
          lo establecido en el artículo 14, inciso 3 de la Ley N.º 25.326. La Agencia de Acceso a la Información Pública,
          en su carácter de Órgano de Control de la Ley N.º 25.326, tiene la atribución de atender las denuncias y
          reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes
          en materia de protección de datos personales.
        </p>
      </LegalSection>

      <LegalSection title="Cómo los cuidamos">
        <p>
          Toda la comunicación viaja cifrada. Las sesiones y los códigos se guardan de forma que no puedan reutilizarse si
          alguien accediera a la base de datos, y los datos de cada comercio están separados de los de los demás.
        </p>
      </LegalSection>

      <LegalSection title="Cookies">
        <p>
          Usamos solo las cookies necesarias para mantener tu sesión abierta: una para los clientes y otra para el panel
          de los comercios. No usamos cookies de publicidad ni de analítica.
        </p>
      </LegalSection>

      <LegalSection title="Menores de edad">
        <p>
          <Pending>edad mínima para usar Clubsy y qué pasa si se suma un menor</Pending>
        </p>
      </LegalSection>

      <LegalSection title="Cambios en esta política">
        <p>
          Si cambiamos esta política, lo vas a ver en esta página con su fecha de actualización. Si el cambio es
          importante, te lo vamos a avisar en la web antes de que aplique.
        </p>
      </LegalSection>
    </>
  );
}
