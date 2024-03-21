import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Tipocontrato } from '../interfaces/tipocontrato';

@Injectable({
  providedIn: 'root'
})
export class TipocontratoService {
  private TableName:string='t_nomina_tipo_contrato'
  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  async getOne(id:string):Promise<Tipocontrato>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .select()
     .eq('id', id)

     if (error) {
      throw error;
     }

     return (data.length > 0 ? data[0] : null)  as Tipocontrato
 }

  async getAll():Promise<Tipocontrato[]>{
     const { data, error } = await this.supabase
      .from(this.TableName)
      .select()

      if (error) {
        throw error;
       }

      return data as Tipocontrato[]
  }

  async Delete(id:string):Promise<void>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .delete()
     .eq('id', id)

     if (error) {
      throw error;
     }
 }

 async Update(prestador:Tipocontrato):Promise<Tipocontrato>{
  const { data, error } = await this.supabase
   .from(this.TableName)
   .update(prestador)
   .eq('id', prestador.id)

   if (error) {
    throw error;
   }
   return data as Tipocontrato
}

async Insert(cargo:Tipocontrato):Promise<Tipocontrato>{
  const { data, error } = await this.supabase
   .from(this.TableName)
   .insert(cargo)

   if (error) {
    throw error;
   }
   return data as Tipocontrato
}

}
