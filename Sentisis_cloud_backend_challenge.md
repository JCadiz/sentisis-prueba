# Sentisis - Prueba de Desarrollo Backend

Desarrollar en Node.js con Typescipt un API que gestione una lista de tareas a realizar.

Como almacenamiento debe usar MongoDB con Mongoose.

El sistema ofrecerá API HTTP con tres endpoints, uno para añadir tareas, otro para marcarlas como realizadas y otro para comprobar el estado de la lista (tareas y su estado).

Se debe entregar un repo con:

* Un código funcional con un Dockerfile para construirlo y ejecutarlo.
* Un script llamado init-db.ts que al ejecutarlo en consola cargue datos iniciales de ejemplo.
* Un README con instrucciones de como ejecutar tanto la carga inicial de datos como el API, con comentarios sobre qué partes (supuestos) se han incluido y qué partes se han omitido, así como el razonamiento detrás de los elementos implementados.
* Un terraform con la creación de una instancia EC2 en AWS con acceso público al API
* Un pipeline de despliegue con Github Actions o CircleCI (a elección del candidato) donde se despliegue el aplicativo sobre la instancia EC2

La solución debe:

* considerarse lista para producción
* ser fácilmente extensible con nuevas funcionalidades
* desplegarse facilmente en AWS EC2

Dedícale el tiempo que consideres oportuno y con el que estés cómodo.
