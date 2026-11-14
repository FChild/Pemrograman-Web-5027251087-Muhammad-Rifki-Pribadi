import { useEffect, useRef } from 'react';
import { Icon } from './Icons';
export default function Modal({ title, description, onClose, busy, children, danger = false }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);
  function handleBackdrop(event) {
    const rect = dialog.current.getBoundingClientRect();
    const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    if (event.target === dialog.current && outside && !busy) onClose();
  }
  return <dialog ref={dialog} className={`modal ${danger ? 'delete-modal' : ''}`} aria-labelledby="modal-title" aria-describedby="modal-description" aria-busy={busy} onClick={handleBackdrop} onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <button className="close-button" aria-label="Tutup pop-up" disabled={busy} onClick={onClose}><Icon name="close" /></button>
    {danger && <div className="delete-symbol"><Icon name="trash" size={29} /></div>}
    <h2 id="modal-title">{title}</h2>
    <p id="modal-description" className="modal-description">{description}</p>
    {children}
  </dialog>;
}
