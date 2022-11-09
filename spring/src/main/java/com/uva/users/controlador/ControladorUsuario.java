package com.uva.users.controlador;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.uva.users.excepcion.UsuarioExcepcion;
import com.uva.users.modelo.Usuario;
import com.uva.users.repository.UsuarioRepository;

@RestController
@RequestMapping("users")
@CrossOrigin(origins = "*")
public class ControladorUsuario {
    private final UsuarioRepository repository;

    ControladorUsuario(UsuarioRepository repository) {
        this.repository = repository;
    }

    // crear usuario
    @PostMapping
    public String newUsuario(@RequestBody Usuario newUsuario) {
        try {
            repository.save(newUsuario);
            return "Nuevo usuario creado";
        } catch (Exception e) {

            return "no se ha podido crear el usuario";
        }
    }

    // obtener todos lo usuarios
    @GetMapping
    public List<Usuario> getUsuarios() {
        List<Usuario> usuarios = new ArrayList<Usuario>();

        repository.findAll().forEach(usuarioVisto -> usuarios.add(usuarioVisto));

        return usuarios;

    }

    // Ambiguous mapping. Cannot map 'controladorUsuario' method
    // com.uva.users.controlador.ControladorUsuario#getUsuariosEnabled(boolean)
    // to {GET [/users]}: There is already 'controladorUsuario' bean method
    // com.uva.users.controlador.ControladorUsuario#getUsuarios() mapped.

    // obtener solo segun campo de enabled
    // tengo que poner algo en la url para diferenciarlo del get normal
    // si quito ("/tipo") me sale la excepcion de arriba
    @GetMapping("/tipo")
    public List<Usuario> getUsuariosEnabled(@RequestParam boolean enabled) {
        List<Usuario> usuarios = new ArrayList<Usuario>();

        repository.findByEnabled(enabled).forEach(usuarioVisto -> usuarios.add(usuarioVisto));
        return usuarios;

    }

    // obtener un usuario concreto
    @GetMapping(value = "/{id}")
    public Usuario getUsuarioById(@PathVariable int id) {

        Usuario usuario;
        if (repository.existsById(id)) {
            usuario = repository.findById(id).get();
            return usuario;

        } else {
            // si no se encuntra devuelve null
            return null;
        }

    }

    // actualizar usuario
    @PutMapping(value = "/{id}")
    public String actualizarUsuarioById(@PathVariable int id, @RequestBody Usuario usuario) {
        if (repository.existsById(id)) {
            Usuario usuarioCorrespondiente = repository.findById(id).get();

            usuarioCorrespondiente.setCreatedAt(usuario.getCreatedAt());
            usuarioCorrespondiente.setUpdatedAt(usuario.getUpdatedAt());
            usuarioCorrespondiente.setEnabled(usuario.isEnabled());
            usuarioCorrespondiente.setEmail(usuario.getEmail());
            usuarioCorrespondiente.setPassword(usuario.getPassword());
            usuarioCorrespondiente.setRole(usuario.getRole());
            usuarioCorrespondiente.setFirstName(usuario.getFirstName());
            usuarioCorrespondiente.setLastName(usuario.getLastName());
            usuarioCorrespondiente.setName(usuario.getName());

            repository.save(usuarioCorrespondiente);
            return "actualizado correctamente";
        } else {
            return "no existe ese usuario";
        }

    }

    // obtener usuario por nombre similar
    @GetMapping("/buscarNombre/{nombre}")
    public Usuario buscarNombre(@PathVariable String nombre) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByName(nombre);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }

    }

    //identificacion por usuario y contrasena
    //me imagino que en la realidad se hara de una manera mas segura
    @GetMapping("/identificacion/{nombre}/{contrasena}")
    public Usuario identificacion(@PathVariable String nombre,@PathVariable String contrasena) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByIdentificacion(nombre,contrasena);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }

    }

    // obtener usuario por email similar
    @GetMapping("/buscarEmail/{email}")
    public Usuario buscarEmail(@PathVariable String email) {
        List<Usuario> usuarios = new ArrayList<Usuario>();
        usuarios = repository.findByEmail(email);
        if (usuarios.isEmpty()) {
            return null;
        } else {
            return usuarios.get(0);
        }
    }

    // eliminar usuario
    @DeleteMapping(value = "/{id}")
    public String borrarUsuarioById(@PathVariable int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return "eliminado con exito";
        } else {
            return "no existe con ese id";
        }

    }

    // activar usuarios
    @PutMapping("/enabled")
    public String activarUsuarios(@RequestParam List<Integer> user_id) {
        int id_actualizar;
        int contadorActualizados = user_id.size();
        for (int i = 0; i < user_id.size(); i++) {//recorres la lista
            id_actualizar = user_id.get(i);

            if (repository.existsById(id_actualizar)) {//si se encuentra lo actualizas
                Usuario usuarioCorrespondiente = repository.findById(id_actualizar).get();

                usuarioCorrespondiente.setEnabled(true);

                repository.save(usuarioCorrespondiente);
                contadorActualizados--;

            }

        }

        if (contadorActualizados == 0) {
            return "se han actualizado todos";
        } else {
            return "no se han actualizado todos";
        }

    }

    @PutMapping("/disabled")
    public String desactivarUsuarios(@RequestParam List<Integer> user_id) {
        int id_actualizar;
        int contadorActualizados = user_id.size();
        for (int i = 0; i < user_id.size(); i++) {
            id_actualizar = user_id.get(i);

            if (repository.existsById(id_actualizar)) {//recorres la lista y si se encuentra lo actualizas
                Usuario usuarioCorrespondiente = repository.findById(id_actualizar).get();

                usuarioCorrespondiente.setEnabled(false);

                repository.save(usuarioCorrespondiente);
                contadorActualizados--;

            }

        }

        if (contadorActualizados == 0) {
            return "se han actualizado todos";
        } else {
            return "no se han actualizado todos";
        }

    }

}
