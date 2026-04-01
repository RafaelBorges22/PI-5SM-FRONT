import { Linking } from "react-native";
import { buildInfinitePayUrl } from "../utils/DeepLinkBuilder";

export const payWithCredit = async (
  amount: number,
  orderId: string,
  installments: number
) => {

  const url = buildInfinitePayUrl({
    amount,
    orderId,
    resultUrl: "projectdsm5sm://tap_result",
    paymentMethod: "credit",
    installments
  });

  await Linking.openURL(url);
};