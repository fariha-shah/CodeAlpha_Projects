import useWhiteboard from '../hooks/useWhiteboard';
import { Pen, Eraser, Trash2, Undo2, Minus, Plus, X } from 'lucide-react';
import styles from './Whiteboard.module.css';

const COLORS = [
  '#ffffff',
  '#ff6b6b',
  '#ffd93d',
  '#6bcb77',
  '#3ecfcf',
  '#6c63ff',
  '#f472b6',
  '#fb923c',
  '#000000',
];

export default function Whiteboard({ roomId, onClose }) {
  const {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    undo,
    clearCanvas,
  } = useWhiteboard({ roomId });

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            {/* Pen */}
            <button
              className={`${styles.toolBtn} ${tool === 'pen' ? styles.active : ''}`}
              onClick={() => setTool('pen')}
              title="Pen"
            >
              <Pen size={16} />
              <span style={{ marginLeft: 4, fontSize: 12 }}>Pen</span>
            </button>

            {/* Eraser */}
            <button
              className={`${styles.toolBtn} ${tool === 'eraser' ? styles.active : ''}`}
              onClick={() => setTool('eraser')}
              title="Eraser"
            >
              <Eraser size={16} />
              <span style={{ marginLeft: 4, fontSize: 12 }}>Eraser</span>
            </button>

            <div className={styles.divider} />

            {/* Colors */}
            <div className={styles.colors}>
              {COLORS.map((c) => (
                <button
                  key={c}
                  className={`${styles.colorBtn} ${color === c ? styles.selectedColor : ''}`}
                  style={{ background: c }}
                  onClick={() => {
                    setColor(c);
                    setTool('pen');
                  }}
                  title={c}
                />
              ))}
            </div>

            <div className={styles.divider} />

            {/* Brush Size */}
            <div className={styles.sizeControl}>
              <button
                className={styles.toolBtn}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '2px 6px',
                }}
                onClick={() => setBrushSize((s) => Math.max(1, s - 1))}
              >
                <Minus size={14} color="#fff" />
              </button>
              <span className={styles.sizeLabel}>{brushSize}px</span>
              <button
                className={styles.toolBtn}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: '2px 6px',
                }}
                onClick={() => setBrushSize((s) => Math.min(30, s + 1))}
              >
                <Plus size={14} color="#fff" />
              </button>
            </div>

            <div className={styles.divider} />

            {/* Undo */}
            <button className={styles.toolBtn} onClick={undo} title="Undo">
              <Undo2 size={16} />
              <span style={{ marginLeft: 4, fontSize: 12 }}>Undo</span>
            </button>

            {/* Clear */}
            <button
              className={`${styles.toolBtn} ${styles.danger}`}
              onClick={clearCanvas}
              title="Clear All"
            >
              <Trash2 size={16} />
              <span style={{ marginLeft: 4, fontSize: 12 }}>Clear</span>
            </button>
          </div>

          {/* Close Button */}
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Canvas */}
        <div className={styles.canvasWrapper}>
          <canvas
            ref={canvasRef}
            width={1200}
            height={650}
            className={styles.canvas}
            style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair' }}
          />
        </div>

        {/* Status Bar */}
        <div className={styles.statusBar}>
          <span>
            Tool: <b>{tool}</b>
          </span>
          <span>
            Size: <b>{brushSize}px</b>
          </span>
          <span>
            Color:{' '}
            <b style={{ color: color === '#000000' ? '#fff' : color }}>
              {color}
            </b>
          </span>
          <span style={{ marginLeft: 'auto', color: '#555' }}>
            Draw to collaborate in real-time
          </span>
        </div>
      </div>
    </div>
  );
}
