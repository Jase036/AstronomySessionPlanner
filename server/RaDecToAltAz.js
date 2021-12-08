class RaDecToAltAz{
    constructor(ra,dec,date, lat,lng){
    this.date = date;
    this.ra = ra;
    this.dec = dec;
    this.lat = lat;
    this.lng = lng;
    }
    
    // Convert the received time to local sidereal time
    lst = () => {
    let lstjs = require('local-sidereal-time');
    this.lst_hours = lstjs.getLST(this.date, this.lng);
    
    return this.lst_hours;
    }

    //convert decimal hour values to degrees
    hourToDeg = (hour) => {
    return hour*15;
    }


    /*
        Calculate the hour angle (angle between observer's meridian and the hour circle and
        the object's circle). For this we use sidereal time and right ascension (RA) in degrees.
        We account for the Earth's rotation by replacing the RA by the Hour Angle. The HA of an
        object increases with siderial time, but the declination stays the same, as the DEC 
        measures the angle from the Earth's equator. We calculate the HA in degrees, so that 
        we can calculate sines and cosines later. 
    */

    ha = () => {
    let ha = (this.hourToDeg(this.lst()) - this.hourToDeg(this.ra));
    if (ha < 0){ha = 360 + ha;}
    
    return ha;
    }


    // This method does the actual conversion of ra/dec to alt/az
    raDecToAltAz = () => {
        let az=''
        
        /*  
            Convert our values to radians since the trig functions in Javascript's Math
            use radians instead of degrees
        */
        const haRad = this.ha() *Math.PI/180
        const decRad = this.dec *Math.PI/180
        const latRad = this.lat *Math.PI/180

        //calculate the sine of the altitude 
        const sinalt = Math.sin(decRad)*Math.sin(latRad)+Math.cos(decRad)*Math.cos(haRad)*Math.cos(latRad)
        
        //with the sine of the altitude we can finally calculate the alt above the horizon
        const alt=Math.asin(sinalt)
        
        //calculate the sine of the azimuth
        const sinaz=-Math.cos(decRad)*Math.sin(haRad)/Math.cos(alt)
        
        //calculate the cosine of the azimuth
        const cosaz=Math.sin(decRad)*Math.cos(latRad)-Math.cos(decRad)*Math.cos(haRad)*Math.sin(latRad)
        
        //if either one is 0 or negative we invert
        if(cosaz <= 0.0) {
            az=Math.PI-Math.asin(sinaz)
        } else {
            if(sinaz <= 0.0) {
            az=2*Math.PI+Math.asin(sinaz)
            } else {
            az=Math.asin(sinaz)
            }
        }
        //for the result we convert the values from radians to degrees
        return {alt: alt*180/Math.PI, az: az*180/Math.PI}
    }
}
module.exports = RaDecToAltAz;