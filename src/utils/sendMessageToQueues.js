const { REMINDER_BINDING_KEY } = require('../config/serverConfig')
const { getChannel, publishMessage } = require('../utils/messageQueues')

const sendMessage  = async(user, flight, booking) => {
    const channel = getChannel();
    const payload = {
        templateData: {
            passengerName: 'Anonymous',
            bookingId: booking.id,
            flightNumber: flight.flightNumber,
            flightDate: flight.departureTime,
            departureDate: flight.departureTime,
            arrivalDate: flight.arrivalTime,
            duration: (flight.arrivalDate - flight.departureTime) / 1000,
            sourceAirport: flight.departureAirportId,
            destinationAirport: flight.arrivalAirportId,
            travelClass: 'Economy',
            airlineName: 'FlyTex',
            year: new Date().getFullYear().toString(),
        },
        data : {
            subject: '🛫 Flight Booking Confirmation – FlyTex',
            content: 'This is regarding your boarding pass',
            recepientEmail: user.data.data.email,
            notificationTime: new Date()
        },
        service: 'CREATE_TICKET'
    }
    publishMessage(channel,REMINDER_BINDING_KEY, JSON.stringify(payload));
}

module.exports = {
    sendMessage
}