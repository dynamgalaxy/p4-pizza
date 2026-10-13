export type Variant = { name: string; price: number };
export type Product = {
  slug: string;
  name: string;
  category: string;
  description?: string;
  variants: Variant[];
  image: string;
  badge?: string;
};

// Replace representative images with exact product photos as they become available.
export const photos = {
  pizza: "/images/pizza.jpg",
  tikka: "/images/ready/chicken-pizza.webp",
  burger: "/images/burger-editorial.png",
  deal: "/images/burger.jpg",
  chicken: "/images/ready/fried4.webp",
  fries: "/images/ready/fries.webp",
  loadedFries: "/images/ready/frenchfries.webp",
  nuggets: "/images/ready/nuggets1.webp",
  chickenRoll: "/images/ready/chicken-roll.webp",
  pasta: "/images/pasta.jpg",
  wrap: "/images/wrap.jpg",
};
const ready = (name: string) => `/images/ready/${name}.webp`;
const pizzaDealPhoto = (contents: string) => /tikka|crown|malai|behri kabab/i.test(contents) ? photos.tikka : photos.pizza;
const specialDealPhotos: Record<string, string> = {
  D2: ready("deal1"), D3: ready("deal3"), D5: ready("deal2"), D6: ready("deal8"),
  D8: ready("deal1"), D9: ready("deal4"), D11: ready("deal1"), D14: ready("deal1"),
  D16: ready("deal6"), D18: ready("deal2"), D20: ready("deal7"), D22: photos.loadedFries,
  D23: ready("deal7"),
};

const classic = [
  ["Chicken Tikka", "Cheese, Chicken Tikka, Capsicum, Tomato"],
  ["Chicken Fajita", "Cheese, Chicken Fajita, Capsicum, Pepperoni"],
  ["Chicken Supreme", "Cheese, Chicken Tikka, Onions, Capsicum, Mushrooms, Olives"],
  ["Hot N Spicy Pizza", "Hot N Spicy Chicken, Black Olive, Capsicum, Tomato Sauce, Cheese, Jalapeno"],
  ["Cheese Lover", "Lots of Cheese"],
  ["Vegetarian Pizza", "All Veggie, Onions, Capsicum, Jalapeno, Mushrooms"],
  ["Tandoori Pizza", "Tandoori Chicken, Cheese, Special Sauce, Onion, Capsicum, Tomato"],
  ["Grilled Pizza", "Cheese, Smoke Chicken, Onion, Mushroom"],
  ["Mushroom Pizza", "Chicken, Cheese, Lot Of Mushroom, Special Sauce"],
];
const special = [
  ["P4 Special", "Tikka Chicken, Onions, Cheese, Olives, Capsicum, Tomato"],
  ["Crown Crust", "Tikka Chicken, Onions, Cheese, Olives, Capsicum, Tomato, Chicken In Side Filling"],
  ["Cheese Crust", "Tikka Chicken, Onions, Cheese, Olives, Capsicum, Cheese In Sides Filling"],
  ["Kabab Crust", "Tikka Chicken, Onions, Cheese, Olives, Capsicum, Kabab In Sides Filling, Jalapeno"],
  ["Behari Kabab Pizza", "Tikka Chicken, Onions, Cheese, Olives, Capsicum, Behari Kabab"],
  ["Malai Boti Pizza", "Malai Boti Chicken, Olives, Capsicum, Onion"],
];
const slug = (value: string) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const one = (name: string, category: string, price: number, image: string, description?: string): Product => ({
  slug: slug(name), name, category, description, variants: [{ name: "Regular", price }], image,
});
const deal = (code: string, name: string, price: number, description: string, image = photos.pizza): Product => ({
  slug: `${slug(name)}-${code.toLowerCase().replace(/\s/g, "")}`,
  name: `${name} ${code}`, category: name, description: name === "Mid Night Deal" ? `${description}. Valid 10:30 PM until closing; coupon not valid.` : description, variants: [{ name: "Deal", price }], image, badge: code,
});

export const products: Product[] = [
  ...classic.map(([name, description]) => ({ slug: slug(name.endsWith("Pizza") ? name : `${name} Pizza`), name: name.endsWith("Pizza") ? name : `${name} Pizza`, category: "Classic Pizzas", description, variants: [{ name: "Small", price: 680 }, { name: "Medium", price: 1100 }, { name: "Large", price: 1500 }, { name: "X-Large", price: 2000 }], image: ["Cheese Lover", "Vegetarian Pizza", "Mushroom Pizza"].includes(name) ? photos.pizza : photos.tikka })),
  ...special.map(([name, description]) => ({ slug: slug(name.endsWith("Pizza") ? name : `${name} Pizza`), name: name.endsWith("Pizza") ? name : `${name} Pizza`, category: "Special Pizzas", description, variants: [{ name: "Small", price: 800 }, { name: "Medium", price: 1250 }, { name: "Large", price: 1700 }, { name: "X-Large", price: 2200 }], image: photos.tikka })),
  ...[["Zinger Burger",430,photos.burger],["Patty Burger",350,photos.deal],["Tower Burger",580,photos.deal],["Double Masti Burger",650,ready("deal4")],["Grilled Burger",450,photos.deal]].map(([name, price, image]) => one(String(name), "Burgers", Number(price), String(image))),
  ...[["Behari Roll",400],["Chicken Roll / Shawarma",280],["Zinger Roll / Shawarma",400],["Arabian Roll",320]].map(([name, price]) => one(String(name), "Shawarma & Rolls", Number(price), /Chicken|Zinger/.test(String(name)) ? photos.chickenRoll : photos.wrap)),
  { slug: "creamy-pasta", name: "Creamy Pasta", category: "Pasta", variants: [{ name: "Small", price: 480 }, { name: "Large", price: 750 }], image: photos.pasta },
  { slug: "crunchy-pasta", name: "Crunchy Pasta", category: "Pasta", variants: [{ name: "Small", price: 550 }, { name: "Large", price: 850 }], image: photos.pasta },
  one("Calezone + Fries + Dip", "Calzone", 999, photos.pizza),
  one("2 PC Behari Roll + 5 Wings + Reg Fries + Dip", "Platter", 920, photos.chicken),
  ...[["Chicken PC",240],["Choice Chicken PC",280],["5 Chicken PCS",1150],["9 Chicken PCS",1950]].map(([name, price]) => one(String(name), "Crispy Chicken", Number(price), String(name).endsWith(" PC") ? ready("fried1") : photos.chicken)),
  { slug: "hot-wings", name: "Hot Wings", category: "Hot Wings", variants: [{ name: "05 PC", price: 350 }, { name: "20 PCS", price: 1250 }], image: ready("fried3") },
  { slug: "fries", name: "Fries", category: "Fries", variants: [{ name: "Regular", price: 250 }, { name: "Medium", price: 350 }, { name: "Large", price: 450 }], image: photos.fries },
  { slug: "loaded-fries", name: "Loaded Fries", category: "Fries", variants: [{ name: "Small", price: 500 }, { name: "Large", price: 750 }], image: photos.loadedFries },
  { slug: "nuggets", name: "Nuggets", category: "Nuggets", variants: [{ name: "5 Nuggets", price: 300 }, { name: "10 Nuggets", price: 550 }], image: photos.nuggets },
  { slug: "cheese-slice-add-on", name: "Cheese Slice Add On", category: "Add Ons", description: "For burgers, shawarma and rolls", variants: [{ name: "Cheese Slice", price: 60 }], image: photos.burger },
  { slug: "extra-chicken-and-cheese-toppings", name: "Extra Chicken & Cheese Toppings", category: "Add Ons", description: "For pizzas", variants: [{ name: "Small", price: 100 }, { name: "Medium", price: 200 }, { name: "Large", price: 300 }, { name: "X-Large", price: 400 }], image: photos.pizza },
  ...[
    ["B1",620,"Petty Burger, Fries, Reg Drink"],["B2",700,"Zinger Burger, Fries, Reg Drink"],["B3",950,"Zinger Burger, 1 PC, Fries, Reg Drink"],["B4",1150,"Small Tikka, Zinger, 500 ml Drink"],["B5",1600,"Small Tikka, 2 Zinger, 1 Ltr Drink"],["B6",1250,"Small Tikka, Small Pasta, 1 Ltr Drink"],["B7",1450,"2 Small Tikka, 1 Ltr Drink"],["B8",1250,"Med Crown Crust, 500 ml Drink"],["B9",2000,"Med Tikka, 2 Zinger, 1 Ltr Drink"],["B10",1600,"Large Tikka, 1 Ltr Drink"],["B11",1750,"Large Crown Crust, 1 Ltr Drink"],["B12",2150,"Xlarge Tikka, 1.5 Ltr Drink"],["B13",2300,"XL Crown Crust, 1.5 Ltr Drink"],["B14",3200,"Large Crown & Tikka, 1.5 Ltr Drink"],
  ].map(([code, price, contents]) => deal(String(code), "Bumper Deal", Number(price), String(contents), code === "B1" ? photos.deal : code === "B2" ? photos.burger : code === "B3" ? ready("deal3") : photos.tikka)),
  ...[
    ["W1",1150,"2 Zinger Burger, Reg Fries, 500 ml Drink"],["W2",1350,"3 Zinger Burger, 1 Ltr Drink"],["W3",1450,"2 Zinger Burger, Fries, 5 Wings, 500 ml Drink"],["W4",1350,"2 Double Masti Burger, 500 ml Drink"],["W5",1750,"4 Zinger Burger, 1 Ltr Drink"],["W6",2150,"5 Zinger Burger, 1.5 Ltr Drink"],["W7",1150,"4 Chicken Roll, 1 Ltr Drink"],["W8",1250,"5 Chicken PCS, 1 Ltr Drink"],
  ].map(([code, price, contents]) => deal(String(code), "Wow Deal", Number(price), String(contents), ready(`deal${String(code).slice(1)}`))),
  ...[
    ["N1",900,"2 Zinger Burger, 500 ml Drink"],["N2",1400,"2 Small Pizza, 1 Ltr Drink"],["N3",1250,"Med Malai Boti, 500 ml Drink"],["N4",1500,"Large Pizza, 1 Ltr Drink"],["N5",2100,"Xlarge Pizza, 1.5 Ltr Drink"],["N6",3450,"2 Large Pizza, 1 Small Pizza"],
  ].map(([code, price, contents]) => deal(String(code), "Mid Night Deal", Number(price), String(contents), code === "N1" ? ready("night1") : pizzaDealPhoto(String(contents)))),
  deal("BD1", "Birthday Deal", 3800, "Large Crown, 2 Zinger Burger, Large Fries, 1 Pound Cake, 1.5 Ltr Drink", ready("deal1")),
  deal("BD2", "Birthday Deal", 5200, "2 Large Pizza, 10 Hot Wings, Large Fries, 1 Pound Cake, 1.5 Ltr Drink", photos.pizza),
  { slug: "tripple-pizza-deal", name: "Tripple Pizza Deal", category: "Tripple Pizza Deals", description: "3 pizzas with drink", variants: [{ name: "S — 3 Small + 1 Ltr Drink", price: 2100 }, { name: "M — 3 Medium + 1 Ltr Drink", price: 3350 }, { name: "L — 3 Large + 1 Ltr Drink", price: 4450 }, { name: "XL — 3 X-Large + 1.5 Ltr Drink", price: 5800 }], image: photos.pizza },
  ...[
    ["D1", 1250, "Small Pizza, Zinger Burger, 500 ml Drink"], ["D2", 1750, "Small Crown Crust, 2 Zinger Burger, 500 ml Drink"],
    ["D3", 1550, "2 Zinger Burger, 5 Hot Wings, Reg Fries, 500 ml Drink"], ["D4", 1450, "Small Crown Crust, Small Creamy Pasta, 500 ml Drink"],
    ["D5", 1400, "3 Zinger Burgers, 1 Ltr Drink"], ["D6", 1300, "5 Chicken PCS, 1 Ltr Drink"],
    ["D7", 1350, "Medium Crown Crust, 500 ml Drink"], ["D8", 2100, "Medium Pizza, 2 Zinger Burgers, 1 Ltr Drink"],
    ["D9", 1400, "2 Double Masti Burger, 500 ml Drink"], ["D10", 1650, "Large Tikka Pizza, 1 Ltr Drink"],
    ["D11", 1400, "2 Zinger Burger, 2 Reg Fries, 500 ml Drink"], ["D12", 1850, "Large Crown Crust, 1 Ltr Drink"],
    ["D13", 2200, "3 Small Pizza, 1.5 Ltr Drink"], ["D14", 1750, "Large Crunchy Pasta, 2 Zinger Burger, 500 ml Drink"],
    ["D15", 2150, "Large Behri Kabab, 5 Hot Wings, 1 Ltr Drink"], ["D16", 2250, "5 Zinger Burgers, 1.5 Ltr Drink"],
    ["D17", 1500, "2 Small Pizza, 1 Ltr Drink"], ["D18", 2900, "Large Tikka Pizza, 3 Zinger Burgers, 1.5 Ltr Drink"],
    ["D19", 1300, "Small Tikka Pizza, 2 Chicken PCS, 500 ml Drink"], ["D20", 1250, "4 Chicken Roll, 1 Ltr Drink"],
    ["D21", 2200, "X-Large Pizza, 1.5 Ltr Drink"], ["D22", 1450, "Calezone + Fries, 5 Hot Wings, 500 ml Drink"],
    ["D23", 1200, "4 PCS Behari Roll, Reg Fries, 500 ml Drink"], ["D24", 1350, "Small Crown Crust, Behari Roll, 500 ml Drink"],
    ["D25", 2000, "Med Malai Boti Pizza, Small Tikka Pizza, 1 Ltr Drink"], ["D26", 1400, "Malai Boti Small, 2 Chicken Roll, 500 ml Drink"],
    ["D27", 2400, "X-Large Crown Crust, 1.5 Ltr Drink"],
  ].map(([code, price, contents]) => deal(String(code), "Special Deal", Number(price), String(contents), specialDealPhotos[String(code)] || pizzaDealPhoto(String(contents)))),
];

export const categories = [...new Set(products.map((product) => product.category))];
export const money = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;
export const selectedName = (product: Product, variant: string) => {
  if (variant === "Deal" || (variant === "Regular" && product.variants.length === 1)) return product.name;
  if (variant.toLowerCase().includes(product.name.toLowerCase())) return variant;
  return `${variant} ${product.name}`;
};
