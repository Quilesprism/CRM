    import React, { useState } from "react";

    function DireccionRR({ onDireccionChange }) {
        const [tipoVia, setTipoVia] = useState("");
        const [viaPrincipal, setViaPrincipal] = useState("");
        const [letra1, setLetra1] = useState("");
        const [prefijo1, setPrefijo1] = useState("");
        const [letra2, setLetra2] = useState("");
        const [cuadrante, setCuadrante] = useState("");
        const [viaGeneradora, setViaGeneradora] = useState("");
        const [letra3, setLetra3] = useState("");
        const [prefijo2, setPrefijo2] = useState("");
        const [numeroPlaca, setNumeroPlaca] = useState("");
        const [cuadrante2, setCuadrante2] = useState("");
        const [nomenclatura, setNomenclatura] = useState("");
      
        function actualizar() {
          const partes = [
            tipoVia,
            viaPrincipal,
            letra1,
            prefijo1,
            letra2,
            cuadrante,
            viaGeneradora,
            letra3,
            prefijo2,
            numeroPlaca,
            cuadrante2,
            nomenclatura,
          ];
      
          const direccionFinal = partes
            .filter(parte => parte && parte.trim() !== "")
            .join(" ")
            .replace(/\s+/g, " ")
            .trim();
      
          if (onDireccionChange) {
            onDireccionChange(direccionFinal);
          }
        }
  
    return (
        <div>
        <h3>Formulario Dirección RR</h3>
        <div>
            <label>Tipo de vía:</label>
            <input type="text" value={tipoVia} onChange={(e) => setTipoVia(e.target.value)} />
        </div>
        <div>
            <label>Vía principal:</label>
            <input type="text" value={viaPrincipal} onChange={(e) => setViaPrincipal(e.target.value)} />
        </div>
        <div>
            <label>Letra 1:</label>
            <input type="text" value={letra1} onChange={(e) => setLetra1(e.target.value)} />
        </div>
        <div>
            <label>Prefijo 1:</label>
            <input type="text" value={prefijo1} onChange={(e) => setPrefijo1(e.target.value)} />
        </div>
        <div>
            <label>Letra 2:</label>
            <input type="text" value={letra2} onChange={(e) => setLetra2(e.target.value)} />
        </div>
        <div>
            <label>Cuadrante:</label>
            <input type="text" value={cuadrante} onChange={(e) => setCuadrante(e.target.value)} />
        </div>
        <div>
            <label>Vía generadora:</label>
            <input type="text" value={viaGeneradora} onChange={(e) => setViaGeneradora(e.target.value)} />
        </div>
        <div>
            <label>Letra 3:</label>
            <input type="text" value={letra3} onChange={(e) => setLetra3(e.target.value)} />
        </div>
        <div>
            <label>Prefijo 2:</label>
            <input type="text" value={prefijo2} onChange={(e) => setPrefijo2(e.target.value)} />
        </div>
        <div>
            <label>Número placa:</label>
            <input type="text" value={numeroPlaca} onChange={(e) => setNumeroPlaca(e.target.value)} />
        </div>
        <div>
            <label>Cuadrante 2:</label>
            <input type="text" value={cuadrante2} onChange={(e) => setCuadrante2(e.target.value)} />
        </div>
        <div>
            <label>Nomenclatura:</label>
            <input type="text" value={nomenclatura} onChange={(e) => setNomenclatura(e.target.value)} />
        </div>
        <div>
            <button type="button" onClick={actualizar}>Actualizar Dirección</button>
        </div>
        <div>
        <button type="button" onClick={actualizar}>
          Actualizar Dirección
        </button>
      </div>
        </div>
    );
    }

    export default DireccionRR;
