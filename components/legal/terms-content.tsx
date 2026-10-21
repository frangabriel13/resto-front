import Link from "next/link";
import { customerRoutes } from "@/lib/customer/routes";
import { legalRoutes } from "@/lib/legal/document";
import { EntityField, LegalSection, Pending } from "./legal-page";

export function TermsContent() {
  return (
    <>
      <p>
        Estos términos explican cómo funciona Clubsy y qué podés esperar al usarlo. Al sumarte a un club o crear tu
        cuenta, los aceptás junto con la{" "}
        <Link href={legalRoutes.privacy} className="underline underline-offset-4">
          Política de privacidad
        </Link>
        .
      </p>

      <LegalSection title="Qué es Clubsy">
        <p>
          Clubsy es una tarjeta de sellos digital para los locales adheridos, prestada por <EntityField field="name" />.
          Cada local tiene su propio club y define su premio, cuántos sellos hacen falta y sus condiciones.
        </p>
      </LegalSection>

      <LegalSection title="Tu cuenta">
        <ul>
          <li>
            Ingresás con tu celular y un código que te mandamos. Usá un celular propio y datos verdaderos: tu cuenta es
            personal.
          </li>
          <li>Con la misma cuenta podés estar en los clubes de varios locales.</li>
          <li>Si usás un celular compartido, cerrá la sesión al terminar.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Cómo se suman los sellos">
        <ul>
          <li>
            <strong>Un consumo es un sello.</strong> Lo confirma un empleado del local escaneando el QR de tu tarjeta o
            buscándote por tu celular.
          </li>
          <li>Abrir la página del club o acercar el celular a la pieza del local no suma sellos.</li>
          <li>El QR de tu tarjeta se renueva solo cada pocos minutos: una captura de pantalla no sirve.</li>
          <li>Cada local puede fijar un tiempo mínimo entre un sello y el siguiente.</li>
          <li>Si un sello se cargó por error, el local puede anularlo. Lo vas a ver en tu historial.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Premios">
        <ul>
          <li>El premio, los sellos necesarios y las condiciones de cada club los ves en tu tarjeta.</li>
          <li>
            Para canjear, mostrás el QR de tu tarjeta en el local y un empleado confirma el canje. El premio lo entrega el
            local.
          </li>
          <li>
            Si el local cambia el premio, el nuevo vale desde tu próxima tarjeta: la que estás juntando mantiene el premio
            con el que empezó.
          </li>
          <li>Los sellos de más pasan a tu próxima tarjeta y no vencen.</li>
          <li>Los sellos y los premios no tienen valor en dinero, no se transfieren y no se cambian por dinero.</li>
        </ul>
        <p>
          <Pending>quién responde por la entrega del premio y sus condiciones: el local, FullSync o ambos</Pending>
        </p>
      </LegalSection>

      <LegalSection title="Si un club se pausa o termina">
        <ul>
          <li>
            Si el local pausa su club, no se suman sellos ni clientes nuevos, pero podés canjear una tarjeta completa.
          </li>
          <li>Si el local termina su club, ya no se suman sellos ni se canjean premios, y podés seguir viendo tu historial.</li>
        </ul>
        <p>
          <Pending>
            con cuánta anticipación avisa el local antes de terminar su club y qué pasa con las tarjetas completas o
            avanzadas
          </Pending>
        </p>
      </LegalSection>

      <LegalSection title="Reseñas">
        <p>
          El link para dejar una reseña en Google está a disposición de todos los clientes, sea cual sea su opinión, y no
          da sellos ni premios.
        </p>
      </LegalSection>

      <LegalSection title="Uso indebido">
        <p>
          No está permitido sumar sellos sin un consumo real, usar la cuenta de otra persona ni intentar alterar el QR o
          el sistema. Los sellos obtenidos así se pueden anular.
        </p>
        <p>
          <Pending>si se pueden suspender cuentas por uso indebido y cómo</Pending>
        </p>
      </LegalSection>

      <LegalSection title="Salir de un club o borrar tu cuenta">
        <ul>
          <li>
            Podés salir de un club desde tu tarjeta. Si volvés a sumarte, seguís con los sellos que tenías.
          </li>
          <li>
            Podés borrar tu cuenta desde{" "}
            <Link href={customerRoutes.account} className="underline underline-offset-4">
              Mi cuenta
            </Link>
            . Es definitivo: lo que pasa con tus datos está en la{" "}
            <Link href={legalRoutes.privacy} className="underline underline-offset-4">
              Política de privacidad
            </Link>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Disponibilidad del servicio">
        <p>
          Hacemos lo posible para que Clubsy funcione siempre, pero necesita conexión a internet: si en el local no hay
          conexión, el sello no se puede registrar en ese momento.
        </p>
        <p>
          <Pending>limitación de responsabilidad</Pending>
        </p>
      </LegalSection>

      <LegalSection title="Locales adheridos">
        <p>
          <Pending>
            el uso del panel por parte de los locales se rige por su acuerdo comercial con FullSync; definir si se menciona
            acá o en un documento aparte
          </Pending>
        </p>
      </LegalSection>

      <LegalSection title="Cambios en estos términos">
        <p>
          Si cambiamos estos términos, lo vas a ver en esta página con su fecha de actualización. Si el cambio es
          importante, te lo vamos a avisar en la web antes de que aplique.
        </p>
      </LegalSection>

      <LegalSection title="Ley aplicable y contacto">
        <p>
          Estos términos se rigen por las leyes de la República Argentina, incluida la Ley 24.240 de Defensa del
          Consumidor. <Pending>jurisdicción</Pending>
        </p>
        <p>
          Para consultas o reclamos, escribinos a <EntityField field="email" /> o a <EntityField field="address" />.
        </p>
      </LegalSection>
    </>
  );
}
