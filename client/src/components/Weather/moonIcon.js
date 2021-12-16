
// logic to select the different moon icons based on 
// illumination and phase value (waxing or waning).

const moonIcon = (illumination, value) => {
    
    let iconSrc=''

    if (illumination > 96 && value < 0.5){
        iconSrc = '../assets/full.png'
    } else if (illumination > 96 && value > 0.5){
        iconSrc = '../assets/full.png'
    } else if (illumination > 80 && value < 0.5){
        iconSrc = '../assets/waxing6.png'
    } else if (illumination > 80 && value > 0.5){
        iconSrc = '../assets/waning1.png'
    } else if (illumination > 72 && value < 0.5){
        iconSrc = '../assets/waxing5.png'
    } else if (illumination > 72 && value > 0.5){
        iconSrc = '../assets/waning2.png'
    } else if (illumination > 64 && value < 0.5){
        iconSrc = '../assets/waxing4.png'
    } else if (illumination > 64 && value > 0.5){
        iconSrc = '../assets/waning3.png'
    } else if (illumination > 48 && value < 0.5){
        iconSrc = '../assets/waxing3.png'
    } else if (illumination > 48 && value > 0.5){
        iconSrc = '../assets/waning4.png'
    } else if (illumination > 32 && value < 0.5){
        iconSrc = '../assets/waxing2.png'
    } else if (illumination > 32 && value > 0.5){
        iconSrc = '../assets/waning5.png'
    } else if (illumination > 16 && value < 0.5){
        iconSrc = '../assets/waxing1.png'
    } else if (illumination > 16 && value > 0.5){
        iconSrc = '../assets/waning6.png'
    } else if (illumination < 8 && value < 0.5){
        iconSrc = '../assets/new.png'
    } else if (illumination < 8 && value > 0.5){
        iconSrc = '../assets/new.png'
    } else if (illumination < 16 && value > 0.5){
        iconSrc = '../assets/waning6.png'
    }
    
    return iconSrc
}

export default moonIcon;