import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Observable } from 'rxjs';
// import bcrypt from 'bcryptjs';

@Injectable({
    providedIn: 'root'
})
export class CRUDService {

    constructor(
        @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
    ) { }

    // getAll(tabla: string): Observable<any> {
    //     return new Observable(observer => {
    //         this.supabase
    //             .from(tabla)
    //             .select('*')
    //             .then(({ data, error }) => {
    //                 if (error) {
    //                     observer.error(error);
    //                 } else {
    //                     observer.next(data);
    //                     observer.complete();
    //                 }
    //             });
    //     });
    // }

    // getById(tabla: string, campo: string, id: any): Observable<any> {
    //     return new Observable(observer => {
    //         this.supabase
    //             .from(tabla)
    //             .select('*')
    //             .eq(campo, id)
    //             .then(({ data, error }) => {
    //                 if (error) {
    //                     observer.error(error);
    //                 } else {

    //                     observer.next(data[0]); // Retorna solo el primer elemento del arreglo
    //                     observer.complete();
    //                 }
    //             });
    //     });
    // }

    // postInsert(tabla: string, campos: any): Observable<any> {
    //     return new Observable(observer => {
    //         this.supabase
    //             .from(tabla)
    //             .insert([campos])
    //             .then(({ data, error }) => {
    //                 if (error) {
    //                     observer.error(error);
    //                 } else {
    //                     observer.next("¡Datos guardados exitosamente!");
    //                     observer.complete();
    //                 }
    //             })
    //     })
    // }

    // putUpdate(tabla: string, campo: string, id: string, campos: any): Observable<any> {
    //     return new Observable(observer => {
    //         this.supabase
    //             .from(tabla)
    //             .update(campos)
    //             .eq(campo, id)
    //             .then(({ data, error }) => {
    //                 if (error) {
    //                     observer.error(error);
    //                 } else {
    //                     observer.next("¡Datos actualizados exitosamente!");
    //                     observer.complete();
    //                 }
    //             })
    //     })
    // }

    // getSpecificFields(tabla: string, camposSpecificos: string): Observable<any> {
    //     return new Observable(observer => {
    //         this.supabase
    //             .from(tabla)
    //             .select(camposSpecificos)
    //             .then(({ data, error }) => {
    //                 if (error) {
    //                     observer.error(error);
    //                 } else {
    //                     observer.next(data);
    //                     observer.complete();
    //                 }
    //             });
    //     });
    // }

    registrarMovimientosDelUsuario(tabla: string, transaccion: number){
        let tipoTransaccion: string = ""
        switch (transaccion) {
            case 1:
                tipoTransaccion = "GUARDAR"
                break;
            case 2:
                tipoTransaccion = "ACTUALIZAR"
                break;
            case 3:
                tipoTransaccion = "ELIMINAR"
                break;
            default:
                break;
        }
        let informacionUsuario: any = {
            cod_usua1: "1",
            tabla1: tabla,
            transaccion1: tipoTransaccion,
            equipo1: navigator.userAgent
        }
        console.log(informacionUsuario);
        this.llamarProcedimientoPorParametro("guardar_tvitausua_web", informacionUsuario).subscribe(
            res => {
                return res
            },
            err =>{
                console.log(err);
                
                return err
            }
        )
    } 

    llamarProcedimientoPorParametro(nombreProcedimiento: string, parametros: Record<string, any>): Observable<any> {
        return new Observable(observer => {
            this.supabase.rpc(nombreProcedimiento, parametros)
                .then(({ data, error }) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                });
        });
    }

    llamarProcedimiento(nombreProcedimiento: string): Observable<any> {
        return new Observable(observer => {
            this.supabase.rpc(nombreProcedimiento)
                .then(({ data, error }) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                });
        });
    }

    uploadImagePorCarpeta(file: File, name: string, ruta: string): Observable<string> {
        return new Observable(observer => {
            const filePath = `${ruta}/${name}`;
            const fileData = new FormData();
            fileData.append('file', file, filePath);
            this.supabase.storage
                .from('siscolsi_storage') // Modificar el nombre del bucket
                .upload(filePath, fileData)
                .then(({ error, data }) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        const url: any = this.supabase.storage
                            .from('siscolsi_storage') // Modificar el nombre del bucket
                            .getPublicUrl(filePath);
                        observer.next(filePath);
                        observer.complete();
                    }
                });
        });
    }



    deleteImage(name: string): Observable<any> {
        return new Observable(observer => {
            this.supabase.storage
                .from('siscolsi_storage') // Modificar el nombre del bucket
                .remove([name])
                .then(({ error, data }) => {
                    if (error) {
                        observer.error(error);
                    } else {
                        observer.next(data);
                        observer.complete();
                    }
                });
        });
    }

    async generateImageUrl(path: string): Promise<string> {
        const { data, error } = await this.supabase.storage.from('siscolsi_storage').createSignedUrl(path, 120); // 120 segundos de validez
        if (error) {
            throw error;
        }
        return data.signedUrl;
    }
    createBucket(bucketName: string, allowedMimeTypes: string[], fileSizeLimit: number): Promise<any> {
        return this.supabase.storage.createBucket(bucketName, {
            public: false,
            allowedMimeTypes,
            fileSizeLimit
        });
    }
    // crearUsuario(email: string, password: string): Observable<any> {
    //   return new Observable(observer => {
    //     this.supabase.auth.signUp({ email, password })
    //       .then(({ error, user }) => {
    //         if (error) {
    //           observer.error(error);
    //         } else {
    //           const salt = bcrypt.genSaltSync(10);
    //           const hash = bcrypt.hashSync(password, salt);
    //           const tabla = 'usuarios';
    //           const campos = { email, password: hash };
    //           this.supabase
    //             .from(tabla)
    //            .insert(campos)
    //             .then(({ data, error }) => {
    //               if (error) {
    //                 observer.error(error);
    //               } else {
    //                 observer.next(user);
    //                 observer.complete();
    //               }
    //             });
    //         }
    //       });
    //   });
    // }
}
