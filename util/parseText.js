const htmlEntities = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#x2F;": '/',
};

const hexArray = ["&amp;", "&lt;", "&gt;", "&quot;", "&#x27;"];

const ParseText = (text) => {
  var copy = text.toString();
  return copy.replace(
    /&lt;|&gt;|&quot;|&#x27;|&#x2F;|&amp;/gi,
    (match) => htmlEntities[match]
  );
};

module.exports = ParseText;
