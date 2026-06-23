# Frontend Despacho - Innovatech Chile

Aplicación web (React + Vite) para la gestión de ventas y despachos, consumiendo los microservicios backend desplegados en AWS EKS.

## Arquitectura

- **Framework**: React 18 + Vite
- **Estilos**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Servidor de producción**: Nginx (imagen Docker multi-stage)
- **Orquestación**: Kubernetes (AWS EKS)
- **CI/CD**: GitHub Actions (build con variables de entorno → push ECR → deploy EKS)

## Estructura de páginas

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Dashboard general con tarjetas informativas |
| `/ventas` | Ventas | CRUD completo de órdenes de compra (crear, editar, eliminar, listar) |
| `/usuarios` | Usuarios | Vista de roles y permisos del sistema |

## Variables de entorno

Este proyecto usa Vite, por lo que las variables se inyectan en **tiempo de build** (no en runtime):

| Variable | Descripción |
|----------|-------------|
| `VITE_API_VENTAS_URL` | URL pública del servicio backend-ventas |
| `VITE_API_DESPACHOS_URL` | URL pública del servicio backend-despachos |

Para desarrollo local, crea un archivo `.env` en la raíz: