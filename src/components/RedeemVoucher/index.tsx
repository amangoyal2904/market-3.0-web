"use client";
import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { dateFormat } from "../../utils";
import Service from "../../network/service";
import APIS_CONFIG from "../../network/api_config.json";
import { APP_ENV, getCookie, setCookieToSpecificTime } from "../../utils"; // Correct import path
import GLOBAL_CONFIG from "../../network/global_config.json";
// import { grxEvent } from "utils/ga";

interface ResponseData {
  code: number;
  status: string;
  message: string;
  expiryDate?: string;
  trialDays?: number;
  cancelDate?: string;
  trialEndDate?: string;
  planType?: string;
  voucherActivationDate?: string;
  planEndDate?: string;
  data?: any;
}

const RedeemVoucher = () => {
  const [voucherCode, setVoucherCode] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [showVoucher, setShowVoucher] = useState<boolean>(false);
  const [isParams, setIsParams] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.has("fromsrc") &&
      params.has("redeemvoucher") &&
      !sessionStorage.getItem("isVouchedOpened")
    ) {
      setShowVoucher(true);
      setVoucherCode(params.get("redeemvoucher") || "");
      setIsParams(true);
      window.ispopup = true;
      //grxEvent('event', {'event_category': 'Redeem Voucher', 'event_action': 'Impression', 'event_label': '-'}, 1);
    }

    const voucherClickedHandler = () => {
      setShowVoucher(true);
      window.ispopup = true;
      //grxEvent('event', {'event_category': 'Redeem Voucher', 'event_action': 'Impression', 'event_label': '-'}, 1);
    };

    document.addEventListener("voucherClicked", voucherClickedHandler);

    return () => {
      document.removeEventListener("voucherClicked", voucherClickedHandler);
    };
  }, []);

  const responseMessage = (response: ResponseData): string => {
    switch (response.code) {
      case 3000:
        return "Subscription created successfully";
      case 3001:
        return "Invalid voucher code";
      case 3002:
        return "Voucher already redeemed. Please enter a new voucher code";
      case 3003:
        return (
          "Voucher code has expired on " +
          dateFormat(response.expiryDate, "%d-%M-%Y") +
          ". Please enter valid code"
        );
      case 3004:
        return (
          "You are currently enjoying a " +
          response.trialDays +
          "-days free trial plan. Please cancel your membership by " +
          dateFormat(response.cancelDate, "%d-%M-%Y") +
          ". After cancellation, you can re-apply this voucher code"
        );
      case 3005:
        return (
          "Voucher applied successfully! Your current " +
          response.trialDays +
          "-days free trial will expire on " +
          dateFormat(response.trialEndDate, "%d-%M-%Y") +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          dateFormat(response.voucherActivationDate, "%d-%M-%Y")
        );
      case 3006:
        return (
          "Voucher applied successfully! Your current plan will expire on " +
          dateFormat(response.planEndDate, "%d-%M-%Y") +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          dateFormat(response.voucherActivationDate, "%d-%M-%Y") +
          "."
        );
      case 3007:
        return (
          "Please cancel your existing membership by " +
          dateFormat(response.cancelDate, "%d-%M-%Y") +
          ". After cancellation, you can re-apply this voucher code."
        );
      case 3008:
        return (
          "Voucher applied successfully! Your current plan will expire on " +
          dateFormat(response.planEndDate, "%d-%M-%Y") +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          dateFormat(response.voucherActivationDate, "%d-%M-%Y") +
          "."
        );
      case 3009:
        return (
          "Voucher applied successfully! Your current plan will expire on " +
          dateFormat(response.planEndDate, "%d-%M-%Y") +
          ". Your new " +
          response.planType +
          " plan will be automatically activated from " +
          dateFormat(response.voucherActivationDate, "%d-%M-%Y") +
          "."
        );
      default:
        return response.message;
    }
  };

  const closeVoucher = () => {
    setShowVoucher(false);
    setVoucherCode("");
    setMessage("");
    //grxEvent('event', {'event_category': 'Redeem Voucher', 'event_action': 'Close Click', 'event_label': ''}, 1);
  };

  const updateCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  const continueReading = () => {
    if (typeof window.ga != "undefined") {
      window.ga(
        "send",
        "event",
        "Voucher Redemption",
        "Continue Reading",
        window.location.href,
      );
    }
    if (isParams) {
      window.location.replace(window.location.pathname);
    } else {
      window.location.reload();
    }
  };

  const submitCode = async () => {
    if (!loading) {
      setLoading(true);
      if (voucherCode && voucherCode.length) {
        const url = (APIS_CONFIG as any).redeemVoucher[APP_ENV];
        const otr = getCookie("OTR");
        const payload = {
          merchantCode: "ET",
          productCode: "ETPR",
          voucherCode: voucherCode,
          country_code: "IN",
        };

        try {
          const headers = {
            "X-TOKEN": otr,
            "X-CLIENT-ID": (GLOBAL_CONFIG as any)[APP_ENV]["X_CLIENT_ID"],
            "Content-type": "application/x-www-form-urlencoded",
          };
          let params = Object.keys(payload)
            .map(function (k) {
              return (
                encodeURIComponent(k) +
                "=" +
                encodeURIComponent((payload as any)[k])
              );
            })
            .join("&");
          const res = await Service.post({
            url,
            headers,
            data: params,
            params: {},
          });
          setLoading(false);
          if (res?.status === 200) {
            const data: ResponseData = await (res as any)?.data;
            if (data.code && data.status === "SUCCESS") {
              sessionStorage.setItem("isVouchedOpened", "true");
              setCookieToSpecificTime("OTR", "", 0, 0, 0);
              setSuccess(true);
            }
            const message = responseMessage(data);
            setMessage(message);

            //grxEvent('event', {'event_category': 'Redeem Voucher', 'event_action': 'Submit Click', 'event_label': '<' + voucherCode + '> - ' + message}, 1);
          } else {
            setMessage("Something went wrong. Please try again");
          }
        } catch (err) {
          setLoading(false);
        }
      } else {
        setMessage("Invalid voucher code");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    showVoucher && (
      <div className={styles.rdmWrapper}>
        <div className={styles.boxWrapper}>
          {!success && (
            <span className={styles.close} onClick={closeVoucher}>
              x
            </span>
          )}
          <img
            src={
              success
                ? (GLOBAL_CONFIG as any).ET_IMG_DOMAIN + "/photo/76811257.cms"
                : (GLOBAL_CONFIG as any).ET_IMG_DOMAIN + "/photo/76647778.cms"
            }
            alt={success ? "Success" : "Coupon"}
          />
          <p className={styles.heading}>
            {success ? "Voucher redeemed successfully" : "REDEEM VOUCHER"}
          </p>
          {!success && (
            <div className={styles.inputBoxWrapper}>
              <p className={styles.helperText}>Enter Voucher Code</p>
              <input
                type="text"
                value={voucherCode}
                className={styles.inputBox}
                maxLength={15}
                onChange={updateCode}
              />
            </div>
          )}
          {message.length > 0 && (
            <p className={success ? styles.successMsg : styles.errorMsg}>
              {message}
            </p>
          )}
          <button
            className={styles.submitBtn}
            onClick={success ? continueReading : submitCode}
            disabled={loading}
          >
            {loading ? "Loading ..." : success ? "CONTINUE READING" : "SUBMIT"}
          </button>
        </div>
      </div>
    )
  );
};

export default RedeemVoucher;
