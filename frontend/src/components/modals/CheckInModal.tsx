import React, { useState, useEffect } from 'react';

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, userName }) => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      setTime(now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
      setDate(`${days[now.getDay()]}, ${now.toLocaleDateString('vi-VN')}`);
    }
  }, [isOpen]);

  const handleCheckIn = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:3000/api/attendance/check-in-out', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        console.log('Check-in successful');
        onClose();
      }
    } catch (err) {
      console.error('Check-in failed', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" id="modal-checkin">
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">⏱️ Chấm công</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{textAlign: 'center', padding: '2rem'}}>
          <div style={{fontSize: '3rem', marginBottom: '0.5rem'}}>⏱️</div>
          <div id="clock-time" style={{fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-2px'}}>{time}</div>
          <div style={{color: 'var(--ink-mute)', fontSize: '0.85rem', marginTop: '4px'}} id="clock-date">{date}</div>
          <div style={{margin: '1.5rem 0', padding: '1rem', background: 'var(--paper)', borderRadius: 'var(--radius)'}}>
            <div style={{fontSize: '0.82rem', color: 'var(--ink-mute)'}}>Nhân viên</div>
            <div style={{fontWeight: 600, marginTop: '3px'}} id="checkin-user-name">{userName}</div>
          </div>
          <button className="btn btn-accent" style={{width: '100%', padding: '14px', fontSize: '1rem'}} onClick={handleCheckIn}>
            ✅ Xác nhận chấm công
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal;