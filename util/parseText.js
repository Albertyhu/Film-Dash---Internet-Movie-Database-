const htmlEntities = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#x27;": "'",
  "&#x2F;": '/',
  "&#39;": "'",
  "&#34;": '"',
};

const ParseText = (text) => {
  var copy = text.toString();
  return copy.replace(
    /&lt;|&gt;|&quot;|&#x27;|&#x2F;|&amp;|&#39;|&#34;/gi,
    (match) => htmlEntities[match]
  );
};

module.exports = ParseText;
