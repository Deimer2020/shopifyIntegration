import { City } from "../../../types/cityApi.data";

export class CityService {
  public static async obtainCity(
    city: string,
    dpto: string
  ): Promise<City | null> {
    try {
      const response = await fetch(
        `https://maemioficial.com/apidanementa/public/api/citydane/${city.toLowerCase()}`
      );
      const ciudades = (await response.json()) as City[];
      ciudades.filter(
        (cityMath: City) =>
          cityMath.municipio.toLowerCase() === city.toLowerCase() &&
          cityMath.departamento.toLowerCase() === dpto.toLowerCase()
      );

      return ciudades.length > 0 ? ciudades[0] : null;
    } catch (error) {
      return null;
    }
  }
}
