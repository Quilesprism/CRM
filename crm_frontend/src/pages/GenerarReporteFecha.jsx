import React, { useState } from 'react';
import { generarReporteExcel } from '../api/fijaApi';
import Input from '../components/forms/Input';
import Card from '../components/ui/Card';

function GenerarReporteFecha() {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerarReporte = async () => {
    setError('');
    setLoading(true);

    if (!fechaInicio || !fechaFin) {
      setError('Por favor, selecciona ambas fechas.');
      setLoading(false);
      return;
    }

    try {
      await generarReporteExcel(fechaInicio, fechaFin);
      // No necesitamos procesar datos aquí, la descarga se inicia automáticamente
    } catch (err) {
      setError('Error al generar el reporte de Excel.');
      console.error('Error al generar reporte de Excel:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h1>Generar Reporte de Ventas por Fecha (Excel)</h1>
      <Card>
        <div className="mb-3">
          <label htmlFor="fechaInicio" className="form-label">Fecha de Inicio:</label>
          <Input
            type="date"
            id="fechaInicio"
            className="form-control"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="fechaFin" className="form-label">Fecha de Fin:</label>
          <Input
            type="date"
            id="fechaFin"
            className="form-control"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleGenerarReporte} disabled={loading}>
          {loading ? 'Generando Reporte...' : 'Generar Excel'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </Card>
    </div>
  );
}

export default GenerarReporteFecha;