import {Router} from 'express';
import {createImportController} from '../controllers/import.controller.js';

export function createImportRoutes(fichier){
    const router = Router();

    const controller = createImportController(fichier);

    router.post("/bloquant", controller.importBloquant);
    router.post("/flux", controller.importFlux);

    return router;
}