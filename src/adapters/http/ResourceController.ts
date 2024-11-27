// src/adapters/http/ResourceController.ts
import express, { Request, Response } from 'npm:express';
import { ResourceService } from '../../domain/services/ResourceService.ts';
import { ProcessResourceEvent } from '../../application/use_cases/ProcessResourceEvent.ts';
import { S3Service } from '../../infrastructure/storage/S3Service.ts';
import { MongoResourceRepository } from '../../infrastructure/db/MongoResourceRepository.ts';
import { ResourceType, OwnerType, OwnerResourceType } from '../../domain/entities/Enums.ts';

const router = express.Router();

const s3Service = new S3Service();
const resourceRepository = new MongoResourceRepository();
const resourceService = new ResourceService(resourceRepository);
const processResourceEvent = new ProcessResourceEvent(resourceService, s3Service);


// Endpoint para obtener un PDF en blob base64 de una publicación
router.get('/resources/publication/:owner_uuid', async (req: Request, res: Response) => {
  const { owner_uuid } = req.params;

  if (!owner_uuid) {
    return res.status(400).json({ error: 'owner_uuid es requerido' });
  }

  try {
    // Buscar el PDF asociado al owner_uuid
    const resources = await resourceService.getResourcesByOwnerUUID(owner_uuid);

    // Filtrar solo PDFs
    const pdfResource = resources.find((resource) => resource.resource_type === ResourceType.PDF);

    if (!pdfResource) {
      return res.status(404).json({ error: 'No se encontró un PDF para esta publicación' });
    }

    res.json({ data: pdfResource.url });
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    res.status(500).json({ error: 'Error al obtener el PDF' });
  }
});

// Endpoint para subir un recurso
router.post('/resources', async (req: Request, res: Response) => {
  const { resource, resource_type, owner_type, owner_resource_type, owner_uuid } = req.body;

  if (!resource || !resource_type || !owner_type || !owner_resource_type || !owner_uuid) {
    return res
      .status(400)
      .json({ error: 'Todos los campos (resource, resource_type, owner_type, owner_resource_type, owner_uuid) son requeridos' });
  }

  try {
    await processResourceEvent.execute({
      resource: resource,
      resource_type: resource_type as ResourceType,
      owner_type: owner_type as OwnerType,
      owner_resource_type: owner_resource_type as OwnerResourceType,
      owner_uuid,
    });

    res.status(201).json({ message: 'Recurso creado correctamente' });
  } catch (error) {
    console.error('Error al procesar el recurso:', error);
    res.status(500).json({ error: 'Ocurrió un error al procesar el recurso' });
  }
});


// Endpoint para obtener recursos por tipo de recurso
router.get('/resources/:resourceType', async (req: Request, res: Response) => {
  const { resourceType } = req.params; // Obtiene el ResourceType de los parámetros de la ruta

  if (!resourceType) {
    return res.status(400).json({ error: 'ResourceType es requerido' });
  }

  try {
    const resources = await resourceService.getResourcesByType(resourceType);

    if (resources.length === 0) {
      return res.status(404).json({ message: `No se encontraron recursos con el tipo: ${resourceType}` });
    }

    res.json(resources);
  } catch (error) {
    console.error('Error al obtener recursos por tipo:', error);
    res.status(500).json({ error: 'Error al obtener recursos por tipo' });
  }
});

// Endpoint para obtener recursos por owner_uuid
router.get('/resources/:owner_uuid', async (req: Request, res: Response) => {
  const { owner_uuid } = req.params;
  console.log('Recibiendo owner_uuid:', owner_uuid); // Log del UUID recibido

  if (!owner_uuid) {
    console.log('Error: owner_uuid no proporcionado'); // Log de error
    return res.status(400).json({ error: 'owner_uuid es requerido' });
  }

  try {
    const resources = await resourceService.getResourcesByOwnerUUID(owner_uuid);
    console.log('Recursos encontrados:', resources); // Log de los recursos encontrados

    if (resources.length === 0) {
      console.log('No se encontraron recursos para el UUID:', owner_uuid); // Log cuando no hay recursos
      return res.status(404).json({ message: 'No se encontraron recursos para este UUID' });
    }

    res.json(resources);
  } catch (error) {
    console.error('Error al obtener recursos:', error); // Log de error en el catch
    res.status(500).json({ error: 'Error al obtener los recursos' });
  }
});



export default router;
