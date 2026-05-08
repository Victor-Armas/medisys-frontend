// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 1. Tipamos los roles exactos que tienes en tu BD
type Role = "ADMIN_SYSTEM" | "MAIN_DOCTOR" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";

// 2. Mapa de permisos por ruta (SRP y Escalabilidad)
const routePermissions: Record<string, Role[]> = {
  "/dashboard": ["ADMIN_SYSTEM", "MAIN_DOCTOR"],
  "/clinics": ["ADMIN_SYSTEM", "MAIN_DOCTOR"],
  "/users": ["ADMIN_SYSTEM", "MAIN_DOCTOR"],
  "/settings": ["ADMIN_SYSTEM", "MAIN_DOCTOR"],
  "/admin/consultations": ["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR"],
  "/admin/patients": ["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"],
  "/appointments": ["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"],
  "/change-password": ["ADMIN_SYSTEM", "MAIN_DOCTOR", "DOCTOR", "RECEPTIONIST"],
};

const publicRoutes = ["/login"];

// 3. Función NATIVA para decodificar JWT sin usar librerías externas (KISS)
function decodeJwtRole(token: string): Role | null {
  try {
    const base64Url = token.split(".")[1];
    // Reemplazamos caracteres especiales de Base64Url a Base64 estándar
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Decodificamos el Base64 y evitamos problemas con caracteres Unicode
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch {
    return null; // Si el token está malformado, fallamos silenciosamente
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // EXCEPCIÓN CRÍTICA: Ignorar estáticos e internos
  if (pathname.startsWith("/_next") || pathname.includes("/api/") || pathname.includes(".")) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.includes(pathname);

  // Parseamos el usuario de la cookie para revisar mustChangePassword
  let mustChangePassword = false;
  const userCookie = request.cookies.get("user")?.value;
  if (userCookie) {
    try {
      const userStr = userCookie.startsWith("%") ? decodeURIComponent(userCookie) : userCookie;
      const userObj = JSON.parse(userStr);
      mustChangePassword = userObj?.mustChangePassword === true;
    } catch (error) {
      console.error("[Proxy] Error al parsear la cookie del usuario:", error);
    }
  }

  // Regla A: Sin token intentando acceder a zona protegida -> Al login
  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Regla EXTRA (Seguridad Crítica): Si debe cambiar contraseña, ATRAPARLO
  if (token && mustChangePassword && pathname !== "/change-password") {
    return NextResponse.redirect(new URL("/change-password", request.url));
  }

  // Regla B: Con token intentando acceder a zona pública -> A su zona principal
  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(mustChangePassword ? "/change-password" : "/dashboard", request.url));
  }

  // Regla C: RBAC Nativo (Verificación de Roles)
  if (token && !isPublicRoute) {
    const userRole = decodeJwtRole(token);

    const requiredRolesEntry = Object.entries(routePermissions).find(([route]) => pathname.startsWith(route));

    // Si la ruta requiere un rol que el usuario no tiene
    if (requiredRolesEntry && userRole && !requiredRolesEntry[1].includes(userRole)) {
      // Aterrizaje Suave según el rol real del usuario
      if (userRole === "DOCTOR" || userRole === "RECEPTIONIST") {
        return NextResponse.redirect(new URL("/appointments", request.url));
      }

      if (userRole === "PATIENT") {
        return NextResponse.redirect(new URL("/portal-paciente", request.url));
      }

      // Fallback
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    // Si la decodificación falló por un token inválido, forzamos login
    if (!userRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher más agresivo para evitar interceptar estáticos
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*$).*)"],
};
