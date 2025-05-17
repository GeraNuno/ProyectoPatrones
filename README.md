## Patrones de Diseño Implementados

En este proyecto se aplicaron varios patrones de diseño para lograr un backend modular, escalable y mantenible. A continuación se describen cada uno y la razón por la cual fueron elegidos:

### Singleton  
Se utilizó para manejar la conexión única a la base de datos, evitando múltiples conexiones simultáneas y facilitando el control centralizado del acceso a MongoDB.

---

### Factory Method  
Se implementó para la creación de productos, marcas y líneas de producto, facilitando la creación de variantes sin acoplar el código a clases concretas. Esto mejora la escalabilidad y permite agregar nuevas entidades sin modificar el código existente.

---

### Adapter  
Se usó para adaptar diferentes formatos y variantes de productos bajo la misma marca y línea, unificando la forma en que se manejan los datos internamente sin importar sus diferencias originales.

---

### Memento   
Se aplicó para gestionar el estado del carrito de ventas, permitiendo recuperar y actualizar el contenido sin pérdida de datos, mejorando la experiencia de usuario y el control de estados.

---

### VMC (Vista - Modelo - Controlador)    
Se utilizó para estructurar el backend de forma modular y clara, facilitando mantenimiento, pruebas y escalabilidad, evitando código monolítico, favoreciendo el trabajo en equipo y ayudando a que el backend esté mejor organizado para evitar complejidades.

---

## Diagrama UML de Clases UML

```mermaid
classDiagram
direction TB
    class Usuario {
	    +registrarProducto()
	    +verProductos()
	    +agregarAlCarrito()
	    +hacerPedido()
    }
    class Administrador {
	    +crearMarca()
	    +crearLinea()
	    +gestionarProductos()
	    +verPedidos()
    }
    class MongoDBConnection {
	    - static instance : MongoDBConnection
	    + getInstance() : MongoDBConnection
	    + connect() : void
    }
    class MarcaFactory {
	    +crearMarca(nombre) : Marca
    }
    class Marca {
	    - nombre : String
    }
    class LineaFactory {
	    +crearLinea(nombre, marca) : LineaProducto
    }
    class LineaProducto {
	    - nombre : String
	    - marca : Marca
    }
    class ProductoFactory {
	    +crearProducto(nombre, marca, linea, presentaciones) : Producto
    }
    class Producto {
	    - nombre : String
	    - marca : Marca
	    - linea : LineaProducto
	    - presentaciones : Presentacion[]
    }
    class Presentacion {
	    - mililitros : Number
	    - precio : Number
	    - stock : Number
	    - imagenes : URL[]
    }
    class CarritoItem {
	    - producto : Producto
	    - tipoPresentacion : Number
	    - cantidad : Number
    }
    class AdaptadorProductoPedido {
	    +adaptar(item : CarritoItem) : ProductoPedidoAdaptado
    }
    class ProductoPedidoAdaptado {
	    - nombre : String
	    - presentacion : String
	    - cantidad : Number
    }
    class Carrito {
	    - items : CarritoItem[]
	    + obtenerEstado() : EstadoCarrito
	    + restaurarEstado(estado : EstadoCarrito) : void
    }
    class EstadoCarrito {
	    - snapshot : CarritoItem[]
    }
    class Pedido {
	    - productosPedido : ProductoPedidoAdaptado[]
	    + generarDesdeCarrito(carrito : Carrito) : Pedido
    }
    class RutasProducto {
	    + POST /registroProducto
	    + GET /productos
    }
    class ControladorProducto {
	    +registrarProducto()
	    +listarProductos()
    }
    class ModeloProducto {
	    - esquema Mongoose
    }

    MarcaFactory --> Marca
    LineaFactory --> LineaProducto
    ProductoFactory --> Producto
    Producto --> Presentacion
    LineaProducto --> Marca
    AdaptadorProductoPedido --> ProductoPedidoAdaptado
    Carrito --> EstadoCarrito
    Pedido --> AdaptadorProductoPedido : usa >>
    RutasProducto --> ControladorProducto
    ControladorProducto --> ModeloProducto
    Usuario --> ProductoFactory : crea producto >>
    Usuario --> LineaFactory : usa >>
    Usuario --> Carrito : agrega producto >>
    Usuario --> Pedido : genera pedido >>
    Usuario --> RutasProducto : accede API >>
    Usuario --> MongoDBConnection : conexión BD >>
    Administrador --> MarcaFactory : crea marca >>
    Administrador --> LineaFactory : crea línea >>
    Administrador --> ProductoFactory : gestiona productos >>
    Administrador --> Pedido : ve historial >>
    Administrador --> RutasProducto : accede rutas >>
    Administrador --> MongoDBConnection
    ModeloProducto --> MongoDBConnection
    Pedido --> MongoDBConnection
    Carrito --> MongoDBConnection

```

Al implementar estos patrones, logré que el backend sea mucho más organizado y fácil de mantener. Cada patrón cumple un propósito claro y juntos permiten que el sistema crezca sin que el código se vuelva un caos difícil de entender. Además, ayudan a que diferentes desarrolladores trabajen en el proyecto sin pisarse entre sí y facilitan la incorporación de nuevas funcionalidades en el futuro.

Este enfoque modular y escalable no solo hace que el desarrollo sea más eficiente, sino que también brinda confianza de que la aplicación podrá evolucionar con menos dolores de cabeza. En definitiva, usar estos patrones me permitió construir una base sólida, pensando en el presente y el futuro del proyecto.
