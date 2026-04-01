import HttpError from '../util/http-error.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import Jeu from '../models/jeux.js';

const getJeux = async (req, res, next) => {
    let jeux;
    try {
        jeux = await Jeu.find({});
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
    }
    res.json({ jeux: jeux.map(jeux => jeux.toObject({ getters: true })) });
};

const getJeuxById = async (req, res, next) => {
    const jeuId = req.params.jid;

    let jeu;
    try {
        jeu = await Jeu.findById(jeuId);
    } catch (e) {
        console.log(e);
        const err = new HttpError(
            'Une erreur BD est survenue',
            500);
        return next(err);
    }

    if (!jeu) {
        return next(new HttpError(
            'Jeu non trouvé',
            404));
    }

    res.json({ jeu: jeu.toObject({ getters: true }) });
};

export const createJeu = async (req, res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return next(
            new HttpError(
                'Données saisies invalides. Vérifiez votre payload.',
                422
            )
        );
    }

    const { titre, category, nbJoueurs, dureeMinutes } = req.body;

    const createdJeu = new Jeu({
        titre,
        category,
        nbJoueurs,
        dureeMinutes,
    });

    try {
        await createdJeu.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError('Création dans la BD échouée.', 500);
        return next(error);
    }

    res.status(201).json({ jeu: createdJeu });
};

const updateJeu = async (req, res, next) => {
    const { titre, category, nbJoueurs, dureeMinutes } = req.body;
    const jeuId = req.params.jid;
    let jeu;
    try {
        jeu = await Jeu.findById(jeuId)
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }

    if (!jeu) {
        const error = new HttpError(
            'Jeu non trouvé.',
            404
        );
        return next(error);
    }

    jeu.titre = titre;
    jeu.category = category;
    jeu.nbJoueurs = nbJoueurs;
    jeu.dureeMinutes = dureeMinutes;

    try {
        await jeu.save();
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }

    res.status(200).json({ jeu: jeu.toObject({ getters: true }) });
};

const deleteJeu = async (req, res, next) => {
    const jeuId = req.params.jid;
    let jeu;
    try {
        jeu = await Jeu.findById(jeuId)
    } catch (err) {
        const error = new HttpError(
            'Une erreur BD est survenue, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }

    if (!jeu) {
        const error = new HttpError(
            'Jeu non trouvé.',
            404
        );
        return next(error);
    }

    try {
        await jeu.deleteOne();
    } catch (err) {
        const error = new HttpError(
            'Une erreur est survenue lors de la suppression du jeu.',
            500
        );
        return next(error);
    }

    res.status(200).json({ message: 'Jeu supprimé.' });
};

export default {
    getJeux,
    getJeuxById,
    createJeu,
    updateJeu,
    deleteJeu,
};
