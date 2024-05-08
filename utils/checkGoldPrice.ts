export const checkGoldPriceExist = (goldPriceElement: Element) => {
  if (goldPriceElement && goldPriceElement.textContent) {
    const goldPrice = goldPriceElement.textContent.trim();
    return goldPrice;
  } else {
    console.log("Gold price element not found using selector.");
  }
};
