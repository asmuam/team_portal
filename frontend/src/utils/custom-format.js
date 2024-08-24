import numeral from "numeral";

/**
 * Konfigurasi format IDR ke numeral
 */

export const registerIndonesianCurrencyFormat = () => {
  numeral.register("format", "indonesianCurrency", {
    regexps: {
      format: /(\d)(?=(\d{3})+(?!\d))/g,
    },
    format: function (value) {
      const splitValue = value.toString().split(".");
      const beforeDecimal = splitValue[0].replace(this.regexp().format, "$1,");
      const afterDecimal = splitValue[1] ? `.${splitValue[1]}` : "";

      // Menambahkan logika tambahan untuk satuan jt, m, dan rb
      if (value >= 1000000000) {
        return `Rp ${beforeDecimal}${afterDecimal}m`;
      } else if (value >= 1000000) {
        return `Rp ${beforeDecimal}${afterDecimal}jt`;
      } else if (value >= 1000) {
        return `Rp ${beforeDecimal}${afterDecimal}rb`;
      } else {
        return `Rp ${beforeDecimal}${afterDecimal}`;
      }
    },
    unformat: function (string) {
      return string.replace(/[^\d]/g, "") || 0;
    },
  });
};
