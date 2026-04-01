import mongoose from 'mongoose';

const jeuxSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    category: { type: String, required: true },
    nbJoueurs: String,
    dureeMinutes: Number,
});

const Jeu = mongoose.model('Jeu', jeuxSchema);
export default Jeu;
