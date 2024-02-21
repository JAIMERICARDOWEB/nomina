import { Inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { Areas } from '../interfaces/areas';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  constructor(
    @Inject('SUPABASE_CLIENT') private supabase: SupabaseClient
  ) { }

  async getOne(id:string):Promise<Areas>{
    const { data, error } = await this.supabase
    .from('t_nom_areas')
    .select()
    .eq('id', id)

    if (error) {
      throw error;
    }

    return (data.length > 0 ? data[0] : null)  as Areas
}

  async getAll():Promise<Areas[]>{
    const { data, error } = await this.supabase
      .from('t_nom_areas')
      .select()

      if (error) {
        throw error;
      }

      return data as Areas[]
  }

  async Delete(id:string):Promise<void>{
    const { data, error } = await this.supabase
    .from('t_nom_areas')
    .delete()
    .eq('id', id)

    if (error) {
      throw error;
    }
}

async Update(area:Areas):Promise<Areas>{
  const { data, error } = await this.supabase
  .from('t_nom_areas')
  .update(area)
  .eq('id', area.id)

  if (error) {
    throw error;
  }
  return data as Areas
}

async Insert(area:Areas):Promise<Areas>{
  const { data, error } = await this.supabase
  .from('t_nom_areas')
  .insert(area)

  if (error) {
    throw error;
  }
  return data as Areas
}


}
