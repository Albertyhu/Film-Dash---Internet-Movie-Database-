const Join = (arr) => {
    var stringData = "" 
    arr.forEach((val, ind) => {
        if (ind < arr.length - 1)
            stringData += val + "|";
        else
            stringData += val; 
    })
    return stringData; 

}
module.exports = Join; 