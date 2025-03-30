import {Concert} from '@prisma/client';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';


/**
 * Créer un concert avec image en BLOB
 * @param {string} title
 * @param {string} location
 * @param {Date} date
 * @param {number} maxSeats
 * @param {string} status
 * @param {Buffer} image
 * @returns {Promise<Concert>} - Le concert créé
 */
const createConcert = async (
    title: string,
    location: string,
    date: Date,
    maxSeats: number,
    status: string,
    image?: Buffer, // Image en option
): Promise<Concert> => {
    // Vérifier si un concert au même endroit et à la même date existe déjà
    const existingConcert = await prisma.concert.findFirst({
        where: {
            location,
            date,
        },
    });

    if (existingConcert) {
        throw new ApiError(httpStatus.BAD_REQUEST, "A concert at this location and time already exists");
    }

    return prisma.concert.create({
        data: {
            title,
            location,
            date,
            maxSeats,
            status,
            image,
        },
    });
};

/**
* Récupérer la liste des concerts
* @returns {Promise<Concert[]>} - Liste des concerts non supprimés
*/
const getConcerts = async (): Promise<Concert[]> => {
    return prisma.concert.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: {
            date: "asc",
        },
    });
};

/**
* Récupérer un concert par son ID
* @param {string} concertId
* @returns {Promise<Concert>} - Le concert trouvé
*/
const getConcertById = async (concertId: string): Promise<Concert> => {
    const concert = await prisma.concert.findUnique({
        where: { id: concertId},
    });
    
    if (!concert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    
    return concert;
};

/**
* Supprimer un concert par son ID (suppression logique)
* @param {string} concertId
* @returns {Promise<Concert>} - Le concert supprimé (marqué comme supprimé)
*/
const deleteConcertById = async (concertId: string): Promise<Concert> => {
    const existingConcert = await prisma.concert.findUnique({
        where: { id: concertId },
    });
    
    if (!existingConcert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    
    return prisma.concert.update({
        where: { id: concertId },
        data: {
            deletedAt: new Date(), // Marque comme supprimé au lieu de l'effacer
        },
    });
};

/**
* Mettre à jour un concert par son ID
* @param {string} concertId
* @param {string} title
* @param {string} location
* @param {Date} date
* @param {number} maxSeats
* @param {string} status
* @param {Buffer} image
* @returns {Promise<Concert>}
*/
const updateConcertById = async (concertId: string, title?: string, location?: string, date?: Date, maxSeats?: number, status?: string, image?: Buffer): Promise<Concert> => {
    const existingConcert = await prisma.concert.findUnique({
        where: { id: concertId },
    });

    if (!existingConcert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    return prisma.concert.update({
        where: { id: concertId },
        data: {
            title: title ?? existingConcert.title,
            location: location ?? existingConcert.location,
            date: date ?? existingConcert.date,
            maxSeats: maxSeats ?? existingConcert.maxSeats,
            status: status ?? existingConcert.status,
            image: image ?? existingConcert.image,
        },
    });
}


export default { createConcert, getConcerts, getConcertById, deleteConcertById, updateConcertById };