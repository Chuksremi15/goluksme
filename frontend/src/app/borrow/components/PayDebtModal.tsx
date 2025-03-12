import {
  Button,
  Modal,
  ModalContent,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { useGetLoan } from "../hook/useGetLoan";
import { PoolDebtCard } from "./PoolDebtCard";
import { useTokenBalances } from "../hook/useFetchTokensBalance";
import { USDCAddress } from "@/config/conts";

const PayDebtModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { loan, isLoading: isLoanLoading } = useGetLoan();

  console.log("loan", loan);

  const activeLoans = loan?.activeAmount;

  const {
    balances: tokenDetails,
    isLoading: isTokenDetailsLoading,
    error,
  } = useTokenBalances([USDCAddress]);

  return (
    <div>
      <Button
        onPress={onOpen}
        className="flex items-center text-sm px-12 py-1 font-body rounded-full"
      >
        Pay Debt
      </Button>
      <Modal isOpen={isOpen} size={"2xl"} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: any) => (
            <div className="px-6 py-8  flex flex-col gap-y-4 text-center ">
              {isLoanLoading && isTokenDetailsLoading ? (
                <div className="flex h-full items-center justify-center py-4 text-white">
                  <Spinner />
                </div>
              ) : (
                <>
                  <div>
                    <h6 className="font-head text-xl">Pool Debt</h6>
                  </div>
                  <div className="flex flex-col gap-y-1 mt-1 ">
                    {tokenDetails &&
                      tokenDetails.length > 0 &&
                      activeLoans &&
                      activeLoans.map((activeLoan) => (
                        <PoolDebtCard
                          key={activeLoan.lender}
                          tokenDetails={tokenDetails[0]}
                          activeLoan={activeLoan}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default PayDebtModal;
