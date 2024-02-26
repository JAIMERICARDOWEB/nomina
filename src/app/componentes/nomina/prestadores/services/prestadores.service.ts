import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Prestadores } from '../interfaces/prestadores';

@Injectable({
  providedIn: 'root'
})
export class PrestadoresService {
private TableName:string='t_nom_prestadores'

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  async getOne(id:string):Promise<Prestadores>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .select()
     .eq('id_ase', id)

     if (error) {
      throw error;
     }

     return (data.length > 0 ? data[0] : null)  as Prestadores
 }

  async getAll():Promise<Prestadores[]>{
     const { data, error } = await this.supabase
      .from(this.TableName)
      .select()

      if (error) {
        throw error;
       }

      return data as Prestadores[]
  }

  async Delete(id:string):Promise<void>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .delete()
     .eq('id_ase', id)

     if (error) {
      throw error;
     }
 }

 async Update(prestador:Prestadores):Promise<Prestadores>{
  const { data, error } = await this.supabase
   .from(this.TableName)
   .update(prestador)
   .eq('id_ase', prestador.id_ase)

   if (error) {
    throw error;
   }
   return data as Prestadores
}

async Insert(cargo:Prestadores):Promise<Prestadores>{
  const { data, error } = await this.supabase
   .from(this.TableName)
   .insert(cargo)

   if (error) {
    throw error;
   }
   return data as Prestadores
}

}
