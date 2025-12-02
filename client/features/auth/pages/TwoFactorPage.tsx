import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface TwoFactorPageProps {
  onVerify: (code: string) => Promise<boolean>;
  onResend?: () => Promise<void>;
}

export const TwoFactorPage: React.FC<TwoFactorPageProps> = ({ onVerify, onResend }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newCode.every((digit) => digit !== '') && index === 5) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setCode(newCode);

    if (newCode.every((digit) => digit !== '')) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleSubmit = async (codeString: string) => {
    setIsLoading(true);
    setError('');

    try {
      const success = await onVerify(codeString);
      if (!success) {
        setError('Invalid code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (onResend) {
      await onResend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Two-Factor Authentication</h1>
          <p className="text-slate-600">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Code Input */}
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={isLoading}
                  className={`
                    w-12 h-14 text-center text-2xl font-semibold border-2 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    transition-colors
                    ${error ? 'border-red-300' : 'border-slate-300'}
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                />
              ))}
            </div>

            {isLoading && (
              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Verifying...</span>
              </div>
            )}

            {/* Resend Code */}
            {onResend && (
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Didn't receive a code?</p>
                <button
                  onClick={handleResend}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Resend Code
                </button>
              </div>
            )}

            {/* Back to Login */}
            <div className="text-center pt-4 border-t border-slate-200">
              <a
                href="#login"
                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </a>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Tip:</strong> Open your authenticator app (Google Authenticator, Authy, etc.)
            and enter the 6-digit code shown for LexiFlow AI.
          </p>
        </div>
      </div>
    </div>
  );
};
