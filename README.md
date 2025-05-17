## Patrones de Diseño Implementados

En este proyecto se aplicaron varios patrones de diseño para lograr un backend modular, escalable y mantenible. A continuación se describen cada uno y la razón por la cual fueron elegidos:

### Singleton  
**¿Qué es?**  
Garantiza que una clase tenga una única instancia y proporciona un punto global de acceso a ella.

**¿Por qué se usó?**  
Se utilizó para manejar la conexión única a la base de datos, evitando múltiples conexiones simultáneas y facilitando el control centralizado del acceso a MongoDB.

---

### Factory Method  
**¿Qué es?**  
Define una interfaz para crear objetos, dejando que las subclases decidan qué clase instanciar.

**¿Por qué se usó?**  
Se implementó para la creación de productos, marcas y líneas de producto, facilitando la creación de variantes sin acoplar el código a clases concretas. Esto mejora la escalabilidad y permite agregar nuevas entidades sin modificar el código existente.

---

### Adapter  
**¿Qué es?**  
Permite que interfaces incompatibles trabajen juntas mediante la adaptación de una interfaz a otra esperada.

**¿Por qué se usó?**  
Se usó para adaptar diferentes formatos y variantes de productos bajo la misma marca y línea, unificando la forma en que se manejan los datos internamente sin importar sus diferencias originales.

---

### Memento  
**¿Qué es?**  
Captura y externaliza el estado interno de un objeto para restaurarlo después sin violar la encapsulación.

**¿Por qué se usó?**  
Se aplicó para gestionar el estado del carrito de ventas, permitiendo recuperar y actualizar el contenido sin pérdida de datos, mejorando la experiencia de usuario y el control de estados.

---

### VMC (Vista - Modelo - Controlador)  
**¿Qué es?**  
Patrón que organiza la arquitectura en tres componentes separados: Modelo (datos y lógica), Vista (interfaz) y Controlador (gestión de eventos y lógica).

**¿Por qué se usó?**  
Se utilizó para estructurar el backend de forma modular y clara, facilitando mantenimiento, pruebas y escalabilidad, evitando código monolítico y favoreciendo el trabajo en equipo.

---

## Diagrama UML de Clases (Mermaid)

```mermaid
classDiagram
    class Usuario {
        +crearProducto()
        +crearMarca()
        +crearLineaProducto()
        +gestionarCarrito()
        +gestionarPedidos()
        +administrarSistema()
    }

    class ProductoFactory {
        +crearProducto()
    }

    class MarcaFactory {
        +crearMarca()
    }

    class LineaFactory {
        +crearLineaProducto()
    }

    class Producto {
        -nombreProducto
        -marca
        -linea
        -presentaciones
        +guardar()
    }

    class Marca {
        -nombreMarca
        +guardar()
    }

    class LineaProducto {
        -nombreLinea
        +guardar()
    }

    class ProductoAdapter {
        +adaptarDatos()
    }

    class Carrito {
        -estado
        +guardarEstado()
        +restaurarEstado()
    }

    class ConexionBD {
        <<Singleton>>
        +getInstance()
        +conectar()
    }

    Usuario --> ProductoFactory : crea >
    Usuario --> MarcaFactory : crea >
    Usuario --> LineaFactory : crea >
    Usuario --> Carrito : gestiona >
    Usuario --> ConexionBD : usa >
    ProductoFactory --> Producto : instancia >
    MarcaFactory --> Marca : instancia >
    LineaFactory --> LineaProducto : instancia >
    ProductoAdapter --> Producto : adapta >
    Carrito --> Memento : guarda/recupera estado >
```

Al implementar estos patrones, logré que el backend sea mucho más organizado y fácil de mantener. Cada patrón cumple un propósito claro y juntos permiten que el sistema crezca sin que el código se vuelva un caos difícil de entender. Además, ayudan a que diferentes desarrolladores trabajen en el proyecto sin pisarse entre sí y facilitan la incorporación de nuevas funcionalidades en el futuro.

Este enfoque modular y escalable no solo hace que el desarrollo sea más eficiente, sino que también brinda confianza de que la aplicación podrá evolucionar con menos dolores de cabeza. En definitiva, usar estos patrones me permitió construir una base sólida, pensando en el presente y el futuro del proyecto.
