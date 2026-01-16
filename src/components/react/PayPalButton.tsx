
import { useEffect, useRef, useState } from 'react';

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalButton({
  amount,
  currency = 'USD',
  description,
  onSuccess,
  onError,
  onCancel,
  disabled = false
}: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el SDK de PayPal
  useEffect(() => {
    // Si ya está cargado, marcar como ready
    if (window.paypal) {
      setSdkReady(true);
      return;
    }

    // Obtener el Client ID desde las variables de entorno públicas de Astro
    const clientId = import.meta.env.PUBLIC_PAYPAL_CLIENT_ID;
    
    if (!clientId) {
      setError('PayPal Client ID not configured');
      console.error('PUBLIC_PAYPAL_CLIENT_ID is not set in environment variables');
      return;
    }

    // Cargar el SDK de PayPal
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=en_US&intent=capture`;
    script.addEventListener('load', () => {
      setSdkReady(true);
    });
    script.addEventListener('error', () => {
      setError('Failed to load PayPal SDK');
    });

    document.body.appendChild(script);

    return () => {
      // Cleanup si es necesario
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [currency]);

  // Renderizar el botón de PayPal cuando el SDK esté listo
  useEffect(() => {
    if (!sdkReady || !window.paypal || !paypalRef.current || disabled) {
      return;
    }

    // Limpiar el contenedor antes de renderizar
    paypalRef.current.innerHTML = '';

    try {
      window.paypal
        .Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal',
            height: 55
          },
          
          // Crear la orden
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: description,
                  amount: {
                    currency_code: currency,
                    value: amount.toFixed(2)
                  }
                }
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING'
              }
            });
          },

          // Aprobar el pago
          onApprove: async (data: any, actions: any) => {
            try {
              const details = await actions.order.capture();
              
              // Llamar al callback de éxito
              if (onSuccess) {
                onSuccess(details);
              }

              return details;
            } catch (error) {
              console.error('Error capturing order:', error);
              if (onError) {
                onError(error);
              }
            }
          },

          // Manejo de errores
          onError: (err: any) => {
            console.error('PayPal error:', err);
            if (onError) {
              onError(err);
            }
          },

          // Cancelación del pago
          onCancel: () => {
            if (onCancel) {
              onCancel();
            }
          }
        })
        .render(paypalRef.current);
    } catch (err) {
      console.error('Error rendering PayPal button:', err);
      setError('Failed to render PayPal button');
    }
  }, [sdkReady, amount, currency, description, disabled, onSuccess, onError, onCancel]);

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-center">
        {error}
      </div>
    );
  }

  if (!sdkReady) {
    return (
      <div className="w-full py-5 rounded-md bg-purple-dark/30 animate-pulse">
        <div className="text-center text-cyber-white/60">Loading PayPal...</div>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="w-full py-5 rounded-md bg-purple-dark/30 opacity-50 cursor-not-allowed">
        <div className="text-center text-cyber-white/40">PayPal button disabled</div>
      </div>
    );
  }

  return <div ref={paypalRef} className="w-full" />;
}
