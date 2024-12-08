# Resources API
Una API RESTful creada en TypeScript utilizando **Deno**. Esta API gestiona recursos utilizando una arquitectura hexagonal y limpiar.
## Tecnologías
- **Deno**: Un entorno runtime seguro para TypeScript y JavaScript.
- **TypeScript**: Lenguaje utilizado para la implementación de la API.
## Requisitos
1. **Instalar Deno**  
   Descarga e instala Deno desde su página oficial: [Deno](https://deno.land/).
2. **Clonar el repositorio**  
   Clona este proyecto en tu máquina local:
   ```bash
   git clone https://github.com/Noctis-Dev/sci-all-resources-api.git
   cd sci-all-resources-api
Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto con las configuraciones necesarias para conectar a cualquier base de datos u otros servicios (si aplica). Revisa los valores en src/infrastructure/config.ts.
Cómo ejecutar la API
Opción 1: Ejecutar directamente con Deno
Permisos requeridos:
Esta API requiere ciertos permisos para ejecutarse. Puedes revisarlos en el archivo deno.json (si está configurado) o en la documentación.
Comando para iniciar la API:
Ejecuta el siguiente comando:
bash
Copiar código
deno run --allow-net --allow-env src/index.ts
Si estás utilizando más permisos (como acceso al sistema de archivos), agrégalos al comando.
Acceder a la API:
La API estará disponible por defecto en http://localhost:3000.
