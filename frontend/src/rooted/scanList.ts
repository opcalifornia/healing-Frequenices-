import type { Product } from "./foodLookup";
import type { ListItem } from "../store/nourish";

/** The shopping-list entry for a scanned product, so a scan can go straight onto the list. */
export function productListItem(p: Pick<Product, "code" | "name" | "brand" | "quantity">): Omit<ListItem, "checked"> {
  const name = p.brand && !p.name.toLowerCase().includes(p.brand.toLowerCase()) ? `${p.name} (${p.brand})` : p.name;
  return { id: `scan-${p.code}`, name, aisle: "Packaged foods", qty: p.quantity };
}
