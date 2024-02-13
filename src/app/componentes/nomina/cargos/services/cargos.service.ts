import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { cargos } from '../interfaces/cargos';


@Injectable({
  providedIn: 'root'
})
export class CargosService {

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  async getOne(id:string):Promise<cargos>{
    const { data, error } = await this.supabase
     .from('t_cargos_nom')
     .select()
     .eq('id', id)

     if (error) {
      throw error;
     }

     return (data.length > 0 ? data[0] : null)  as cargos
 }

  async getAll():Promise<cargos[]>{
     const { data, error } = await this.supabase
      .from('t_cargos_nom')
      .select()

      if (error) {
        throw error;
       }

      return data as cargos[]
  }

  async Delete(id:string):Promise<void>{
    const { data, error } = await this.supabase
     .from('t_cargos_nom')
     .delete()
     .eq('id', id)

     if (error) {
      throw error;
     }
 }

 async Update(cargo:cargos):Promise<cargos>{
  const { data, error } = await this.supabase
   .from('t_cargos_nom')
   .update(cargo)
   .eq('id', cargo.id)

   if (error) {
    throw error;
   }
   return data as cargos
}

async Insert(cargo:cargos):Promise<cargos>{
  const { data, error } = await this.supabase
   .from('t_cargos_nom')
   .insert(cargo)

   if (error) {
    throw error;
   }
   return data as cargos
}

} 
