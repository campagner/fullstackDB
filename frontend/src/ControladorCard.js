import React from 'react';

export default function ControladorCard({ controlador, onEdit, onDelete }) {
  return (
    <div className="card">
      <div>
        <h3>{controlador.nome}</h3>
        <p><strong>Matrícula:</strong> {controlador.matricula}</p>
        <p className="muted">Criado por: {controlador.criadoPor || '—'}</p>
        {controlador.editadoPor && (
          <p className="muted">Editado por: {controlador.editadoPor}</p>
        )}
      </div>
      <div className="card-actions">
        <button className="btn small" onClick={() => onEdit(controlador)}>Editar</button>
        <button className="btn small danger" onClick={() => onDelete(controlador.id)}>Excluir</button>
      </div>
    </div>
  );
}
