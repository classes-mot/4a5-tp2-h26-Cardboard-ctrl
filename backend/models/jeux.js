import mongoose from 'mongoose';

const jeuxSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    category: { type: String, required: true },
    nbJoueurs: String,
    dureeMinutes: Number,
});

export const Jeu = mongoose.model('Jeu', jeuxSchema);
