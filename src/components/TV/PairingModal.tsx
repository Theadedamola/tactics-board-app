import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Smartphone, CheckCircle, Copy, Check } from 'lucide-react';
import { ConnectionStatus } from '../../services/peerSync';

interface PairingModalProps {
  roomId: string;
  status: ConnectionStatus;
  isOpen: boolean;
  onClose: () => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  roomId,
  status,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  // Construct URL for phone
  const mobileUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}&mode=remote`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        {/* Title */}
        <div>
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-2 border border-cyan-500/20">
            <Smartphone size={24} />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            PAIR YOUR PHONE
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Scan this QR code with your mobile camera to control this tactics board wirelessly on your TV!
          </p>
        </div>

        {/* QR Code Container */}
        <div className="inline-block p-4 bg-white rounded-2xl shadow-xl shadow-cyan-500/10 border-4 border-slate-800">
          <QRCodeSVG
            value={mobileUrl}
            size={190}
            level="H"
            includeMargin={true}
          />
        </div>

        {/* 4-Digit Room Code */}
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
              TACTICAL ROOM CODE
            </div>
            <div className="text-2xl font-black text-cyan-400 tracking-widest font-mono">
              {roomId}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              status === 'connected'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
            }`}>
              <span className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              {status === 'connected' ? 'Connected' : 'Waiting...'}
            </span>
          </div>
        </div>

        {/* Share Link button */}
        <button
          onClick={handleCopy}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Controller Link'}</span>
        </button>
      </div>
    </div>
  );
};
