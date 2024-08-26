import React from 'react';

const TiradaConstructor = (props) => {
    let r = "";

    if (props.resultado === "[]") return (<span>Tirada en proceso</span>)
    else switch (props.idSistema) {
        case 0:
            return (
                <span>Genérico</span>
            )
        case 1:
            r = JSON.parse(props.resultado)
            console.log(r)
            return (

                <div className="contenidoTirada">

                    <p className="detalleTirada">Motivo: {r.motivo}</p>
                    <p className="detalleTirada">Dados lanzados: {r.lanzados}</p>
                    <p className="detalleTirada">Dados guardados: {r.guardados}</p>
                    <p className="detalleTirada">Modificador: {r.modificador > 0 ? "+" : ""}{r.modificador}</p>
                    <p className="detalleTirada">Dificultad: {r.dificultad}</p>

                    <p className="resultadoTirada">
                        {r.resultado.map((i, index) =>
                            <React.Fragment key={index}>
                                <span className="numeroTirada">{i}</span>
                                {index < r.resultado.length - 1 && <span className="separadorTirada">, </span>}
                            </React.Fragment>
                        )}
                    </p>
                    <p className="detalleTirada">Resultado:
                        {r.resultado.sort(function (a, b) { return b - a }).splice(0,r.guardados).map((i, index) =>
                            <React.Fragment key={index}>
                                <span className="numeroTirada">{i}</span>
                                {index < r.guardados - 1 && <span className="separadorTirada">+ </span>}
                            </React.Fragment>
                        )}
                        {r.modificador !== 0 ? ("+(" + (r.modificador > 0 ? ("+") : ("")) + r.modificador + ") =") : " ="}
                        {r.suma}</p>
                    {
                        r.suma >= r.dificultad + 15 ? <p>Cuatro grados de éxito. Éxito asombroso.</p> :
                            r.suma >= r.dificultad + 10 ? <p>Tres grados de éxito. Éxito increíble.</p> :
                                r.suma >= r.dificultad + 5 ? <p>Dos grados de éxito. Éxito considerable.</p> :
                                    r.suma >= r.dificultad ? <p>Un grado de éxito. Éxito insignificante.</p> :
                                        r.suma >= r.dificultad - 4 ? <p>Fallo insignificante.</p>
                                            : <p>Fallo crítico.</p>
                    }
                </div>


            )
        case 2:

            r = JSON.parse(props.resultado)


            return (
                <div className="contenidoTirada">

                    <p className="detalleTirada">Motivo: {r.motivo}</p>
                    <p className="detalleTirada">Reserva: {r.reserva}</p>
                    <p className="detalleTirada">Dificultad: {r.dificultad}</p>
                    {r.fdv && <p className="detalleTirada">Has usado fuerza de voluntad.</p>}
                    {r.especialidad && <p className="detalleTirada">Has usado una especialidad.</p>}

                    <p className="resultadoTirada">
                        {r.resultado.map((i, index) =>
                            <React.Fragment key={index}>
                                <span className="numeroTirada" style={{ fontWeight: i >= r.dificultad ? "bold" : "regular" }}>{i === 10 ? "☥" : i}</span>
                                {index < r.resultado.length - 1 && <span className="separadorTirada">, </span>}
                            </React.Fragment>
                        )}
                    </p>
                    <p className="detalleTirada">Éxitos: {Math.max(r.exitos - r.unos, 0)}</p>
                    {r.exitos === 0 && r.unos > 0 && !r.fdv && <p className="detalleTirada">Pifia</p>}
                    {r.exitos === 0 && r.unos > 0 && r.fdv && <p className="detalleTirada">Has tenido 1 éxito gracias al gasto de fuerza de voluntad.</p>}
                    {r.exitos - r.unos >= r.dificultad && <p className="detalleTirada">Has tenido éxito en tu tirada.</p>}
                </div>

            )

        default:
            return (
                <span>
                    Estamos trabajando en ello
                </span>
            );
    }
}

export default TiradaConstructor;
