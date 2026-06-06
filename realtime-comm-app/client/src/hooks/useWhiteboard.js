import { useEffect, useRef, useState, useCallback } from 'react';
import socket from '../api/socket';

export default function useWhiteboard({ roomId }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const historyRef = useRef([]);

  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const drawLine = useCallback((ctx, x0, y0, x1, y1, color, size, tool) => {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = tool === 'eraser' ? '#1a1a2e' : color;
    ctx.lineWidth = tool === 'eraser' ? size * 4 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.closePath();
  }, []);

  // Save canvas snapshot to history
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    historyRef.current.push(canvas.toDataURL());
    if (historyRef.current.length > 30) historyRef.current.shift();
  }, []);

  // Undo
  const undo = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || historyRef.current.length === 0) return;

    historyRef.current.pop();
    const last = historyRef.current[historyRef.current.length - 1];

    if (last) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = last;
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    socket.emit('whiteboard-undo', { roomId });
  }, [roomId]);

  // Clear
  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    historyRef.current = [];
    socket.emit('whiteboard-clear', { roomId });
  }, [roomId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Mouse events
    const onMouseDown = (e) => {
      isDrawing.current = true;
      saveHistory();
      lastPos.current = getPos(e, canvas);
    };

    const onMouseMove = (e) => {
      if (!isDrawing.current) return;
      const pos = getPos(e, canvas);

      drawLine(
        ctx,
        lastPos.current.x,
        lastPos.current.y,
        pos.x,
        pos.y,
        color,
        brushSize,
        tool
      );

      socket.emit('draw', {
        roomId,
        drawData: {
          x0: lastPos.current.x,
          y0: lastPos.current.y,
          x1: pos.x,
          y1: pos.y,
          color,
          brushSize,
          tool,
        },
      });

      lastPos.current = pos;
    };

    const onMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);
    canvas.addEventListener('touchstart', onMouseDown, { passive: true });
    canvas.addEventListener('touchmove', onMouseMove, { passive: true });
    canvas.addEventListener('touchend', onMouseUp);

    // Receive draw from others
    socket.on('draw', ({ drawData }) => {
      const { x0, y0, x1, y1, color, brushSize, tool } = drawData;
      drawLine(ctx, x0, y0, x1, y1, color, brushSize, tool);
    });

    // Receive clear from others
    socket.on('whiteboard-clear', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      historyRef.current = [];
    });

    // Receive undo from others
    socket.on('whiteboard-undo', () => {
      historyRef.current.pop();
      const last = historyRef.current[historyRef.current.length - 1];
      if (last) {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = last;
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      canvas.removeEventListener('touchstart', onMouseDown);
      canvas.removeEventListener('touchmove', onMouseMove);
      canvas.removeEventListener('touchend', onMouseUp);
      socket.off('draw');
      socket.off('whiteboard-clear');
      socket.off('whiteboard-undo');
    };
  }, [roomId, color, brushSize, tool, drawLine, saveHistory]);

  return {
    canvasRef,
    tool,
    setTool,
    color,
    setColor,
    brushSize,
    setBrushSize,
    undo,
    clearCanvas,
  };
}
