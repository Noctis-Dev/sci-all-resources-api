// src/infrastructure/storage/S3Service.ts
import AWS, { S3 } from 'npm:aws-sdk';
import { OwnerResourceType, ResourceType, OwnerType } from '../../domain/entities/Enums.ts';
import type { Buffer } from 'node:buffer';

export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new AWS.S3({
      region: 'us-east-2',
      accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY'),
    });
  }

  // Método para subir archivos a S3
  async upload(fileContent: Buffer, fileName: string): Promise<string> {
    const params = {
      Bucket: 'sci-all-resources-bucket',
      Key: fileName, // Nombre del archivo en S3
      Body: fileContent,
      ContentType: this.getContentType(fileName),
      ACL: 'public-read', // Hacer el archivo público
    };

    const { Location } = await this.s3.upload(params).promise();
    console.log(`Archivo subido con éxito: ${Location}`);
    return Location;
  }


  // Método para descargar archivos desde S3
  async downloadFile(fileUrl: string): Promise<Buffer> {
    const bucket = 'sci-all-resources-bucket';
    const key = fileUrl.split('.com/')[1]; // Extraer el key del URL

    const params = {
      Bucket: bucket,
      Key: key,
    };

    const data = await this.s3.getObject(params).promise();
    if (!data.Body) {
      throw new Error('No se pudo descargar el archivo desde S3');
    }
    return data.Body as Buffer;
  }

  // Método para construir el nombre del archivo para USUARIO
  buildFileNameForUser(ownerUUID: string, ownerResourceType: OwnerResourceType): string {
    const extension = this.getFileExtension(ownerResourceType);
    const timestamp = Date.now();
    return `${OwnerType.USUARIO}/${ownerUUID}/${ownerResourceType}/${timestamp}.${extension}`;
  }

  // Método para construir el nombre del archivo para PUBLICATION y STREAM
  buildFileNameForOther(ownerUUID: string, resourceType: ResourceType, ownerType: OwnerType): string {
    const extension = this.getFileExtension(resourceType);
    const timestamp = Date.now();
    return `${ownerType}/${ownerUUID}/${resourceType}/${timestamp}.${extension}`;
  }

  // Método para obtener la extensión del archivo según su tipo
  private getFileExtension(resource: ResourceType | OwnerResourceType): string {
    switch (resource) {
      case ResourceType.PICTURE:
      case OwnerResourceType.PROFILE_PICTURE:
      case OwnerResourceType.BACKGROUND_IMAGE:
        return 'jpg';
      case ResourceType.PDF:
        return 'pdf';
      case ResourceType.VIDEO:
        return 'mp4';
      case ResourceType.AUDIO:
        return 'mp3';
      default:
        return 'bin'; // Por defecto si no es un tipo conocido
    }
  }

  // Método para obtener el Content-Type del archivo
  private getContentType(fileName: string): string {
    const extension = fileName.split('.').pop();
    switch (extension) {
      case 'jpg':
        return 'image/jpeg';
      case 'pdf':
        return 'application/pdf';
      case 'mp4':
        return 'video/mp4';
      case 'mp3':
        return 'audio/mpeg';
      default:
        return 'application/octet-stream';
    }
  }
}
