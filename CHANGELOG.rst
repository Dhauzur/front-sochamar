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
* Agregado CRUDV de compañias y habitaciones
* Agregado login y register (Falta renovacion al refrescar pagina)
* Agregado catch de errores 401 vuelta al login
* Agregado CRUD de pasajeros, con sus documentos y avatar
* Corregido errores de CSS en navbar para el usuario logeado
* Mejorado CSS de card a estilo ya usado por la App

`0.0.0`_ (2020-02-01) (Mauro)
-------------------------
* Agregado mensajes que restringen la usabilidad del timeline, si no se ha selecionado una entidad previamente
* Restricción si se indica un numero mayor de servicios a usar en una hospedaje de lo que permite una habitación
* Corregido error que habilita la ediccion si el usuario hace doble click en un hospedaje y habilita el modo de edicion
* Reemplazado componente BoostrapVue de alert, que recibia un msj y dejaba 20 segundos en pantalla. Ahora se utiliza un toasted con un watch
