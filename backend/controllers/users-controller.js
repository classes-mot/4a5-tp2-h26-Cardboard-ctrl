import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import HttpError from '../handler/http-error.js';

const registerUser = async (req, res, next) => {
    console.log('registering');
    const { name, email, password, jeux } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Enregistrement échoué, veuillez réessayer plus tard.',
            500
        )
        return next(error)
    }
    console.log('existingUser', existingUser);
    if (existingUser) {
        const error = new HttpError(
            'Un utilisateur avec cette adresse e-mail existe déjà.',
            422
        )
    }
    const createdUser = new User({
        name,
        email,
        password,
        jeux,
    });
    console.log('createdUser', createdUser);
    try {
        await createdUser.save();
    } catch (err) {
        console.log(err);
        const error = new HttpError(
            'Enregistrement échoué, veuillez réessayer plus tard.',
            500
        );
        return next(error);
    }
    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        console.error(err);
        const error = new HttpError(
            'Échec de connexion, veuillez réessauer plus tard.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Identification échouée, vérifiez vos identifiants.',
            401
        );
        return next(error);
    }

    let token;
    try {
        token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'cleSuperSecrete!',
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Erreur lors de la génération du jeton. Réessayer plus tard.',
            500
        );
        return next(error);
    }

    res.status(200).json({
        userId: existingUser.id,
        email: existingUser.email,
        token,
    });
};

export default {
    registerUser,
    login,
};
