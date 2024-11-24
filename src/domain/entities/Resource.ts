import { OwnerType, ResourceType, OwnerResourceType } from './Enums.ts';

export interface Resource {
  recurso_uuid: string;
  owner_uuid: string;
  owner_type: OwnerType;
  resource_type?: ResourceType; // Opcional para USUARIO
  owner_resource_type?: OwnerResourceType; // Opcional para PUBLICATION y STREAM
  url: string;
}
