import mongoose, { Schema, Document } from 'npm:mongoose';
import { Resource } from '../../domain/entities/Resource.ts';

interface ResourceDocument extends Document, Resource {}

const ResourceSchema = new Schema({
  recurso_uuid: { type: String, required: true },
  owner_uuid: { type: String, required: true },
  owner_type: { type: String, required: true },
  resource_type: { type: String, required: false }, // Opcional para USUARIO
  owner_resource_type: { type: String, required: false }, // Opcional para PUBLICATION y STREAM
  url: { type: String, required: true },
});

export default mongoose.model<ResourceDocument>('Resource', ResourceSchema);
