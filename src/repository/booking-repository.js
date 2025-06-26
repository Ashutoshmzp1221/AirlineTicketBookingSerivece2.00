const { Booking } = require('../models/index');
const { StatusCodes } = require('http-status-codes');

const {ValidationError, AppError} = require('../utils/errors/index')

class BookingRepository {
    async create(data) {
        try {
            const booking = await Booking.create(data);
            console.log(booking)
            return booking;
        } catch (error) {
            if(error.name == 'SequelizeValidationError') {
                throw new ValidationError(error)
            }
            throw new AppError(
                'RepositoryError',
                'Cannot create Booking',
                'There was issue in creating booking please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    async get(bookingId) {
        try {
          const booking = await Booking.findByPk(bookingId);
          return booking;
        } catch (error) {
          if (error.name === 'SequelizeValidationError') {
            throw new ValidationError(error);
          }
          throw new AppError(
            'RepositoryError',
            'Cannot fetch Booking',
            'There was an issue fetching the booking. Please try again later.',
            StatusCodes.INTERNAL_SERVER_ERROR
          );
        }
    }
      
    async update(bookingId, data) {
        try {
            const booking = await Booking.findByPk(bookingId);
            if(data.status) {
                booking.status = data.status;
            }
            await booking.save();
            return booking;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                'Cannot create Booking',
                'There was issue in creating booking please try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
    
}

module.exports = BookingRepository;