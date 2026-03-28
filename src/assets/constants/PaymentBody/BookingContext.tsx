// import React, { createContext, useContext, useState, ReactNode } from "react";

// // ─── Campos base compartilhados entre os dois tipos ───────────────────────────
// type BookingBase = {
//   valor: number;
//   dataServico: string;
//   nomeCliente: string;
//   nomeBarbeiro: string;
//   statusPagamento: "PENDENTE" | "PAGO" | "CANCELADO";
//   metodoPagamento: "PIX" | "CARTAO_DEBITO" | "CARTAO_CREDITO";
//   produto: string;
//   servico: string;
// };

// // ─── Payload PIX ──────────────────────────────────────────────────────────────
// export type PixPayload = {
//   type: "PIX";
//   data: BookingBase & { metodoPagamento: "PIX" };
//   pix: {
//     chave: string;
//     valor: string;
//   };
// };

// // ─── Payload Cartão ───────────────────────────────────────────────────────────
// export type CardPayload = {
//   type: "CARD";
//   data: BookingBase & { metodoPagamento: "CARTAO_DEBITO" | "CARTAO_CREDITO" };
// };

// export type BookingPayload = PixPayload | CardPayload;

// // ─── Valores padrão ───────────────────────────────────────────────────────────
// const defaultBase: BookingBase = {
//   valor: 0,
//   dataServico: "",
//   nomeCliente: "",
//   nomeBarbeiro: "",
//   statusPagamento: "PENDENTE",
//   metodoPagamento: "PIX",
//   produto: "",
//   servico: "",
// };

// const defaultPayload: PixPayload = {
//   type: "PIX",
//   data: { ...defaultBase, metodoPagamento: "PIX" },
//   pix: { chave: "", valor: "" },
// };

// // ─── Context ──────────────────────────────────────────────────────────────────
// type BookingContextType = {
//   booking: BookingPayload;

//   /** Atualiza qualquer campo de `data` */
//   setField: <K extends keyof BookingBase>(field: K, value: BookingBase[K]) => void;

//   /** Muda o tipo de pagamento e reestrutura o payload automaticamente */
//   setPaymentMethod: (method: BookingBase["metodoPagamento"]) => void;

//   /** Atualiza campos do bloco `pix` (só disponível quando metodoPagamento === "PIX") */
//   setPixField: <K extends keyof PixPayload["pix"]>(
//     field: K,
//     value: PixPayload["pix"][K]
//   ) => void;

//   /** Retorna o payload final pronto para enviar na request */
//   getFinalPayload: () => Omit<PixPayload, "type"> | Omit<CardPayload, "type">;

//   resetBooking: () => void;
// };

// const BookingContext = createContext<BookingContextType | undefined>(undefined);

// // ─── Provider ─────────────────────────────────────────────────────────────────
// export function BookingProvider({ children }: { children: ReactNode }) {
//   const [booking, setBooking] = useState<BookingPayload>(defaultPayload);

//   const setField = <K extends keyof BookingBase>(
//     field: K,
//     value: BookingBase[K]
//   ) => {
//     setBooking((prev) => ({
//       ...prev,
//       data: { ...prev.data, [field]: value },
//     }));
//   };

//   const setPaymentMethod = (method: BookingBase["metodoPagamento"]) => {
//     setBooking((prev) => {
//       const updatedData = { ...prev.data, metodoPagamento: method };

//       if (method === "PIX") {
//         // Monta payload PIX (com bloco pix)
//         const pixPayload: PixPayload = {
//           type: "PIX",
//           data: { ...updatedData, metodoPagamento: "PIX" },
//           pix:
//             prev.type === "PIX"
//               ? prev.pix
//               : { chave: "", valor: String(updatedData.valor) },
//         };
//         return pixPayload;
//       } else {
//         // Monta payload Cartão (sem bloco pix)
//         const cardPayload: CardPayload = {
//           type: "CARD",
//           data: {
//             ...updatedData,
//             metodoPagamento: method,
//           },
//         };
//         return cardPayload;
//       }
//     });
//   };

//   const setPixField = <K extends keyof PixPayload["pix"]>(
//     field: K,
//     value: PixPayload["pix"][K]
//   ) => {
//     setBooking((prev) => {
//       if (prev.type !== "PIX") return prev; // segurança: ignora se não for PIX
//       return {
//         ...prev,
//         pix: { ...prev.pix, [field]: value },
//       };
//     });
//   };

//   /**
//    * Remove o campo interno `type` antes de enviar para a API.
//    * PIX  → { data: {...}, pix: {...} }
//    * Card → { valor, dataServico, nomeCliente, ... }
//    */
//   const getFinalPayload = ():
//     | Omit<PixPayload, "type">
//     | Omit<CardPayload, "type"> => {
//     if (booking.type === "PIX") {
//       const { type, ...rest } = booking;
//       return rest;
//     } else {
//       // Para cartão a API espera os campos direto (sem wrapper "data")
//       const { type, data } = booking;
//       return { data };
//     }
//   };

//   const resetBooking = () => setBooking(defaultPayload);

//   return (
//     <BookingContext.Provider
//       value={{ booking, setField, setPaymentMethod, setPixField, getFinalPayload, resetBooking }}
//     >
//       {children}
//     </BookingContext.Provider>
//   );
// }

// // ─── Hook ─────────────────────────────────────────────────────────────────────
// export function useBooking() {
//   const context = useContext(BookingContext);
//   if (!context) {
//     throw new Error("useBooking must be used within a BookingProvider");
//   }
//   return context;
// }