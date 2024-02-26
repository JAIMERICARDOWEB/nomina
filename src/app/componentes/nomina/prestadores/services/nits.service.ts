import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Nits } from '../interfaces/nits';

@Injectable({
  providedIn: 'root'
})
export class NitsService {

  private TableName:string='tentidad'

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  
  async getOne(id:string):Promise<Nits>{
    const { data, error } = await this.supabase
     .from(this.TableName)
     .select('id_ase, nom_ase')
     .eq('id_ase', id)

     if (error) {
      throw error;
     }

     return (data.length > 0 ? data[0] : null)  as Nits
 }

  async getAll():Promise<Nits[]>{
     const { data, error } = await this.supabase
      .from(this.TableName)
      .select('id_ase, nom_ase')

      if (error) {
        throw error;
       }

      return data as Nits[]
  }

}
