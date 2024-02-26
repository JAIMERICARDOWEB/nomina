import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Cuentas } from '../interfaces/cuentas';

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private TableName:string='t_cuentas'

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  async getOne(id:string):Promise<Cuentas>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .select('codcta, descripcion')
     .eq('codcta', id)

     if (error) {
      throw error;
     }

     return (data.length > 0 ? data[0] : null)  as Cuentas
 }

  async getAll():Promise<Cuentas[]>{
     const { data, error } = await this.supabase
      .from(this.TableName)
      .select('codcta, descripcion')

      if (error) {
        throw error;
       }

      return data as Cuentas[]
  }


}
