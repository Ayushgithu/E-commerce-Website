package com.ecom.service;

public interface RazorpayService {

    /**
     * Creates an Order object with the payment gateway.
     * @param totalOrderPrice The total order amount in main currency unit (e.g., INR).
     * @return A JSON string containing the payment gateway Order details (id, amount, currency, key_id).
     */
    String createRazorpayOrder(Double totalOrderPrice) throws Exception;

    /**
     * Verifies the payment signature using the payment gateway's utility.
     * @return true if the signature is valid, false otherwise.
     */
    boolean verifySignature(String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
}