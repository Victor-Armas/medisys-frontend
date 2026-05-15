import React from "react";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-200">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Política de Privacidad</h1>
          </div>
          <p className="text-slate-500">
            <strong>Fecha de última actualización:</strong> 14 de Mayo de 2026
            <br />
            <strong>Aplicación:</strong> Sistema Avanzado de Gestión de Consultorios
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <p>
              En el <strong>Sistema Avanzado de Gestión de Consultorios</strong> , valoramos y respetamos la privacidad de
              nuestros usuarios y pacientes. Esta Política de Privacidad describe cómo recopilamos, utilizamos, protegemos y
              compartimos la información personal al utilizar nuestros servicios de salud digital, incluyendo la integración con
              la <strong>API de WhatsApp de Meta</strong> y <strong>WhatsApp Flows</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Información que Recopilamos
            </h2>
            <p className="mb-3">Para proveer nuestro ecosistema de gestión médica, recopilamos la siguiente información:</p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>Datos de Identidad y Contacto:</strong> Nombre completo, número de teléfono (incluyendo el número asociado
                a WhatsApp), correo electrónico, fecha de nacimiento, estado civil y domicilio.
              </li>
              <li>
                <strong>Datos Sensibles de Salud:</strong> Información del expediente clínico electrónico, signos vitales,
                diagnósticos (CIE-10), antecedentes patológicos y heredofamiliares, estudios de laboratorio y recetas médicas
                emitidas.
              </li>
              <li>
                <strong>Datos de Uso e Interacción:</strong> Historial de consultas médicas, interacción con nuestros Flows de
                WhatsApp para agendamiento de citas, y actividad dentro del portal del paciente.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Uso de la Información
            </h2>
            <p className="mb-3">
              Los datos recopilados son estrictamente utilizados para los fines del servicio médico, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Coordinar, agendar y confirmar citas médicas a través de la plataforma web y WhatsApp.</li>
              <li>Mantener el expediente clínico electrónico alineado a normativas oficiales.</li>
              <li>Generar, almacenar y permitir la descarga segura de recetas médicas en formato PDF.</li>
              <li>
                Garantizar el correcto funcionamiento del modelo multi-consultorio asegurando que cada médico únicamente acceda a
                los pacientes bajo su jurisdicción clínica.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Cumplimiento y Uso de Datos de la Plataforma de Meta
            </h2>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <p className="mb-4 text-blue-900">
                <strong>Declaración sobre la API de WhatsApp y Meta:</strong> Nuestra aplicación utiliza la API oficial de
                WhatsApp para interactuar con los pacientes. La información intercambiada a través de los WhatsApp Flows (como
                selección de clínicas, horarios y motivos de consulta) viaja protegida mediante protocolos criptográficos robustos
                (RSA-OAEP y AES-128-GCM) durante el intercambio de datos con nuestros servidores.
              </p>
              <p className="text-blue-900">
                <strong>
                  El Sistema Avanzado de Gestión de Consultorios NO utiliza los datos provenientes de la Plataforma de Meta para
                  fines de publicidad, marketing, creación de perfiles comerciales (profiling) ni venta a terceros.
                </strong>{" "}
                Los datos obtenidos vía WhatsApp se utilizan exclusiva y transitoriamente para la prestación del servicio médico y
                la gestión operativa de la clínica.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Transferencia y Compartición de Datos
            </h2>
            <p className="mb-3">
              <strong>Bajo ninguna circunstancia vendemos su información personal o clínica.</strong> Su información solo se
              comparte con:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>
                <strong>El Personal Clínico Autorizado:</strong> Médicos tratantes y recepcionistas adscritos a la clínica
                correspondiente, regidos por un estricto Control de Acceso Basado en Roles (RBAC).
              </li>
              <li>
                <strong>Proveedores de Infraestructura (Subprocesadores):</strong> Proveedores de alojamiento en la nube (ej.
                bases de datos seguras y resguardo de documentos/PDFs cifrados) que cumplen con normativas de seguridad
                internacionales.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Seguridad de la Información
            </h2>
            <p>
              Implementamos medidas de seguridad técnicas y arquitectónicas de grado médico para evitar la pérdida, mal uso,
              acceso no autorizado o alteración de sus datos. Esto incluye encriptación en tránsito (HTTPS/SSL), manejo seguro de
              llaves de desencriptación y segmentación estricta de bases de datos relacionales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Retención y Eliminación de Datos (Derechos ARCO)
            </h2>
            <p className="mb-4">
              Los expedientes clínicos se retienen por el tiempo mínimo obligatorio que exigen las leyes sanitarias
              correspondientes. Sin embargo, como usuario, usted goza de los derechos de Acceso, Rectificación, Cancelación y
              Oposición (ARCO).
            </p>
            <div className="bg-slate-100 p-6 rounded-lg">
              <h3 className="font-semibold text-slate-800 mb-2">Solicitud de Eliminación de Datos (Data Deletion)</h3>
              <p className="text-slate-600 text-sm">
                En cumplimiento con los requerimientos de la Plataforma de Meta, si desea revocar su consentimiento para recibir
                comunicaciones vía WhatsApp o solicitar la eliminación de su cuenta y datos personales, puede dirigir su solicitud
                a: <strong>dracarolina.cervantesa@gmail.com</strong>. Procesaremos las solicitudes de borrado en un plazo máximo
                de 30 días hábiles, eliminando toda la información que no estemos obligados legalmente a conservar por normativa
                sanitaria.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Actualizaciones de la Política
            </h2>
            <p>
              Esta política podrá actualizarse de forma periódica. Notificaremos sobre cambios sustanciales a través del portal o,
              si el impacto a la privacidad es mayor, mediante una comunicación directa.
            </p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
          Este documento ha sido redactado específicamente para dar cumplimiento a los Términos de la Plataforma de Meta para
          Desarrolladores y garantizar un uso transparente de la API de WhatsApp.
        </div>
      </div>
    </div>
  );
}
