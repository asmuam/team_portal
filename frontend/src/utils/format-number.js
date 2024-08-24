import numeral from "numeral";
import { registerIndonesianCurrencyFormat } from "./custom-format";

/**
 * Fungsi mempersingkat angka numerik
 */

registerIndonesianCurrencyFormat();

//Format angka
export function fNumber(number) {
  return numeral(number).format();
}

//Format angka menjadi dollar
export function fCurrency(number) {
  const format = number ? numeral(number).format("$0,0.00") : "";

  return result(format, ".00");
}

//Format persen
export function fPercent(number) {
  const format = number ? numeral(Number(number) / 100).format("0.0%") : "";

  return result(format, ".0");
}

//Meringkas angka ke rupiah
export function fShortenNumber(number) {
  let format;

  if (number >= 1000000000000 || number <= -1000000000000) {
    format = (number / 1000000000000).toFixed(2) + "T";
  } else if (number >= 1000000000 || number <= -1000000000) {
    format = (number / 1000000000).toFixed(2) + "M";
  } else if (number >= 1000000 || number <= -1000000) {
    format = (number / 1000000).toFixed(2) + "jt";
  } else if (number >= 1000 || number <= -1000) {
    format = (number / 1000).toFixed(2) + "rb";
  } else {
    format = number;
  }

  return String(format).replace(".", ",");
}

//Meringkas angka dalam satuan byte
export function fData(number) {
  const format = number ? numeral(number).format("0.0 b") : "";

  return result(format, ".0");
}

function result(format, key = ".00") {
  const isInteger = format.includes(key);

  return isInteger ? format.replace(key, "") : format;
}

export function formatToRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}
