
//const token=`"iMwCt4kHKP69AaCRxo/LachexSzWaFrLDWaHFM0hQGEmE/FNocgQEoDNcP5yqwh+969+W8HoQdOg2UVJ/h9ExnBANMFRmDHyZNCZIUrlnO8="`

export class InvoiceService {
    static async sendInvoiceToExternalService(data: any): Promise<void> {
        try {
            // Obtener el token dinámicamente
            const token = await obtenerToken();

            // Enviar la factura al servicio externo
            const response = await fetch('https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/GuardarFacturaVenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Error al enviar la factura: ${response.statusText}`);
            }

            console.log("Factura enviada al servicio externo exitosamente.");
        } catch (error: any) {
            console.error("Error enviando datos al servicio externo:", error.message);
            throw new Error("No se pudo enviar la factura al servicio externo.");
        }
    }
}

export async function obtenerToken(): Promise<string> {
    try {
        const response = await fetch('https://integwebapimentaoficialbodega20211022.azurewebsites.net/api/login/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                IdDocumento: "0",
                Cadena: ["iMwCt4kHKP69AaCRxo/LachexSzWaFrLDWaHFM0hQGEmE/FNocgQEoDNcP5yqwh+969+W8HoQdOg2UVJ/h9ExnBANMFRmDHyZNCZIUrlnO8="],
                HabilitarContabilidad: true,
                IdUsuario: 1,
                Usuario: "PAGINA", // Cambia estos valores dinámicamente si es necesario
                Contrasena: "PAGINA",
                Servicio: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Error obteniendo token: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data.token; // Devuelve el token obtenido de la API
    } catch (error: any) {
        console.error("Error al obtener el token:", error.message);
        throw new Error("No se pudo obtener el token de autenticación.");
    }
}

    //https://rosa-merlano.myshopify.com/checkouts/cn/Z2NwLXVzLWNlbnRyYWwxOjAxSlNDVDdTS1c3NUtKMDVNRDM0OFZKQVdN/thank-you