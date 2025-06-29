const axios = require('axios')
const { Booking } = require('../models/index')
const { BookingRepository } = require('../repository/index')
const { FLIGHT_SERVICE_PATH, USER_SERVICE_PATH , REMINDER_BINDING_KEY} = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors/index');
const { compareTime } = require('../utils/timeCompare');
const { sequelize } = require('../models/index');
const { sendMessage } = require('../utils/sendMessageToQueues')
const { publishMessage, getChannel } = require('../utils/messageQueues')

class BookingService {

    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async createBooking(data) {
        // const t = await sequelize.transaction();
        try {
            // console.log(data);
            const flightId = data.flightId;
            let getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);

            const flightData = response.data.data;
            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats) {
                throw new ServiceError(
                    'Something went wrong in the booking process',
                    'Insufficient seats in the flight'
                );
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);

            const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`;
            await axios.patch(updateFlightRequestURL, {totalSeats : flightData.totalSeats - booking.noOfSeats});
            const finalBooking = await this.bookingRepository.update(booking.id, {status : 'Booked'});

            // await t.commit();
            const userUrl = `${USER_SERVICE_PATH}/api/v1/user/${finalBooking.userId}`;
            const user = await axios.get(userUrl);
            sendMessage(user, response.data.data, finalBooking)
            return finalBooking;
        } catch (error) {
            // await t.rollback();
            console.log(error)
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error;
            }
            throw new ServiceError('Booking failed', error.message);
        }
    }

    async cancelBooking(data) {
        try {
            const { bookingId } = data;
            const cancellationTime = new Date();
        
            const booking = await this.bookingRepository.get(bookingId);
            if (!booking) {
                throw new ServiceError('Booking not found', 'Invalid booking ID provided');
            }
        
            const flightId = booking.flightId;
            const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestURL);
        
            const departureTime = new Date(response.data.data.departureTime);
        
            if (compareTime(departureTime, cancellationTime)) {
                const updateResponse = await this.bookingRepository.update(bookingId, { status: 'Cancelled' });
                return updateResponse;
            } else {
                throw new ServiceError(
                'Cancellation window expired',
                'You can only cancel the ticket at least 2 hours before flight departure'
                );
            }
            } catch (error) {
            console.error(error);
            if (error instanceof ServiceError) throw error;
        
            throw new ServiceError(
                'Something went wrong in the cancellation process',
                error.message
            );
        }
    }


}

module.exports = BookingService;