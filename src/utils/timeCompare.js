const compareTime = (departureTime, cancelationTime) => {
    if(departureTime - cancelationTime > 2) {
        return true;
    } else {
        return false;
    }
}


module.exports = {
    compareTime
}

