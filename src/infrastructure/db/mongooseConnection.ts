import mongoose, { Schema, Document } from 'npm:mongoose';
import { Resource } from '../../domain/entities/Resource.ts';

interface ResourceDocument extends Document, Resource {}

const ResourceSchema = new Schema({
  recurso_uuid: { type: String, required: true },
  usuario_uuid: { type: String, required: true },
  url: { type: String, required: true },
  tipo_recurso: { type: String, required: true },
});

export default mongoose.model<ResourceDocument>('Resource', ResourceSchema);
