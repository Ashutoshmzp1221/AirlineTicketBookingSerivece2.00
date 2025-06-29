const { response } = require('express');
const { BookingService } = require('../services/index');
const { StatusCodes } = require('http-status-codes')
const bookingService = new BookingService();

const create = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.OK).json({
            message : 'Successfully completed the booking',
            success : true,
            err : {},
            data : response
        });
    } catch (error) {
        return res.status(error.statusCodes || 500).json({
            message : error.message,
            success : false,
            err : error.explanation,
            data : {}
        })
    }
}

const cancel = async (req, res) => {
    try {
        console.log(req.params.bookingId);
        const response = await bookingService.cancelBooking({
            bookingId: req.params.bookingId,
            ...req.body
        });
    
        return res.status(StatusCodes.OK).json({
            message: 'Booking cancelled successfully',
            success: true,
            err: {},
            data: response
        });
        } catch (error) {
        return res.status(error.statusCode || 500).json({
            message: error.message || 'Something went wrong',
            success: false,
            err: error.explanation || 'Internal Server Error',
            data: {}
        });
    }
};
  

module.exports = {
    create,
    cancel
}