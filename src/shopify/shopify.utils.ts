export class ShopifyUtils {
  public static getByProductByKey(value: string, key: string, list: any[]) {
    let productFind = null;
    const filterProduct: any[] = list.filter(
      (variant: any) => variant[key] == value
    );
    if (filterProduct.length > 0) {
      productFind = filterProduct[0];
    }

    return productFind;
  }
}
