export const toCurrency = (x) => {
  const sign = "Rp. "
  const con = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const data = sign + con
  return data
}