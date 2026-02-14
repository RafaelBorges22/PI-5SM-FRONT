import { Linking } from "react-native";
import { buildInfinitePayUrl } from "../utils/DeepLinkBuilder";

export const payWithDebit = async (
  amount: number,
  orderId: string
) => {

  const url = buildInfinitePayUrl({
    amount,
    orderId,
    resultUrl: "projectdsm5sm://tap_result",
    paymentMethod: "debit"
  });

  await Linking.openURL(url);
};
