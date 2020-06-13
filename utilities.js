module.exports = {
	removeAlphaFromHex: function(hex) {
		if (hex.length === 7) return hex;
		if (hex.length === 6) return "#" + hex;
		if (hex.length === 9) return hex.substr(0, 7);
		if (hex.length === 8) return "#" + hex.substr(0, 6);
	}
}
