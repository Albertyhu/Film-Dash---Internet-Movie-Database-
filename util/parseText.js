const htmlEntities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#x27;": "'"
};

const hexArray = [
    "&amp;",
    "&lt;",
    "&gt;",
    "&quot;",
    "&#x27;"
]

const ParseText = text => {
    var copy = text.toString(); 
    return copy.replace(/&#x27;|&lt;|&gt;|&quot;|&#x27/gi, match => htmlEntities[match])
}

module.exports = ParseText; 