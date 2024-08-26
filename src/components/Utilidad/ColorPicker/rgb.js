export default function rgbToHex(c) {
    
    return ("#" +
        (c[0].toString(16).length === 1 ? ("0" + c[0].toString(16)) : c[0].toString(16)) +
        (c[1].toString(16).length === 1 ? ("0" + c[1].toString(16)) : c[1].toString(16)) +
        (c[2].toString(16).length === 1 ? ("0" + c[2].toString(16)) : c[2].toString(16)));
}