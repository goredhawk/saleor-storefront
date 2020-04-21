import React from "react";

import { filterNotEmptyArrayItems } from "@utils/misc";

import { AddressForm, AddressGridSelector } from "..";
import * as S from "./styles";
import { IProps } from "./types";

/**
 * Address form used in checkout.
 */
const CheckoutAddress: React.FC<IProps> = ({
  checkoutAddress,
  email,
  selectedUserAddressId,
  userAddresses,
  countries,
  userId,
  formRef,
  formId,
  setShippingAddress,
  errors,
  newAddressFormId,
}: IProps) => {
  return (
    <S.Section>
      <S.Title data-cy="checkoutPageSubtitle">SHIPPING ADDRESS</S.Title>
      {userAddresses && userAddresses.length ? (
        <AddressGridSelector
          formId={formId}
          formRef={formRef}
          addresses={userAddresses}
          selectedAddressId={selectedUserAddressId}
          countriesOptions={countries?.filter(filterNotEmptyArrayItems)}
          userId={userId}
          errors={errors}
          onSelect={(address, id) => setShippingAddress(address, undefined, id)}
          newAddressFormId={newAddressFormId}
        />
      ) : (
        <AddressForm
          formId={formId}
          formRef={formRef}
          countriesOptions={countries?.filter(filterNotEmptyArrayItems)}
          address={{
            ...checkoutAddress,
            email,
          }}
          handleSubmit={address =>
            address && setShippingAddress(address, address.email)
          }
          includeEmail={true}
          errors={errors}
        />
      )}
    </S.Section>
  );
};

export { CheckoutAddress };