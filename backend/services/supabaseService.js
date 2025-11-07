import { supabase } from '../config/supabaseConfig.js';

const table = (name) => supabase.from(name);

export const db = {
  // Genéricos
  async findAll(name, opts = {}) {
    const { select = '*', filter = (q) => q } = opts;
    let query = table(name).select(select);
    query = filter(query);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  async findById(name, id, select = '*') {
    const { data, error } = await table(name).select(select).eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  },
  async insert(name, payload) {
    const { data, error } = await table(name).insert(payload).select();
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  },
  async update(name, id, payload) {
    const { data, error } = await table(name).update(payload).eq('id', id).select();
    if (error) throw error;
    return Array.isArray(data) ? data[0] : data;
  },
  async remove(name, id) {
    const { error } = await table(name).delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // Específicos
  async findUserByEmail(email) {
    const { data, error } = await table('users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
  }
};

// Storage helpers para subir archivos (avatars, etc.)
export const storage = {
  async upload(bucket, path, fileBuffer, contentType) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, fileBuffer, { contentType, upsert: true });
    if (error) throw error;
    return data; // { path }
  },
  publicUrl(bucket, path) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data?.publicUrl;
  }
};