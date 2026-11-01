import { useEffect, useRef, useState } from 'react';

export default function DeleteConfirmation({ onConfirm, onCancel, autoConfirmAfter = 3 }) {
  const [secondsLeft, setSecondsLeft] = useState(autoConfirmAfter);
  const [progress, setProgress] = useState(100);
  const intervalRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (!autoConfirmAfter || autoConfirmAfter <= 0) {
      setSecondsLeft(0);
      setProgress(0);
      return;
    }

    setSecondsLeft(autoConfirmAfter);
    setProgress(100);
    startRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startRef.current) / 1000;
      const remaining = Math.max(0, autoConfirmAfter - elapsed);
      setSecondsLeft(Math.ceil(remaining));
      setProgress(Math.max(0, (remaining / autoConfirmAfter) * 100));

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onConfirm();
      }
    }, 100);

    return () => clearInterval(intervalRef.current);
  }, [autoConfirmAfter, onConfirm]);

  const handleCancel = () => {
    clearInterval(intervalRef.current);
    onCancel();
  };

  const handleConfirm = () => {
    clearInterval(intervalRef.current);
    onConfirm();
  };

  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      {autoConfirmAfter > 0 && (
        <progress value={progress} max={100} />
      )}
      <div id="confirmation-actions">
        <button onClick={handleCancel} className="button-text">No</button>
        <button onClick={handleConfirm} className="button">Yes</button>
      </div>
    </div>
  );
}
