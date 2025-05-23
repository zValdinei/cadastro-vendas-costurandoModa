import './App.css';
import React, { useState, useEffect } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    tipo: 'concerto',
    valor: '',
  });

  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('dadosVendas');
    return savedData ? JSON.parse(savedData) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('dadosVendas', JSON.stringify(data));
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valor = parseFloat(formData.valor);
    if (isNaN(valor) || valor <= 0) {
      alert('Por favor, digite um valor válido maior que zero!');
      return;
    }

    const newEntry = {
      tipo: formData.tipo,
      valor: valor.toFixed(2),
    };

    setData([...data, newEntry]);
    setFormData({ tipo: 'concerto', valor: '' });
  };

  const handleDownloadCSV = () => {
    const csvContent = [
      ['Tipo', 'Valor'],
      ...data.map(item => [item.tipo, item.valor]),
    ]
      .map(e => e.join('-'))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'dados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h2>CADASTRO DE VENDAS</h2>
      <form id="formVenda" onSubmit={handleSubmit}>
        <label htmlFor="tipo">Selecione o Tipo:</label>
        <select name="tipo" id="tipo" value={formData.tipo} onChange={handleChange} required>
          <option value='concerto'>Conserto</option>
          <option value='encomenda'>Encomenda</option>
        </select>

        <label htmlFor="valor">Valor:</label>
        <input
          type="number"
          name="valor"
          id="valor"
          placeholder="Digite o valor"
          step="0.01"
          min="0"
          value={formData.valor}
          onChange={handleChange}
          required
        />

        <input type="submit" value="Enviar" />
      </form>

      {data.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={handleDownloadCSV}>Exportar para CSV</button>
        </div>
      )}
    </div>
  );
};

export default App;
