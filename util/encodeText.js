
const htmlEntities = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": '&#x2F;',
};


const encodeText = (text) => {
    var copy = text.toString();
    return copy.replace(
        /&|<|>|"|'|\//gi,
        (match) => htmlEntities[match]
    );
};

module.exports = encodeText;
