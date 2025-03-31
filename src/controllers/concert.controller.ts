import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import { concertService } from "../services";

const createConcert = catchAsync(async (req, res) => {
    const {title, location, date, maxSeats, status} = req.body;
    const image = req.file ? req.file.buffer : undefined;

    const maxSeatsAsNumber = parseInt(maxSeats, 10);

    const concert = await concertService.createConcert(title, location, date, maxSeatsAsNumber, status, image);
    res.status(httpStatus.CREATED).send(concert);
});

const getConcerts = catchAsync(async (req, res) => {
    const concerts = await concertService.getConcerts();
    res.send(concerts);
});

const getConcert = catchAsync(async (req, res) => {
    const concert = await concertService.getConcertById(req.params.concertId);
    if (!concert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    res.send(concert);
});

const deleteConcert = catchAsync(async (req, res) => {
    const concert = await concertService.deleteConcertById(req.params.concertId);
    if (!concert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    res.status(200).send(concert);

});

const updateConcert = catchAsync(async (req, res) => {
    const { title, location, date, maxSeats, status } = req.body;
    const image = req.file ? req.file.buffer : undefined;

    const sanitizedTitle = title === '' ? undefined : title;
    const sanitizedLocation = location === '' ? undefined : location;
    const sanitizedDate = date === '' ? undefined : date;
    const sanitizedStatus = status === '' ? undefined : status;
    const maxSeatsAsNumber = maxSeats === '' ? undefined : maxSeats ? parseInt(maxSeats, 10) : undefined;

    const concert = await concertService.updateConcertById(
        req.params.concertId,
        sanitizedTitle,
        sanitizedLocation,
        sanitizedDate,
        maxSeatsAsNumber,
        sanitizedStatus,
        image
    );
    if (!concert) {
        throw new ApiError(httpStatus.NOT_FOUND, "Concert not found");
    }
    res.status(200).send(concert);
});


export default {
    createConcert,
    getConcerts,
    getConcert,
    deleteConcert,
    updateConcert
};