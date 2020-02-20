==========
Change Log
==========

Usar las siguientes palabras al inicio para añadir registros

* Eliminado
* Agregado
* Remplazado
* Corregido
* Mejorado
* Restricción

Se debe seguir este mismo esquema, previamente a solicitar el PR.

`0.0.1`_ (2020-02-09) (Mauro, Jesus, Javier)
-------------------------
* Agregado eslit+prettier
* Agregado CRUDV de compañias y habitaciones
* Agregado login y register (Falta renovacion al refrescar pagina)
* Agregado catch de errores 401 vuelta al login
* Agregado CRUD de pasajeros, con sus documentos y avatar
* Corregido errores de CSS en navbar para el usuario logeado
* Mejorado CSS de card a estilo ya usado por la App
* Agregada eliminacion en cascada para rooms y companies sobre los lodgings. Toasted informa de lodgings afectados
* Se cambian nombres de rutas, y /home principal
* Agregada nueva ruta "payments", donde se podra gestionar los pagos
* Agregado autocomplete a lodginds, para agregar pasajeros
* En pagospasajeros filtrados por atributos
* Seleccion de pago por fecha o por lodgind ya creado
* Se elimanron restricciones para crear a pasageros
* El total del pago se calculara automaticamente
* Agregado atributo jefatura y subordinados
* Recortado a 10 caracteres el nombre que se muestra en documentos(pagos y pasajeros)

`0.0.0`_ (2020-02-01) (Mauro)
-------------------------
* Agregado mensajes que restringen la usabilidad del timeline, si no se ha selecionado una entidad previamente
* Restricción si se indica un numero mayor de servicios a usar en una hospedaje de lo que permite una habitación
* Corregido error que habilita la ediccion si el usuario hace doble click en un hospedaje y habilita el modo de edicion
* Reemplazado componente BoostrapVue de alert, que recibia un msj y dejaba 20 segundos en pantalla. Ahora se utiliza un toasted con un watch
