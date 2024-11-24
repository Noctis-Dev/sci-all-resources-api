import { ResourceService } from '../../domain/services/ResourceService.ts';
import { S3Service } from '../../infrastructure/storage/S3Service.ts';
import { OwnerType, ResourceType, OwnerResourceType } from '../../domain/entities/Enums.ts';
import { Buffer } from 'node:buffer';

interface ProcessResourceEventInput {
  resource: string; // Archivo codificado en base64
  resource_type?: ResourceType; // Opcional para USUARIO
  owner_type: OwnerType;
  owner_resource_type?: OwnerResourceType; // Opcional para PUBLICATION/STREAM
  owner_uuid: string;
}

export class ProcessResourceEvent {
  constructor(
    private resourceService: ResourceService,
    private s3Service: S3Service
  ) {}

  async execute(input: ProcessResourceEventInput): Promise<void> {
    const { resource, resource_type, owner_type, owner_resource_type, owner_uuid } = input;

    console.log("Iniciando procesamiento del evento...");
    
    try {
      // Decodifica el contenido del archivo desde base64 a un Buffer
      console.log("Decodificando recurso desde Base64...");
      const fileContent = Buffer.from(resource, 'base64');
      console.log(`Recurso decodificado. Tamaño del buffer: ${fileContent.length} bytes.`);

      // Construye el nombre del archivo en S3 basado en el tipo de owner_type
      console.log("Construyendo nombre del archivo...");
      let fileName: string;
      if (owner_type === OwnerType.USUARIO) {
        fileName = this.s3Service.buildFileNameForUser(owner_uuid, owner_resource_type!);
      } else {
        if (!resource_type) {
          throw new Error(`resource_type es obligatorio para owner_type ${owner_type}`);
        }
        fileName = this.s3Service.buildFileNameForOther(owner_uuid, resource_type, owner_type);
      }
      console.log(`Nombre del archivo construido: ${fileName}`);

      // Sube el recurso a S3
      console.log("Subiendo recurso a S3...");
      const url = await this.s3Service.upload(fileContent, fileName);
      console.log(`Archivo subido exitosamente. URL: ${url}`);

      // Guarda la información del recurso en el servicio de dominio
      console.log("Guardando información del recurso en la base de datos...");
      await this.resourceService.createResource({
        owner_uuid,
        owner_type,
        resource_type: owner_type === OwnerType.USUARIO ? ResourceType.PICTURE : resource_type,
        owner_resource_type: owner_type === OwnerType.USUARIO ? owner_resource_type : undefined,
        url,
        recurso_uuid: `${owner_uuid}-${Date.now()}`,
      });
      console.log("Información del recurso guardada exitosamente.");

    } catch (error) {
      console.error("Error durante el procesamiento del evento:", error);
      throw error; // Lanza el error para que pueda manejarse en un nivel superior
    }
  }
}
