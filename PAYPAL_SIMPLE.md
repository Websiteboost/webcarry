# 💳 Integración Simple de PayPal

## 🚀 Setup en 2 pasos

### 1. Configurar el Client ID

Edita el archivo `.env` en la raíz del proyecto:

```env
PUBLIC_PAYPAL_CLIENT_ID=AWC9pQBrB1CCd_ppKX7-4-UQOrHAeIlBsfcZ4bBYbrOk28MZcIKk-yX63vBJbmJKzVmKVgfq2kD-knj-
```

### 2. Iniciar el servidor

```bash
pnpm dev
```

**¡Listo!** Ya puedes hacer pagos con PayPal.

---

## 📝 Credenciales (Sandbox)

- **Display Name**: BattleBoost
- **Client ID**: `AWC9pQBrB1CCd_ppKX7-4-UQOrHAeIlBsfcZ4bBYbrOk28MZcIKk-yX63vBJbmJKzVmKVgfq2kD-knj-`
- **Email**: Battleboost.gg@gmail.com
- **Modo**: Sandbox (pruebas)

---

## ✅ Cómo probar

1. Ve a cualquier servicio y haz clic en "Checkout"
2. Acepta los términos
3. Selecciona "PayPal"
4. Haz clic en "Pay Now"
5. Se mostrará el botón de PayPal
6. Completa el pago

---

## 🔄 Cambiar a Producción

Para usar en producción, solo cambia el Client ID en `.env`:

```env
PUBLIC_PAYPAL_CLIENT_ID=tu_client_id_de_produccion
```

Obtén tus credenciales de producción en: https://developer.paypal.com/dashboard/

---

## 📦 Archivos de la Integración

- `src/components/react/PayPalButton.tsx` - Componente del botón
- `src/components/react/PaymentSidebar.tsx` - Integración en el checkout
- `.env` - Configuración del Client ID

---

**Nota**: Esta es una integración simple. PayPal maneja todo el proceso de pago de forma segura. El pago se procesa directamente entre el usuario y PayPal, sin pasar por tu servidor.
