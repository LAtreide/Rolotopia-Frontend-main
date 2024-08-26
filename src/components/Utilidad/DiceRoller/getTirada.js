export default function getTirada(panel) {
 
    switch (panel["Sistema"]) {

        case 0:
            return panel["Escribir"].split("-").join("+-").split("++").join("+");;
        case 1:
            return panel["Dados lanzados"] + "d6";
        case 2:
            return panel["Reserva"] + "d10";
        case 3:
            return panel["Dados lanzados"] + "d10" + ("Los dados explotan" ? "!" : "");
        default:
            return "1d6";
    }
}