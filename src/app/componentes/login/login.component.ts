import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { AuthService } from 'src/app/guard/auth/auth.service';
// import { LoginService } from "../../services/CRUD/login.service";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  saltarAlertas: boolean = false;
  form_valid: boolean = false;
  aparecerloader: boolean = false;
  form_usuarios: FormGroup;

  constructor(
    
    // private authService: AuthService,
    private router: Router,
    // private loginService: LoginService
  ){
    this.form_usuarios = this.crearform();
  }

  ngOnInit(): void {

  }; 
  crearform(){
    return new FormGroup({
      empresa: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [Validators.required]),
      pasw: new FormControl('', [Validators.required])
    })
  }
  authService :any 
  login(){
    if (this.form_usuarios.valid) {
      const datosForm = this.form_usuarios.value;
      datosForm.id_ase = this.form_usuarios.value.empresa
      this.aparecerloader = true
      
      // this.loginService.newUser("empresa", {nombre: "siscolsi", schema: "siscolsi", usuario: 6, password: 12345, empresa: 1007182969})
      // .then((observable) => {
      //   observable.subscribe(
      //     res => console.log(res),
      //     error => console.error(error)
      //   );
      // });
      this.authService.Login(datosForm).subscribe(
        res =>{
          this.aparecerloader = false
          console.log(res)
          sessionStorage.setItem('Token', res.token)
          this.router.navigate(['/app'])
        },
        err => {
          sessionStorage.removeItem('Token')
          console.log('Los datos de usuario ingresados son incorrectos o el usuario no es válido!')
          this.aparecerloader = false

          this.form_valid = true;
          setTimeout(() => {
            this.form_valid = false;
          }, 3000);
          console.log(err)
          this.router.navigate(['/login'])
        }
        
      )
      this.saltarAlertas = false;
    }
    else{
      this.saltarAlertas = true;
    }
    
  };
  get empresa(): any { return this.form_usuarios.get('empresa'); }
  get usuario(): any { return this.form_usuarios.get('usuario'); }
  get pasw(): any { return this.form_usuarios.get('pasw'); }
}
