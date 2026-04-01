import express from 'express';
import { check } from 'express-validator';
import jeuxController from '../controllers/jeux-controller.js';
import checkAuth from '../middleware/check-auth.js'

const router = express.Router();

router.get('/read', jeuxController.getJeux);

router.get('/:jid', jeuxController.getJeuxById);


router.use(checkAuth)

const jeuValidation = [
    check('titre').not().isEmpty(),
    check('category').isIn(['Cartes', 'Famille', 'Ambiance', 'Stratégie']),
    check('dureeMinutes').isNumeric()
]

router.post('/add', jeuValidation, jeuxController.createJeu);

router.patch('/:jid', jeuValidation, jeuxController.updateJeu);

router.delete('/:jid', jeuValidation, jeuxController.deleteJeu)


export default router;