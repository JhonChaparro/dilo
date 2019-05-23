<?php

defined('BASEPATH') OR exit('No direct script access allowed');

class User extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->model('data/Dao_user_model');

    }


    // Funcion para validar logueo
    public function index() {
        $idUser = $this->input->post('username');
        $pass = $this->input->post('contrasena');
        $val_user = $this->Dao_user_model->getUserByUsername($idUser);
        if ($val_user != null) {

            $val_pass = $this->Dao_user_model->validatePass($pass, $val_user->id_usuario);
            if ($val_pass != null) {
                if ($pass === 'abc123' || strlen($pass) <= 6) {
                    $data['usuario'] = $val_user;
                    $this->load->view('cambiarContrasena', $data);
                }else{
                    $data = array(
                    'role' => $val_user->rol,
                    'id' => $val_user->id_usuario,
                    'name' => $val_user->nombres . " " . $val_user->apellidos,
                    'email'=> $val_user->email
                );

                $this->session->set_userdata($data);
                header('location: ' . base_url() . "User/principal/$val_user->rol");
                }
            } else {
                $response['mensaje'] = 'Error de autentificación!';
                $response['texto'] = 'La contraseña es errónea';
                $response['tipo'] = 'error';
                $this->load->view('login', $response);
            }

        } else {
            $response['mensaje'] = 'Error de autentificación!';
            $response['texto'] = 'El No. de documento es desconocido!';
            $response['tipo'] = 'error';
            $this->load->view('login', $response);
        }
    }

    // Carga la vista ppal segun el roll
    public function principal($role) {
        if (!$this->session->userdata('id')){header('location: ' . base_url());}

          $data['title'] = 'Principal';
          $this->load->view('parts/header', $data);
          $this->load->view("principal");
          $this->load->view('parts/footer');

    }

    // cierra session
    public function logout() {
        if ($this->session->userdata('name')) {
            $this->session->sess_destroy();
        }
        $this->load->view('login');
    }

    // retorna para js las variables del usuario en session
    public function getSessionValues() {
        $clave = $this->input->post('clave');


        if ($clave) {
            echo json_encode($this->session->userdata("$clave"));
        } else {
            echo json_encode($this->session->userdata());
        }
    }

    // valida si el pasword ingresado en el input es correcto
    public function validate_pass(){
        $user_in_session = $this->session->userdata('id');
        $password = $this->input->post('pass');
        $res = $this->Dao_user_model->get_pass_by_id($user_in_session);
        if ($res->contrasena == $password) {
            echo json_encode(1);
        }else {
            echo json_encode(0);
        }
    }

    public function Update_pass_or_email(){
        if (!$this->session->userdata('id')){header('location: ' . base_url());}
        $user_in_session = $this->session->userdata('id');
        $data = array(
            'email' => $this->input->post('new_email') ,
            'contrasena' => $this->input->post('new_pass')
        );
        $res = $this->Dao_user_model->m_Update_pass_or_email($user_in_session, $data);

        $this->load->library( 'user_agent' );
        if ($res == 1) {
            $this->session->set_flashdata('msj', 'ok');
            $this->session->sess_destroy();
            $this->load->view('login');
        }else{
            $this->session->set_flashdata('msj', 'error');
            header('location: ' .$this->agent->referrer ());
        }

    }


}
